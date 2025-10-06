// src/hooks/useAuth.ts
"use client";

import { useState } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en login");

    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error obteniendo usuario");

    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, fetchUser, logout };
}
