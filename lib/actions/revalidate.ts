import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { LOCALES } from "@/lib/i18n/config";

/**
 * Revalidates all pages where a doctor can appear:
 * - Root layout (purging the full cache hierarchy across the entire app)
 * - Localized Home pages (/[locale] - Section 7 Our Doctors)
 * - Doctors directory (/[locale]/doctors)
 * - Doctor profile page (/[locale]/doctors/[slug])
 * - Other doctor profile pages (related specialists)
 * - Department detail pages (/[locale]/departments/[slug] - Specialists & Lead)
 * - Service detail pages (/[locale]/services/[slug] - Related Specialists)
 * - Admin pages (/admin, /admin/approvals, /admin/content/doctors, /admin/content/departments)
 */
export async function revalidateDoctorPages(
  doctorSlug?: string,
  departmentSlug?: string,
  serviceSlugs: string[] = []
) {
  // 1. Purge root layout - in Next.js App Router, this invalidates all nested layouts and pages across all locales
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
  } catch (e) {
    console.error("[REVALIDATE_LAYOUT_ERROR]", e);
  }

  // 2. Dynamic route patterns (with type: "page")
  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/doctors", "page");
    revalidatePath("/[locale]/doctors/[slug]", "page");
    revalidatePath("/[locale]/departments", "page");
    revalidatePath("/[locale]/departments/[slug]", "page");
    revalidatePath("/[locale]/services", "page");
    revalidatePath("/[locale]/services/[slug]", "page");
  } catch (e) {
    console.error("[REVALIDATE_PATTERNS_ERROR]", e);
  }

  // 3. Revalidate for each supported locale explicitly
  for (const locale of LOCALES) {
    try {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/doctors`);
      revalidatePath(`/${locale}/departments`);
      revalidatePath(`/${locale}/services`);
      if (doctorSlug) {
        revalidatePath(`/${locale}/doctors/${doctorSlug}`);
      }
      if (departmentSlug) {
        revalidatePath(`/${locale}/departments/${departmentSlug}`);
      }
      for (const sSlug of serviceSlugs) {
        revalidatePath(`/${locale}/services/${sSlug}`);
      }
    } catch (e) {
      console.error(`[REVALIDATE_LOCALE_${locale}_ERROR]`, e);
    }
  }

  // 4. Fallback non-locale paths
  try {
    revalidatePath("/");
    revalidatePath("/doctors");
    if (doctorSlug) revalidatePath(`/doctors/${doctorSlug}`);
    revalidatePath("/departments");
    if (departmentSlug) revalidatePath(`/departments/${departmentSlug}`);
    revalidatePath("/services");
  } catch (e) {
    console.error("[REVALIDATE_FALLBACK_ERROR]", e);
  }

  // 5. Admin dashboard and management pages
  try {
    revalidatePath("/admin");
    revalidatePath("/admin/approvals");
    revalidatePath("/admin/content/doctors");
    revalidatePath("/admin/content/departments");
    revalidatePath("/admin/content/services");
  } catch (e) {
    console.error("[REVALIDATE_ADMIN_ERROR]", e);
  }
}

/**
 * Removes all references to a deleted or archived doctor from all departments:
 * Checks both base `headDoctor` field and localized `translations[locale].headDoctor`
 */
export async function clearDoctorFromDepartments(doctor: {
  id: string;
  fullName: string;
  slug?: string;
  translations?: any;
}) {
  try {
    const namesToClear = new Set<string>();
    if (doctor.fullName) namesToClear.add(doctor.fullName.trim().toLowerCase());
    if (doctor.slug) namesToClear.add(doctor.slug.trim().toLowerCase());
    if (doctor.id) namesToClear.add(doctor.id.trim().toLowerCase());

    if (doctor.translations && typeof doctor.translations === "object") {
      const docTrans = doctor.translations as Record<string, any>;
      for (const lang of Object.keys(docTrans)) {
        if (docTrans[lang]?.fullName) {
          namesToClear.add(String(docTrans[lang].fullName).trim().toLowerCase());
        }
      }
    }

    const departments = await db.department.findMany({
      select: { id: true, headDoctor: true, translations: true },
    });

    for (const dept of departments) {
      let needsUpdate = false;
      let newHeadDoctor = dept.headDoctor;
      let newTranslations = dept.translations as Record<string, any> | null;

      if (dept.headDoctor && namesToClear.has(dept.headDoctor.trim().toLowerCase())) {
        newHeadDoctor = null;
        needsUpdate = true;
      }

      if (newTranslations && typeof newTranslations === "object") {
        let transModified = false;
        const updatedTrans = { ...newTranslations };
        for (const lang of Object.keys(updatedTrans)) {
          if (
            updatedTrans[lang]?.headDoctor &&
            namesToClear.has(String(updatedTrans[lang].headDoctor).trim().toLowerCase())
          ) {
            updatedTrans[lang] = {
              ...updatedTrans[lang],
              headDoctor: null,
            };
            transModified = true;
          }
        }
        if (transModified) {
          newTranslations = updatedTrans;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await db.department.update({
          where: { id: dept.id },
          data: {
            headDoctor: newHeadDoctor,
            translations: newTranslations ?? undefined,
          },
        });
      }
    }
  } catch (error) {
    console.error("[CLEAR_DOCTOR_FROM_DEPTS_ERROR]", error);
  }
}

export async function revalidateDepartmentPages(departmentSlug?: string) {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
  } catch (e) {
    console.error(e);
  }

  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/departments", "page");
    revalidatePath("/[locale]/departments/[slug]", "page");
    revalidatePath("/[locale]/doctors", "page");
    revalidatePath("/[locale]/services", "page");
  } catch (e) {
    console.error(e);
  }

  for (const locale of LOCALES) {
    try {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/departments`);
      if (departmentSlug) {
        revalidatePath(`/${locale}/departments/${departmentSlug}`);
      }
      revalidatePath(`/${locale}/doctors`);
      revalidatePath(`/${locale}/services`);
    } catch (e) {
      console.error(e);
    }
  }

  try {
    revalidatePath("/admin");
    revalidatePath("/admin/approvals");
    revalidatePath("/admin/content/departments");
    revalidatePath("/admin/content/doctors");
  } catch (e) {
    console.error(e);
  }
}

export async function revalidateServicePages(serviceSlug?: string, departmentSlug?: string) {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
  } catch (e) {
    console.error(e);
  }

  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/services", "page");
    revalidatePath("/[locale]/services/[slug]", "page");
    revalidatePath("/[locale]/departments", "page");
    if (departmentSlug) revalidatePath(`/[locale]/departments/${departmentSlug}`, "page");
  } catch (e) {
    console.error(e);
  }

  for (const locale of LOCALES) {
    try {
      revalidatePath(`/${locale}`);
      revalidatePath(`/${locale}/services`);
      if (serviceSlug) {
        revalidatePath(`/${locale}/services/${serviceSlug}`);
      }
      revalidatePath(`/${locale}/departments`);
      if (departmentSlug) {
        revalidatePath(`/${locale}/departments/${departmentSlug}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  try {
    revalidatePath("/admin");
    revalidatePath("/admin/approvals");
    revalidatePath("/admin/content/services");
    revalidatePath("/admin/content/departments");
  } catch (e) {
    console.error(e);
  }
}
