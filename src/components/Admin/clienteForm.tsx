// src/components/Admin/clienteForm.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Fondo, Sede } from "@/types/interfaces";
import React from "react";

export interface ClienteFormData {
  idCliente?: number;
  name?: string;
  fondoId?: number | string; // llega como string desde <select>
  sedeId?: number | string | null; // opcional
}

interface ClienteFormProps {
  formData: ClienteFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEditMode: boolean;
  fondos: Fondo[];
  sedes: Sede[];
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
  fondos,
  sedes,
}) => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow mb-6">
      <form onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Editar Cliente" : "Crear Cliente"}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name ?? ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fondo
            </label>
            <select
              name="fondoId"
              value={formData.fondoId?.toString() ?? ""}
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
              required
            >
              <option value="">Seleccione un fondo</option>
              {fondos.map((f) => (
                <option key={f.idFondo} value={f.idFondo}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Sede (opcional)
            </label>
            <select
              name="sedeId"
              value={
                formData.sedeId === null || formData.sedeId === undefined
                  ? ""
                  : formData.sedeId.toString()
              }
              onChange={onInputChange}
              className="w-full px-3 py-2 mt-1 border rounded"
            >
              <option value="">Sin sede</option>
              {sedes.map((s) => (
                <option key={s.idSede} value={s.idSede}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800">
            {isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
