import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });

    const token = jwt.sign(
      { idUsuario: user.idUsuario, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return NextResponse.json({
      token,
      user: {
        idUsuario: user.idUsuario,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("[/api/auth] error:", err);
    return NextResponse.json({ error: "Error en login" }, { status: 500 });
  }
}
