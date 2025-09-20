// src/app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/usuarios
 *   ?email=...   -> filtra por email exacto
 *   ?q=...       -> búsqueda parcial por nombre, apellido o email
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || undefined;
    const q = searchParams.get("q") || undefined;

    const where: any = {};
    if (email) where.email = email;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { lastname: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    const users = await prisma.usuario.findMany({
      where,
      orderBy: { idUsuario: "asc" },
      include: {
        sede: { select: { idSede: true, nombre: true } },
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (e) {
    console.error("[GET /api/usuarios] error:", e);
    return NextResponse.json(
      { error: "Error del servidor listando usuarios." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/usuarios
 *  Body JSON:
 *   {
 *     "name": "...",
 *     "lastname": "...",
 *     "email": "...",
 *     "password": "...",
 *     "role": "administrador" | "digitador" | "operario" | "checkinero",
 *     "status": "Activo" | "Inactivo",
 *     "sedeId": 1 // opcional
 *   }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      lastname,
      email,
      password,
      role,
      status,
      sedeId,
    } = body ?? {};

    // Validación simple
    if (!name || !lastname || !email || !password || !role || !status) {
      return NextResponse.json(
        { error: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    // IMPORTANTE: role y status deben coincidir con los enums del schema.prisma
    // Role: "checkinero" | "digitador" | "operario" | "administrador"
    // State: "Activo" | "Inactivo"

    const newUser = await prisma.usuario.create({
      data: {
        name,
        lastname,
        email,
        password,
        role,   // prisma valida contra enum Role
        status, // prisma valida contra enum State
        ...(sedeId ? { sede: { connect: { idSede: Number(sedeId) } } } : {}),
      },
      include: { sede: { select: { idSede: true, nombre: true } } },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (e: any) {
    // Prisma: unique violation (email)
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "El email ya existe." },
        { status: 409 }
      );
    }
    console.error("[POST /api/usuarios] error:", e);
    return NextResponse.json(
      { error: "Error del servidor creando usuario." },
      { status: 500 }
    );
  }
}
