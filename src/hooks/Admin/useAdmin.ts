import { useEffect, useState, type FormEvent } from "react";
import { user as AppUser, FechaCierre, Sede } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";
import { useFetchData } from "@/hooks/General/useFetchData";
import { opcionesAdmin } from "@/components/Admin/opcionesAdmin";

export function useAdminLogic(currentUser?: AppUser) {
  const { toast } = useToast();

  // Carga de datos principales
  const {
    usuarios,
    fondos,
    clientes,
    rutas,
    servicios,
    checkin,
    loading,
    error,

    // setters para actualizaciones locales
    setUsuarios,
    setFondos,
    setClientes,
    setRutas,
    setServicios,
    setCheckin,
  } = useFetchData(currentUser?.email ?? "");

  // -------- UI (menú/selección) --------
  const initialEstados = Object.fromEntries(
    opcionesAdmin.map((o) => [o.estadoKey, false])
  );
  const [estados, setEstados] = useState<Record<string, boolean>>(initialEstados);
  const [selectedTable, setSelectedTable] = useState<string>("");

  // Otros catálogos
  const [fechasCierre, setFechasCierre] = useState<FechaCierre[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);

  // Form genérico
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const res = await fetch("/api/sedes");
        if (!res.ok) throw new Error("Error al cargar sedes");
        setSedes(await res.json());
      } catch (err) {
        console.error("Error fetching sedes:", err);
      }
    };

    const fetchFechasCierre = async () => {
      try {
        const res = await fetch("/api/fechacierre");
        if (!res.ok) throw new Error("Error al cargar fechas de cierre");
        setFechasCierre(await res.json());
      } catch (err) {
        console.error("Error fetching fechas de cierre:", err);
      }
    };

    fetchSedes();
    fetchFechasCierre();
  }, []);

  const resetForm = () => setFormData({});

  // -------- Edit --------
  const handleEdit = (id: number) => {
    let itemToEdit: any;
    switch (selectedTable) {
      case "usuarios":
        itemToEdit = usuarios.find((u) => u.idUsuario === id);
        break;
      case "fondos":
        itemToEdit = fondos.find((f) => f.idFondo === id);
        break;
      case "clientes":
        itemToEdit = clientes.find((c) => c.idCliente === id);
        break;
      case "rutas":
        itemToEdit = rutas.find((r) => r.idRutaLlegada === id);
        break;
      case "servicios":
        itemToEdit = servicios.find((s) => s.idServicio === id);
        break;
      case "fechasCierre":
        itemToEdit = fechasCierre.find((f) => f.idFechaCierre === id);
        break;
      case "sedes":
        itemToEdit = sedes.find((s) => s.idSede === id);
        break;
    }
    if (itemToEdit) setFormData(itemToEdit);
  };

  // -------- Delete --------
  const handleDelete = async (ids: number[]) => {
    try {
      if (!ids?.length) throw new Error("No se seleccionaron elementos");

      let endpoint = "";
      switch (selectedTable) {
        case "usuarios":
          endpoint = "/api/usuarios";
          break;
        case "fondos":
          endpoint = "/api/fondos";
          break;
        case "clientes":
          endpoint = "/api/clientes";
          break;
        case "rutas":
          endpoint = "/api/rutas";
          break;
        case "servicios":
          endpoint = "/api/servicio";
          break;
        case "fechasCierre":
          endpoint = "/api/fechacierre";
          break;
        case "sedes":
          endpoint = "/api/sedes";
          break;
        default:
          throw new Error("Tabla no válida");
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        let msg = "Error al eliminar";
        try {
          const j = await res.json();
          msg = j?.error ?? msg;
        } catch {}
        throw new Error(msg);
      }

      // Actualiza estados locales
      switch (selectedTable) {
        case "usuarios":
          setUsuarios(usuarios.filter((u) => !ids.includes(u.idUsuario)));
          break;
        case "fondos":
          setFondos(fondos.filter((f) => !ids.includes(f.idFondo)));
          break;
        case "clientes":
          setClientes(clientes.filter((c) => !ids.includes(c.idCliente)));
          break;
        case "rutas":
          setRutas(rutas.filter((r) => !ids.includes(r.idRutaLlegada)));
          break;
        case "servicios":
          setServicios(servicios.filter((s) => !ids.includes(s.idServicio || 0)));
          break;
        case "fechasCierre":
          setFechasCierre(
            fechasCierre.filter((f) => !ids.includes(f.idFechaCierre))
          );
          break;
        case "sedes":
          setSedes(sedes.filter((s) => !ids.includes(s.idSede)));
          break;
      }

      toast({
        title: "Éxito",
        description: "Elementos eliminados correctamente",
        variant: "normal",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  // -------- Input genérico (campo, valor) --------
  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------- Submit --------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let endpoint = "";
      let method: "POST" | "PUT" = "POST";

      switch (selectedTable) {
        case "usuarios":
          endpoint = "/api/usuarios";
          method = formData.idUsuario ? "PUT" : "POST";
          break;
        case "fondos":
          endpoint = "/api/fondos";
          method = formData.idFondo ? "PUT" : "POST";
          break;
        case "clientes":
          endpoint = "/api/clientes";
          method = formData.idCliente ? "PUT" : "POST";
          break;
        case "rutas":
          endpoint = "/api/rutas";
          method = formData.idRutaLlegada ? "PUT" : "POST";
          break;
        case "servicios":
          endpoint = "/api/servicio";
          method = formData.idServicio ? "PUT" : "POST";
          break;
        case "fechasCierre":
          endpoint = "/api/fechacierre";
          method = formData.idFechaCierre ? "PUT" : "POST";
          break;
        case "sedes":
          endpoint = "/api/sedes";
          method = formData.idSede ? "PUT" : "POST";
          break;
        default:
          throw new Error("Tabla no válida");
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let msg = "Error en la solicitud";
        try {
          const j = await res.json();
          msg = j?.error ?? msg;
        } catch {}
        throw new Error(msg);
      }

      const result = await res.json();

      // Actualiza estado local según método
      switch (selectedTable) {
        case "usuarios":
          setUsuarios(
            method === "POST"
              ? [...usuarios, result]
              : usuarios.map((u) =>
                  u.idUsuario === result.idUsuario ? result : u
                )
          );
          break;
        case "fondos":
          setFondos(
            method === "POST"
              ? [...fondos, result]
              : fondos.map((f) => (f.idFondo === result.idFondo ? result : f))
          );
          break;
        case "clientes":
          setClientes(
            method === "POST"
              ? [...clientes, result]
              : clientes.map((c) =>
                  c.idCliente === result.idCliente ? result : c
                )
          );
          break;
        case "rutas":
          setRutas(
            method === "POST"
              ? [...rutas, result]
              : rutas.map((r) =>
                  r.idRutaLlegada === result.idRutaLlegada ? result : r
                )
          );
          break;
        case "servicios":
          setServicios(
            method === "POST"
              ? [...servicios, result]
              : servicios.map((s) =>
                  s.idServicio === result.idServicio ? result : s
                )
          );
          break;
        case "fechasCierre":
          setFechasCierre(
            method === "POST"
              ? [...fechasCierre, result]
              : fechasCierre.map((f) =>
                  f.idFechaCierre === result.idFechaCierre ? result : f
                )
          );
          break;
        case "sedes":
          setSedes(
            method === "POST"
              ? [...sedes, result]
              : sedes.map((s) => (s.idSede === result.idSede ? result : s))
          );
          break;
      }

      toast({
        title: "Éxito",
        description: `Elemento ${
          method === "POST" ? "creado" : "actualizado"
        } correctamente`,
        variant: "normal",
      });

      resetForm();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return {
    // datos
    usuarios,
    fondos,
    clientes,
    rutas,
    servicios,
    fechasCierre,
    sedes,
    checkin,

    // estado UI
    estados,
    setEstados,
    selectedTable,
    setSelectedTable,

    // estado red
    loading,
    error,

    // setters para hooks auxiliares
    setCheckin,

    // CRUD + form
    handleDelete,
    handleEdit,
    handleSubmit,
    handleInputChange,
    formData,
    setFormData,
    resetForm,

    // util
    toast,
  };
}
