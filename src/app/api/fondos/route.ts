// src/app/api/fondos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: listar
export async function GET() {
  try {
    const fondos = await prisma.fondo.findMany({
      orderBy: { idFondo: "asc" },
    });
    return NextResponse.json(fondos, { status: 200 });
  } catch (err) {
    console.error("[GET /api/fondos] error:", err);
    return NextResponse.json(
      { error: "No se pudo listar Fondos" },
      { status: 500 }
    );
  }
}

// POST: crear
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, tipo } = body as { nombre?: string; tipo?: string };

    if (!nombre || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos: nombre y tipo son obligatorios" },
        { status: 400 }
      );
    }

    // Debe coincidir con el enum Prisma Tfondo
    const allowed = ["Publico", "Privado"];
    if (!allowed.includes(tipo)) {
      return NextResponse.json(
        { error: `tipo inválido. Use: ${allowed.join(" | ")}` },
        { status: 400 }
      );
    }

    const created = await prisma.fondo.create({
      data: { nombre, tipo: tipo as any }, // Tfondo
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/fondos] error:", err);
    return NextResponse.json(
      { error: "No se pudo crear el Fondo" },
      { status: 500 }
    );
  }
}

// PUT: actualizar
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { idFondo, nombre, tipo } = body as {
      idFondo?: number;
      nombre?: string;
      tipo?: string;
    };

    if (!idFondo) {
      return NextResponse.json(
        { error: "idFondo es obligatorio" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (typeof nombre === "string") data.nombre = nombre;
    if (typeof tipo === "string") {
      const allowed = ["Publico", "Privado"];
      if (!allowed.includes(tipo)) {
        return NextResponse.json(
          { error: `tipo inválido. Use: ${allowed.join(" | ")}` },
          { status: 400 }
        );
      }
      data.tipo = tipo;
    }

    const updated = await prisma.fondo.update({
      where: { idFondo },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("[PUT /api/fondos] error:", err);
    return NextResponse.json(
      { error: "No se pudo actualizar el Fondo" },
      { status: 500 }
    );
  }
}

// DELETE: eliminar múltiples
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { ids } = body as { ids?: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Debe enviar ids: number[]" },
        { status: 400 }
      );
    }

    await prisma.fondo.deleteMany({
      where: { idFondo: { in: ids } },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/fondos] error:", err);
    return NextResponse.json(
      { error: "No se pudieron eliminar los Fondos" },
      { status: 500 }
    );
  }
}
