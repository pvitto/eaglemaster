// src/app/api/alerts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAlertChecks } from "@/server/alerts";

export async function GET(req: Request) {
  try {
    // Ejecuta reglas al consultar (en prod conviene moverlo a un cron)
    await runAlertChecks();

    // Filtros por rol / userId (opcionales)
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const userId = searchParams.get("userId");

    const where: any = {};
    if (role) where.role = role;
    if (userId) where.userId = Number(userId);

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(alerts, { status: 200 });
  } catch (err) {
    console.error("[/api/alerts] error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
