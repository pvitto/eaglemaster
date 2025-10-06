import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
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
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[/api/auth/me] error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
