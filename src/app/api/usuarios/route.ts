// src/app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/usuarios  -> crear
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("[API usuarios][POST] payload:", payload);

    // ⚠️ AJUSTA estos nombres a tu schema.prisma (esto es un EJEMPLO)
    // Si en schema el modelo Usuario tiene name, lastname, email, password, role, status, sedeId:
    const data = {
      name: payload.nombre,          // <-- mapeo 'nombre' (front) -> 'name' (DB)
      lastname: payload.apellido,    // <-- idem
      email: payload.email,
      password: payload.password,
      role: payload.rol,             // 'rol' (front) -> 'role' (DB)
      status: payload.estado,        // 'estado' (front) -> 'status' (DB)
      sedeId: payload.sedeId ?? null // opcional
    };

    console.log("[API usuarios][POST] data para Prisma:", data);

    const created = await prisma.usuario.create({ data });
    console.log("[API usuarios][POST] created:", created);

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("[API usuarios][POST] error:", err);
    return NextResponse.json(
      { error: err?.message || "Error creando usuario" },
      { status: 400 }
    );
  }
}

// PUT /api/usuarios  -> actualizar
export async function PUT(req: Request) {
  try {
    const payload = await req.json();
    console.log("[API usuarios][PUT] payload:", payload);

    const id = Number(payload.idUsuario);
    if (!id) {
      return NextResponse.json(
        { error: "idUsuario es requerido" },
        { status: 400 }
      );
    }

    // ⚠️ AJUSTA nombres a tu schema.prisma
    const data = {
      name: payload.nombre,
      lastname: payload.apellido,
      email: payload.email,
      password: payload.password,
      role: payload.rol,
      status: payload.estado,
      sedeId: payload.sedeId ?? null
    };

    console.log("[API usuarios][PUT] data para Prisma:", { id, data });

    const updated = await prisma.usuario.update({
      where: { idUsuario: id }, // o { id: id } según tu modelo
      data,
    });
    console.log("[API usuarios][PUT] updated:", updated);

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("[API usuarios][PUT] error:", err);
    return NextResponse.json(
      { error: err?.message || "Error actualizando usuario" },
      { status: 400 }
    );
  }
}
