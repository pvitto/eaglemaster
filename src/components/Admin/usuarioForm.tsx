// src/components/Admin/usuarioForm.tsx
"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface UsuarioFormProps {
  formData: any; // si tienes un tipo Usuario, úsalo aquí
  sedes: Array<{ idSede: number; nombre: string }>;
  isEditMode: boolean;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | void;
}

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
  formData,
  sedes,
  isEditMode,
  onInputChange,
  onSubmit,
}) => {
  return (
    <Card className="p-4">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Nombre</label>
          <input
            className="h-10 rounded-md border px-3"
            name="name"
            value={formData?.name ?? ""}
            onChange={onInputChange}
            placeholder="Nombre"
          />
        </div>

        {/* Apellido */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Apellido</label>
          <input
            className="h-10 rounded-md border px-3"
            name="lastname"
            value={formData?.lastname ?? ""}
            onChange={onInputChange}
            placeholder="Apellido"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            className="h-10 rounded-md border px-3"
            type="email"
            name="email"
            value={formData?.email ?? ""}
            onChange={onInputChange}
            placeholder="email@dominio.com"
          />
        </div>

        {/* Password (solo crear o si quieres permitir cambio) */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password</label>
          <input
            className="h-10 rounded-md border px-3"
            type="password"
            name="password"
            value={formData?.password ?? ""}
            onChange={onInputChange}
            placeholder={isEditMode ? "••••••••" : "Password"}
          />
        </div>

        {/* Rol */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Rol</label>
          <select
            className="h-10 rounded-md border px-3"
            name="role"
            value={formData?.role ?? ""}
            onChange={onInputChange}
          >
            <option value="">Seleccione…</option>
            <option value="administrador">Administrador</option>
            <option value="digitador">Digitador</option>
            <option value="checkinero">Checkinero</option>
            <option value="operario">Operario</option>
          </select>
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Estado</label>
          <select
            className="h-10 rounded-md border px-3"
            name="status"
            value={formData?.status ?? ""}
            onChange={onInputChange}
          >
            <option value="">Seleccione…</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Sede */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Sede</label>
          <select
            className="h-10 rounded-md border px-3"
            name="sedeId"
            value={formData?.sedeId ?? ""}
            onChange={onInputChange}
          >
            <option value="">Seleccione…</option>
            {sedes?.map((s) => (
              <option key={s.idSede} value={s.idSede}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
          <Button type="submit">
            {isEditMode ? "Actualizar usuario" : "Crear usuario"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UsuarioForm;
