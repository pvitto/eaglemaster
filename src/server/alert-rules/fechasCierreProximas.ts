// src/server/alert-rules/fechasCierreProximas.ts
import { prisma } from "@/lib/prisma";

// util simple
const addDays = (base: Date, days: number) =>
  new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

// Crea si no existe una alerta OPEN para esta entidad (mismo kind + entityType + entityId)
async function createIfNotExists(args: {
  kind: string;
  title: string;
  message: string;
  severity?: "INFO" | "WARN" | "CRITICAL";
  entityType?: string | null;
  entityId?: number | null;
  role?: "checkinero" | "digitador" | "operario" | "administrador" | null;
  userId?: number | null;
}) {
  const {
    kind,
    title,
    message,
    severity = "WARN",
    entityType = null,
    entityId = null,
    role = null,
    userId = null,
  } = args;

  const exists = await prisma.alert.findFirst({
    where: {
      kind,
      status: "OPEN",
      entityType: entityType ?? undefined,
      entityId: entityId ?? undefined,
    },
  });

  if (exists) return exists;

  return prisma.alert.create({
    data: {
      kind,
      title,
      message,
      severity,
      entityType: entityType ?? undefined,
      entityId: entityId ?? undefined,
      role: role ?? undefined,
      userId: userId ?? undefined,
    },
  });
}

/**
 * Recorre fechas de cierre dentro del rango [hoy, hoy + days]
 * y crea una alerta OPEN para cada una que no la tenga.
 */
export async function checkFechasCierreProximas(days = 3) {
  const now = new Date();
  const limit = addDays(now, days);

  const proximas = await prisma.fechaCierre.findMany({
    where: {
      fecha_a_cerrar: {
        gte: now,
        lte: limit,
      },
    },
    select: {
      idFechaCierre: true,
      fecha_a_cerrar: true,
      fondo: {
        select: { nombre: true },
      },
    },
  });

  for (const fc of proximas) {
    const titulo = `Cierre próximo (${fc.fondo?.nombre ?? "Fondo"})`;
    const msg = `Faltan ${days} días o menos para cerrar la caja. Fecha: ${fc.fecha_a_cerrar.toLocaleDateString()}`;

    await createIfNotExists({
      kind: "FECHA_CIERRE_PROX",
      title: titulo,
      message: msg,
      severity: "WARN",
      entityType: "FechaCierre",
      entityId: fc.idFechaCierre,
      role: "operario", // <--- destino por rol; puedes cambiarlo
      // userId: 123,    // <--- si quieres dirigirla a un usuario concreto
    });
  }
}
