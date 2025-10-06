"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/General/use-toast";
import { useFetchData } from "@/hooks/General/useFetchData";
import { opcionesAdmin } from "@/components/Admin/opcionesAdmin";

type AnyObj = Record<string, any>;

export function useAdminLogic(currentUserEmail?: string) {
  const { toast } = useToast();

  const {
    usuarios,
    fondos,
    clientes,
    rutas,
    servicios,
    checkin,
    loading,
    error,
    setUsuarios,
    setFondos,
    setClientes,
    setRutas,
    setServicios,
    setCheckin,
  } = useFetchData(currentUserEmail || "");

  const initialEstados = useMemo(
    () => Object.fromEntries(opcionesAdmin.map((o) => [o.estadoKey, false])),
    []
  );
  const [estados, setEstados] = useState<Record<string, boolean>>(initialEstados);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [formData, setFormData] = useState<AnyObj>({});

  const [sedes, setSedes] = useState<any[]>([]);
  const [fechasCierre, setFechasCierre] = useState<any[]>([]);

  // cargar sedes y fechas
  useEffect(() => {
    const loadSedes = async () => {
      try {
        const r = await fetch("/api/sedes", { cache: "no-store" });
        setSedes(r.ok ? await r.json() : []);
      } catch (e) {
        console.error("[useAdmin] loadSedes:", e);
      }
    };
    const loadFechas = async () => {
      try {
        const r = await fetch("/api/fechacierre", { cache: "no-store" });
        setFechasCierre(r.ok ? await r.json() : []);
      } catch (e) {
        console.error("[useAdmin] loadFechas:", e);
      }
    };
    loadSedes();
    loadFechas();
  }, []);

  const resetForm = () => setFormData({});

  // ---------- Build Payload ----------
  const buildPayload = useCallback((table: string, raw: AnyObj) => {
    switch (table) {
      case "usuarios":
        return {
          idUsuario: raw.idUsuario ?? undefined,
          name: raw.name ?? "",
          lastname: raw.lastname ?? "",
          email: (raw.email ?? "").trim(),
          password: raw.password ?? "",
          role: raw.role ?? "",
          status: raw.status ?? "",
          sedeId: raw.sedeId ? Number(raw.sedeId) : null,
        };
      case "fondos":
        return { idFondo: raw.idFondo, nombre: raw.nombre ?? "", tipo: raw.tipo ?? "" };
      default:
        return raw ?? {};
    }
  }, []);

  // ---------- Helpers ----------
  const handleInputChange = useCallback((name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEdit = useCallback(
    (id: number) => {
      let item: AnyObj | undefined;
      switch (selectedTable) {
        case "usuarios":
          item = usuarios.find((u) => u.idUsuario === id);
          break;
        case "fondos":
          item = fondos.find((f) => f.idFondo === id);
          break;
      }
      if (item) setFormData(item);
    },
    [selectedTable, usuarios, fondos]
  );

  const handleDelete = useCallback(
    async (ids: number[]) => {
      if (!ids?.length) {
        toast({ title: "Error", description: "No seleccionaste nada", variant: "destructive" });
        return;
      }

      let endpoint = "";
      if (selectedTable === "usuarios") endpoint = "/api/usuarios";
      if (selectedTable === "fondos") endpoint = "/api/fondos";

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
        return;
      }

      if (selectedTable === "usuarios")
        setUsuarios(usuarios.filter((x) => !ids.includes(x.idUsuario)));
      if (selectedTable === "fondos")
        setFondos(fondos.filter((x) => !ids.includes(x.idFondo)));

      toast({ title: "Éxito", description: "Eliminado correctamente", variant: "normal" });
    },
    [selectedTable, usuarios, fondos, toast, setUsuarios, setFondos]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const payload = buildPayload(selectedTable, formData);

      let endpoint = "";
      let method: "POST" | "PUT" = "POST";
      if (selectedTable === "usuarios") {
        endpoint = "/api/usuarios";
        method = payload.idUsuario ? "PUT" : "POST";
      }
      if (selectedTable === "fondos") {
        endpoint = "/api/fondos";
        method = payload.idFondo ? "PUT" : "POST";
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast({ title: "Error", description: "Error en guardar", variant: "destructive" });
        return;
      }

      toast({
        title: "Éxito",
        description: method === "POST" ? "Creado correctamente" : "Actualizado correctamente",
        variant: "normal",
      });
      resetForm();
    },
    [selectedTable, formData, buildPayload, toast]
  );

  // ---------- Return ----------
  return {
    usuarios,
    fondos,
    clientes,
    rutas,
    servicios,
    fechasCierre,
    checkin,

    estados,
    setEstados,
    selectedTable,
    setSelectedTable,

    loading,
    error,

    sedes,
    setSedes,
    setFechasCierre,

    setUsuarios,
    setFondos,
    setClientes,
    setRutas,
    setServicios,
    setCheckin,

    formData,
    setFormData,
    resetForm,
    handleInputChange,
    handleEdit,
    handleDelete,
    handleSubmit,

    toast,
  };
}
