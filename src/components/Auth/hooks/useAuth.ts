"use client";

export function useAuth() {
  const noop = () => {};

  const handleLoginSuccess = async (onSuccess?: () => void) => {
    try {
      // Si necesitas leer algo de la sesión:
      // const session = await fetch("/api/auth/session").then(r => r.json().catch(() => null));
      // console.log("session", session);
      (onSuccess ?? noop)();
    } catch {
      (onSuccess ?? noop)();
    }
  };

  return { handleLoginSuccess };
}
