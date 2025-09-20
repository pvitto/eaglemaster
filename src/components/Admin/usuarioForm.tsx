// src/components/Admin/usuarioForm.tsx
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Estado = "Activo" | "Inactivo";
type Rol = "checkinero" | "digitador" | "operario" | "administrador";

export interface UsuarioFormProps {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isEditMode: boolean;
  sedes: { idSede: number; nombre: string }[];
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isEditMode,
  sedes,
}) => {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label>Nombre</label>
        <input
          name="name"
          value={formData.name ?? ""}
            onChange={onInputChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label>Apellido</label>
        <input
          name="lastname"
          value={formData.lastname ?? ""}
          onChange={onInputChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="md:col-span-2">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email ?? ""}
          onChange={onInputChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password ?? ""}
          onChange={onInputChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label>Estado</label>
        <select
          name="status"
          value={formData.status ?? ""}
          onChange={onInputChange}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>Seleccione estado...</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      <div>
        <label>Rol</label>
        <select
          name="role"
          value={formData.role ?? ""}
          onChange={onInputChange}
          className="w-full border rounded p-2"
        >
          <option value="" disabled>Seleccione rol...</option>
          <option value="checkinero">Checkinero</option>
          <option value="digitador">Digitador</option>
          <option value="operario">Operario</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>

      <div>
        <label>Sede</label>
        <select
          name="sedeId"
          value={formData.sedeId ?? ""}
          onChange={onInputChange}
          className="w-full border rounded p-2"
        >
          <option value="">Sin sede</option>
          {sedes.map((s) => (
            <option key={s.idSede} value={s.idSede}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <button type="submit" className="bg-cyan-700 text-white px-4 py-2 rounded">
          {isEditMode ? "Actualizar usuario" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
};
