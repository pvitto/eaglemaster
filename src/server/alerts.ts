// src/server/alerts.ts
import { prisma } from "@/lib/prisma";

// rango "hoy a +N"
const addDays = (base: Date, days: number) =>
  new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

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

  // Si existe una alerta OPEN/ACK para esa misma entidad/rol/usuario, no duplicar
  const exists = await prisma.alert.findFirst({
    where: {
      kind,
      status: { in: ["OPEN", "ACK"] },
      entityType: entityType ?? undefined,
      entityId: entityId ?? undefined,
      role: role ?? undefined,
      userId: userId ?? undefined,
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

/** Regla 1: fechas de cierre en los próximos N días (>= hoy y <= hoy+N) */
async function checkFechaCierreProxima(days = 3) {
  const now = new Date();
  const limit = addDays(now, days);

  const proximas = await prisma.fechaCierre.findMany({
    where: {
      fecha_a_cerrar: { gte: now, lte: limit },
    },
    select: {
      idFechaCierre: true,
      fecha_a_cerrar: true,
      fondo: { select: { nombre: true } },
    },
  });

  for (const fc of proximas) {
    const titulo = `Fecha de cierre próxima${fc.fondo?.nombre ? ` (${fc.fondo.nombre})` : ""}`;
    const msg = `La fecha ${fc.fecha_a_cerrar.toISOString().slice(0, 10)} está dentro de ${days} días o menos.`;

    await createIfNotExists({
      kind: "FECHA_CIERRE_PROX",
      title: titulo,
      message: msg,
      severity: "WARN",
      entityType: "FechaCierre",
      entityId: fc.idFechaCierre,
      role: "operario", // cambia el destino si quieres
      // userId: 123,   // o dirige a un usuario concreto
    });
  }
}

/** Regla 2: check-ins sin servicio asociados más antiguos que N horas */
async function checkCheckinPendiente(hours = 4) {
  const limit = new Date(Date.now() - hours * 60 * 60 * 1000);

  const pendientes = await prisma.checkin.findMany({
    where: {
      fechaRegistro: { lt: limit },
      servicio: null, // sin servicio -> pendiente
    },
    select: { idCheckin: true, fechaRegistro: true },
  });

  for (const ch of pendientes) {
    await createIfNotExists({
      kind: "CHECKIN_PENDIENTE",
      title: "Check-in pendiente",
      message: `Check-in #${ch.idCheckin} desde ${new Date(ch.fechaRegistro).toLocaleString()}.`,
      severity: "WARN",
      entityType: "Checkin",
      entityId: ch.idCheckin,
      role: "digitador",
    });
  }
}

/** Ejecuta todas las reglas */
export async function runAlertChecks() {
  await checkFechaCierreProxima(3);
  await checkCheckinPendiente(4);
}
