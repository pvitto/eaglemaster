// src/app/api/rutas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Modelo esperado (ejemplo):
 * model RutaLlegada {
 *   idRutaLlegada Int     @id @default(autoincrement())
 *   nombre        String
 *   descripcion   String?
 *   checkins      Checkin[]
 *   createdAt     DateTime @default(now())
 * }
 */

export async function GET() {
  try {
    const rutas = await prisma.rutaLlegada.findMany({
      orderBy: { idRutaLlegada: "desc" },
    });
    return NextResponse.json(rutas, { status: 200 });
  } catch (err) {
    console.error("[GET /api/rutas] error:", err);
    return NextResponse.json(
      { error: "No se pudieron cargar las rutas" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Parse seguro (evita “Unexpected end of JSON input”)
    const text = await req.text();
    const body = text ? JSON.parse(text) : {};
    const { nombre, descripcion } = body;

    if (!nombre || typeof nombre !== "string") {
      return NextResponse.json(
        { error: "El campo 'nombre' es obligatorio" },
        { status: 400 }
      );
    }

    const ruta = await prisma.rutaLlegada.create({
      data: {
        nombre,
        descripcion: descripcion ?? "",
      },
    });

    return NextResponse.json(ruta, { status: 201 });
  } catch (err) {
    console.error("[POST /api/rutas] error:", err);
    return NextResponse.json(
      { error: "No se pudo crear la ruta" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const text = await req.text();
    const body = text ? JSON.parse(text) : {};
    const { idRutaLlegada, nombre, descripcion } = body;

    if (!idRutaLlegada) {
      return NextResponse.json(
        { error: "Falta 'idRutaLlegada' para actualizar" },
        { status: 400 }
      );
    }

    const ruta = await prisma.rutaLlegada.update({
      where: { idRutaLlegada: Number(idRutaLlegada) },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
      },
    });

    return NextResponse.json(ruta, { status: 200 });
  } catch (err) {
    console.error("[PUT /api/rutas] error:", err);
    return NextResponse.json(
      { error: "No se pudo actualizar la ruta" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const text = await req.text();
    const body = text ? JSON.parse(text) : {};
    const { ids } = body as { ids?: number[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Debes enviar 'ids' (array) para eliminar" },
        { status: 400 }
      );
    }

    await prisma.rutaLlegada.deleteMany({
      where: { idRutaLlegada: { in: ids.map(Number) } },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/rutas] error:", err);
    return NextResponse.json(
      { error: "No se pudieron eliminar las rutas" },
      { status: 500 }
    );
  }
}
