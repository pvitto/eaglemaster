"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type AlertType = "success" | "error" | "info" | "warning";

export type InfoAlert = {
  id: string;
  type?: AlertType;
  title?: string;
  message?: string;
  duration?: number; // ms (auto-cierre)
};

type Ctx = {
  push: (a: Omit<InfoAlert, "id">) => void;
  remove: (id: string) => void;
  items: InfoAlert[];
};

const InfoAlertCtx = createContext<Ctx | null>(null);

export function InfoAlertProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InfoAlert[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const push = useCallback((a: Omit<InfoAlert, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const item: InfoAlert = {
      id,
      type: a.type ?? "info",
      title: a.title ?? "",
      message: a.message ?? "",
      duration: a.duration ?? 3000,
    };
    setItems((prev) => [...prev, item]);

    if (item.duration! > 0) {
      setTimeout(() => remove(id), item.duration);
    }
  }, [remove]);

  const value = useMemo(() => ({ items, push, remove }), [items, push, remove]);

  return (
    <InfoAlertCtx.Provider value={value}>
      {children}
      {/* Contenedor visual de toasts */}
      <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2">
        {items.map((i) => (
          <Toast key={i.id} item={i} onClose={() => remove(i.id)} />
        ))}
      </div>
    </InfoAlertCtx.Provider>
  );
}

export function useInfoAlert() {
  const ctx = useContext(InfoAlertCtx);
  if (!ctx) throw new Error("useInfoAlert debe usarse dentro de <InfoAlertProvider>");
  return ctx;
}

/* UI del toast */
function Toast({ item, onClose }: { item: InfoAlert; onClose: () => void }) {
  const color =
    item.type === "success" ? "bg-emerald-600" :
    item.type === "error"   ? "bg-red-600"     :
    item.type === "warning" ? "bg-amber-600"   :
                              "bg-cyan-600";

  const icon =
    item.type === "success" ? "✓" :
    item.type === "error"   ? "✕" :
    item.type === "warning" ? "!" :
                              "ℹ";

  return (
    <div className="pointer-events-auto overflow-hidden rounded-lg shadow-lg ring-1 ring-black/10 animate-in fade-in slide-in-from-top-2">
      <div className={`${color} px-4 py-3 text-white`}>
        <div className="flex items-start gap-3">
          <div className="mt-[2px] text-xl leading-none">{icon}</div>
          <div className="flex-1">
            {item.title ? <div className="font-semibold">{item.title}</div> : null}
            {item.message ? <div className="text-sm opacity-95">{item.message}</div> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-white/90 hover:bg-white/10"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
