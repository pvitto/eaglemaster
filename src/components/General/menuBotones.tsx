// src/components/General/menuBotones.tsx
"use client";

import { Button } from "@/components/ui/button";

export interface OpcionMenu {
  id: string;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

interface MenuBotonesProps {
  opciones: OpcionMenu[];
  /** id activo (tabla seleccionada) */
  activeKey: string;
  /** setea o limpia selección */
  onSelect: (id: string) => void;
  /** opcional: limpieza extra del padre */
  onResetSelection?: () => void;
}

export function MenuBotones({
  opciones,
  activeKey,
  onSelect,
  onResetSelection,
}: MenuBotonesProps) {
  const handleClick = (id: string) => {
    const next = activeKey === id ? "" : id; // toggle
    onSelect(next);
    if (next === "" && onResetSelection) onResetSelection();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      {opciones.map((op) => {
        const isActive = activeKey === op.id;
        return (
          <Button
            key={op.id}
            onClick={() => handleClick(op.id)}
            variant={op.variant || "default"}
            className={op.className}
          >
            {isActive ? op.label.replace("Administrar", "Cerrar") : op.label}
          </Button>
        );
      })}
    </div>
  );
}
