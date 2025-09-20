// src/components/General/menuBotones.tsx
"use client";
import { Button } from "@/components/ui/button";

export interface OpcionMenu {
  id: string;
  label: string;
  estadoKey: string;   // <- necesario para useAdmin
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

interface MenuBotonesProps {
  opciones: OpcionMenu[];
  estados: Record<string, boolean>;
  setEstados: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onResetSelection?: () => void;
  // opcionales (para que no rompa tipos)
  onSelect?: (id: string) => void;
  activeKey?: string;
}

export function MenuBotones({
  opciones,
  estados,
  setEstados,
  onResetSelection,
  onSelect,
}: MenuBotonesProps) {
  const handleClick = (opcion: OpcionMenu) => {
    const next = { ...estados };
    next[opcion.estadoKey] = !next[opcion.estadoKey];
    Object.keys(next).forEach((k) => { if (k !== opcion.estadoKey) next[k] = false; });
    setEstados(next);
    onResetSelection?.();
    onSelect?.(opcion.id);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {opciones.map((op) => (
        <Button
          key={op.id}
          onClick={() => handleClick(op)}
          variant={op.variant || "default"}
          className={op.className}
        >
          {estados[op.estadoKey] ? op.label.replace("Abrir", "Cerrar") : op.label}
        </Button>
      ))}
    </div>
  );
}
