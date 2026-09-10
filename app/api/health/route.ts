import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    hospital: "Medhen Beza Hospital",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
