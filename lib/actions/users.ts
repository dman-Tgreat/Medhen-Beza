"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { adminUserSchema } from "@/lib/validation/schemas";

export interface ActionResult<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  roleTitle: string;
  roleId: string;
  department: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export async function getAdminUsersAction(): Promise<ActionResult<AdminUserItem[]>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to view users." };
  }

  try {
    const users = await db.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const mapped: AdminUserItem[] = users.map((u) => {
      const primaryRole = u.userRoles[0]?.role;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: primaryRole?.code || "CONTENT_STAFF",
        roleTitle: primaryRole?.name || "Staff Member",
        roleId: primaryRole?.id || "",
        department: "General Administration",
        isActive: u.isActive,
        lastLogin: u.updatedAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        createdAt: u.createdAt.toISOString(),
      };
    });

    return { success: true, data: mapped };
  } catch (err: any) {
    return { error: err.message || "Failed to load users from database." };
  }
}

export async function saveAdminUserAction(data: {
  id?: string;
  name: string;
  email: string;
  roleCode: string;
  department?: string;
  password?: string;
}): Promise<ActionResult<AdminUserItem>> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized: You must be logged in to manage users." };
  }

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"].includes(r)
  );

  if (!isAuthorized) {
    return {
      error: "Forbidden: Only Hospital Directors and System Admins can manage users.",
    };
  }

  try {
    const role = await db.role.findFirst({
      where: { code: data.roleCode },
    });

    if (!role) {
      return { error: `Invalid role specified: ${data.roleCode}` };
    }

    const validation = adminUserSchema.safeParse(data);
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || "Invalid user credentials provided." };
    }
    const validated = validation.data;

    const existingWithEmail = await db.user.findUnique({
      where: { email: validated.email },
    });
    if (existingWithEmail && existingWithEmail.id !== data.id) {
      return { error: `A staff member with email "${validated.email}" already exists.` };
    }

    if (data.id) {
      // UPDATE EXISTING USER
      const existingUser = await db.user.findUnique({
        where: { id: data.id },
      });

      if (!existingUser) {
        return { error: "User not found." };
      }

      const updateData: any = {
        name: validated.name,
        email: validated.email,
      };

      if (data.password && data.password.trim().length >= 6) {
        updateData.password = await bcrypt.hash(data.password.trim(), 10);
      }

      const updatedUser = await db.user.update({
        where: { id: data.id },
        data: updateData,
      });

      // Update role mapping
      await db.userRole.deleteMany({
        where: { userId: data.id },
      });

      await db.userRole.create({
        data: {
          userId: data.id,
          roleId: role.id,
        },
      });

      // Audit Log
      await db.auditLog.create({
        data: {
          userId: session.id,
          userEmail: session.email,
          userName: session.name,
          action: "UPDATE",
          contentType: "User",
          contentId: data.id,
          changes: JSON.stringify({ name: data.name, email: data.email, role: role.code }),
        },
      });

      revalidatePath("/admin/users");
      return {
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: role.code,
          roleTitle: role.name,
          roleId: role.id,
          department: data.department || "General Administration",
          isActive: updatedUser.isActive,
          lastLogin: updatedUser.updatedAt.toLocaleDateString(),
          createdAt: updatedUser.createdAt.toISOString(),
        },
      };
    } else {
      // CREATE NEW USER
      const existingWithEmail = await db.user.findUnique({
        where: { email: data.email.toLowerCase().trim() },
      });

      if (existingWithEmail) {
        return { error: `A user with email ${data.email} already exists.` };
      }

      const initialPassword = data.password && data.password.trim().length >= 6
        ? data.password.trim()
        : "HospitalPass123!";
      const hashedPassword = await bcrypt.hash(initialPassword, 10);

      const newUser = await db.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          isActive: true,
          userRoles: {
            create: {
              roleId: role.id,
            },
          },
        },
      });

      // Audit Log
      await db.auditLog.create({
        data: {
          userId: session.id,
          userEmail: session.email,
          userName: session.name,
          action: "CREATE",
          contentType: "User",
          contentId: newUser.id,
          changes: JSON.stringify({ name: newUser.name, email: newUser.email, role: role.code }),
        },
      });

      revalidatePath("/admin/users");
      return {
        success: true,
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: role.code,
          roleTitle: role.name,
          roleId: role.id,
          department: data.department || "General Administration",
          isActive: newUser.isActive,
          lastLogin: "Never",
          createdAt: newUser.createdAt.toISOString(),
        },
      };
    }
  } catch (err: any) {
    return { error: err.message || "Failed to save user." };
  }
}

export async function toggleAdminUserActiveAction(userId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"].includes(r)
  );

  if (!isAuthorized) {
    return { error: "Forbidden: Insufficient permissions." };
  }

  if (userId === session.id) {
    return { error: "You cannot disable your own active account." };
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found." };

    const updated = await db.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userEmail: session.email,
        userName: session.name,
        action: "UPDATE",
        contentType: "User",
        contentId: userId,
        changes: JSON.stringify({ isActive: updated.isActive }),
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update user status." };
  }
}

export async function deleteAdminUserAction(userId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized." };
  }

  const isAuthorized = session.roles.some((r) =>
    ["HOSPITAL_DIRECTOR", "SYSTEM_ADMIN"].includes(r)
  );

  if (!isAuthorized) {
    return { error: "Forbidden: Insufficient permissions." };
  }

  if (userId === session.id) {
    return { error: "You cannot delete your own account." };
  }

  try {
    await db.user.delete({
      where: { id: userId },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userEmail: session.email,
        userName: session.name,
        action: "DELETE",
        contentType: "User",
        contentId: userId,
      },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete user." };
  }
}
