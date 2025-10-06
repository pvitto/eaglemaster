// src/app/logout/page.tsx
"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    const doLogout = async () => {
      try {
        // 👇 signOut no devuelve JSON, simplemente redirige o limpia sesión
        await signOut({
          callbackUrl: "/", // a dónde quieres mandar después del logout
          redirect: true,   // 🔑 importante para evitar que intente parsear
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    doLogout();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-bl from-slate-400 to-cyan-800 text-white">
      <h1 className="text-2xl font-bold">Cerrando sesión...</h1>
    </div>
  );
}
