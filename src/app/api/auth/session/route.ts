// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

// GET /api/auth/session  -> alias de /api/auth/me
export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return NextResponse.json({ user: null, error: "No autorizado" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ user: null, error: "Token inválido" }, { status: 401 });
    }

    const user = await prisma.usuario.findUnique({
      where: { idUsuario: payload.idUsuario },
      select: {
        idUsuario: true,
        name: true,
        lastname: true,
        email: true,
        role: true,
        status: true,
        sedeId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null, error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[/api/auth/session] error:", err);
    return NextResponse.json({ user: null, error: "Error interno" }, { status: 500 });
  }
}
