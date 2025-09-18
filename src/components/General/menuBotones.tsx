// src/components/General/menuBotones.tsx
"use client";
import { Button } from "@/components/ui/button";

export interface OpcionMenu {
  id: string;            // <-- debe ser: "usuarios" | "fondos" | ...
  label: string;
  estadoKey: string;     // ej: "isUsuarios"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

interface MenuBotonesProps {
  opciones: OpcionMenu[];
  estados: Record<string, boolean>;
  setEstados: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onSelect: (id: string) => void;        // <-- NUEVO
  onResetSelection?: () => void;
  activeKey?: string;                    // <-- opcional (por si quieres estilos activos)
}

export function MenuBotones({
  opciones,
  estados,
  setEstados,
  onSelect,              // <-- NUEVO
  onResetSelection,
  activeKey,
}: MenuBotonesProps) {
  const handleClick = (opcion: OpcionMenu) => {
    // En vez de “toggle”, dejamos exactamente UNO activo
    const next: Record<string, boolean> = {};
    for (const op of opciones) next[op.estadoKey] = op.estadoKey === opcion.estadoKey;
    setEstados(next);

    onSelect(opcion.id);          // <-- le decimos al padre qué tabla mostrar
    onResetSelection?.();
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      {opciones.map((opcion) => {
        const isActive = activeKey ? activeKey === opcion.id : !!estados[opcion.estadoKey];
        return (
          <Button
            key={opcion.id}
            onClick={() => handleClick(opcion)}
            variant={opcion.variant || "default"}
            className={`${opcion.className || ""} ${isActive ? "bg-teal-700" : ""}`}
          >
            {opcion.label}
          </Button>
        );
      })}
    </div>
  );
}
