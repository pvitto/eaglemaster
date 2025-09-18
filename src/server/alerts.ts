// src/server/alerts.ts
import { prisma } from "@/lib/prisma";

// util
function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function createIfNotExists(args: {
  kind: string;
  title: string;
  message: string;
  severity?: "INFO" | "WARN" | "CRITICAL";
  entityType?: string | null;
  entityId?: number | null;
  role?: "checkinero" | "digitador" | "operario" | "administrador" | null;
}) {
  const { kind, title, message, severity = "WARN", entityType = null, entityId = null, role = null } = args;

  const exists = await prisma.alert.findFirst({
    where: {
      kind,
      entityType: entityType ?? undefined,
      entityId: entityId ?? undefined,
      status: { in: ["OPEN", "ACK"] },
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
    },
  });
}

// Regla 1: Fecha de cierre dentro de N días (usa fecha_a_cerrar e idFechaCierre)
async function checkFechaCierreProxima(days = 3) {
  const limite = daysFromNow(days);

  const proximas = await prisma.fechaCierre.findMany({
    where: { fecha_a_cerrar: { lte: limite } },
    select: { idFechaCierre: true, fecha_a_cerrar: true },
  });

  for (const fc of proximas) {
    await createIfNotExists({
      kind: "FECHA_CIERRE_PROX",
      title: "Fecha de cierre próxima",
      message: `La fecha ${fc.fecha_a_cerrar.toISOString().slice(0, 10)} está dentro de ${days} días.`,
      severity: "WARN",
      entityType: "FechaCierre",
      entityId: fc.idFechaCierre,
      role: "digitador",
    });
  }
}

// Regla 2: Checkin pendiente (> N horas) = checkin SIN servicio relacionado
async function checkCheckinPendiente(hours = 4) {
  const limite = new Date(Date.now() - hours * 60 * 60 * 1000);

  const pendientes = await prisma.checkin.findMany({
    where: {
      fechaRegistro: { lt: limite },
      servicio: null, // si no hay servicio, está pendiente
    },
    select: { idCheckin: true, fechaRegistro: true },
  });

  for (const ch of pendientes) {
    await createIfNotExists({
      kind: "CHECKIN_PENDIENTE",
      title: "Checkin pendiente",
      message: `Checkin #${ch.idCheckin} desde ${new Date(ch.fechaRegistro).toLocaleString()}.`,
      severity: "WARN",
      entityType: "Checkin",
      entityId: ch.idCheckin,
      role: "operario",
    });
  }
}

// Lanza todas las reglas
export async function runAlertChecks() {
  await checkFechaCierreProxima(3);
  await checkCheckinPendiente(4);
}
