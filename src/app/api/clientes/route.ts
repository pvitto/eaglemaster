// src/app/api/clientes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { idCliente: "asc" },
      include: {
        fondo: true,
        sede: true,
      },
    });
    return NextResponse.json(clientes, { status: 200 });
  } catch (err: any) {
    console.error("[/api/clientes][GET] error:", err);
    return NextResponse.json({ error: err?.message || "GET failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalización segura
    const name: string = (body.name ?? "").toString().trim();
    const fondoIdRaw = body.fondoId;
    const sedeIdRaw = body.sedeId;

    // fondoId es requerido
    const fondoId = Number(fondoIdRaw);
    if (!name) throw new Error("El nombre es obligatorio");
    if (!Number.isFinite(fondoId)) throw new Error("fondoId inválido");

    // sedeId es opcional (puede ser null)
    const sedeId = sedeIdRaw === "" || sedeIdRaw == null ? null : Number(sedeIdRaw);
    if (sedeId !== null && !Number.isFinite(sedeId)) {
      throw new Error("sedeId inválido");
    }

    const created = await prisma.cliente.create({
      data: {
        name,
        fondoId,
        // @relation opcional
        sedeId: sedeId as number | null,
      },
      include: { fondo: true, sede: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("[/api/clientes][POST] error:", err);
    return NextResponse.json({ error: err?.message || "POST failed" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const id = Number(body.idCliente);
    if (!Number.isFinite(id)) throw new Error("idCliente inválido");

    const name = (body.name ?? "").toString().trim();
    const fondoId = Number(body.fondoId);
    const sedeId = body.sedeId === "" || body.sedeId == null ? null : Number(body.sedeId);
    if (!name) throw new Error("El nombre es obligatorio");
    if (!Number.isFinite(fondoId)) throw new Error("fondoId inválido");
    if (sedeId !== null && !Number.isFinite(sedeId)) {
      throw new Error("sedeId inválido");
    }

    const updated = await prisma.cliente.update({
      where: { idCliente: id },
      data: {
        name,
        fondoId,
        sedeId: sedeId as number | null,
      },
      include: { fondo: true, sede: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("[/api/clientes][PUT] error:", err);
    return NextResponse.json({ error: err?.message || "PUT failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const ids: number[] = Array.isArray(body.ids) ? body.ids : [];

    if (!ids.length) throw new Error("No se enviaron ids");

    await prisma.cliente.deleteMany({
      where: { idCliente: { in: ids } },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("[/api/clientes][DELETE] error:", err);
    return NextResponse.json({ error: err?.message || "DELETE failed" }, { status: 400 });
  }
}
