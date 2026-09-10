import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rolesCount, departmentsCount, doctorsCount, servicesCount] = await Promise.all([
      db.role.count(),
      db.department.count(),
      db.doctor.count(),
      db.service.count(),
    ]);

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      hospital: "Medhen Beza Hospital",
      stats: {
        roles: rolesCount,
        departments: departmentsCount,
        doctors: doctorsCount,
        services: servicesCount,
      },
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
