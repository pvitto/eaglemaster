// src/app/api/alerts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAlertChecks } from "@/server/alerts";

export async function GET() {
  try {
    await runAlertChecks(); // si aquí explota, lo capturamos
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(alerts, { status: 200 });
  } catch (err) {
    console.error("[/api/alerts] error:", err);
    // devolvemos arreglo vacío para no romper el front
    return NextResponse.json([], { status: 200 });
  }
}
