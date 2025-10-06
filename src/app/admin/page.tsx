import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import Admin from "./page.client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export default async function AdminPage() {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      // sin token => no logueado
      return <Admin user={null} error="No hay sesión" />;
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return <Admin user={null} error="Sesión inválida" />;
    }

    const user = await prisma.usuario.findUnique({
      where: { email: payload.email },
      select: {
        idUsuario: true,
        name: true,
        lastname: true,
        email: true,
        role: true,
        status: true,
        sedeId: true,
        sede: { select: { nombre: true } },
      },
    });

    if (!user) {
      return <Admin user={null} error="Usuario no encontrado" />;
    }

    return <Admin user={user as any} error={null} />;
  } catch (error) {
    console.error("[/admin] load user error:", error);
    return <Admin user={null} error="Error al cargar usuario" />;
  }
}
