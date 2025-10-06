"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  onSuccess?: () => void;               // opcional
  onError?: (msg: string) => void;      // opcional
};

export default function LoginForm({ onSuccess, onError }: Props) {
  const [email, setEmail] = useState("admin@demo.local");
  const [password, setPassword] = useState("Admin123*");
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMsg(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!result || result.error) {
      const err = result?.error ?? "Error de autenticación";
      setMsg(err);
      onError?.(err);
      setIsPending(false);
      return;
    }

    onSuccess?.();
    setIsPending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow w-[420px]"
    >
      <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

      {msg && <p className="text-center text-red-600 mb-4">{msg}</p>}

      <label className="block text-sm mb-1">Usuario:</label>
      <input
        className="w-full border rounded p-2 mb-4 bg-slate-50"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />

      <label className="block text-sm mb-1">Contraseña:</label>
      <input
        className="w-full border rounded p-2 mb-6 bg-slate-50"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal-700 text-white font-semibold py-2 rounded disabled:opacity-60"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
