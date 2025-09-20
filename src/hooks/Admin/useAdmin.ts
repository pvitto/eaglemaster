// src/hooks/Admin/useAdmin.ts
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { user, FechaCierre, Sede } from "@/types/interfaces";
import { useToast } from "@/hooks/General/use-toast";
import { useFetchData } from "@/hooks/General/useFetchData";
import { opcionesAdmin } from "@/components/Admin/opcionesAdmin";

export function useAdminLogic(currentUser: user) {
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
  } = useFetchData(currentUser.email);

  // ---------- menú ----------
  const initialEstados = Object.fromEntries(
    opcionesAdmin.map((o) => [o.estadoKey, false])
  );
  const [estados, setEstados] = useState<Record<string, boolean>>(initialEstados);
  const [selectedTable, setSelectedTable] = useState<string>("");

  // catálogos y adicionales
  const [fechasCierre, setFechasCierre] = useState<FechaCierre[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);

  // formulario genérico
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const r = await fetch("/api/sedes");
        if (!r.ok) throw new Error("Error al cargar sedes");
        setSedes(await r.json());
      } catch (e) { console.error(e); }
    };
    const fetchFechasCierre = async () => {
      try {
        const r = await fetch("/api/fechacierre");
        if (!r.ok) throw new Error("Error al cargar fechas de cierre");
        setFechasCierre(await r.json());
      } catch (e) { console.error(e); }
    };
    fetchSedes();
    fetchFechasCierre();
  }, []);

  const resetForm = () => setFormData({});

  const handleEdit = (id: number) => {
    let item: any;
    switch (selectedTable) {
      case "usuarios": item = usuarios.find(u => u.idUsuario === id); break;
      case "fondos": item = fondos.find(f => f.idFondo === id); break;
      case "clientes": item = clientes.find(c => c.idCliente === id); break;
      case "rutas": item = rutas.find(r => r.idRutaLlegada === id); break;
      case "servicios": item = servicios.find(s => s.idServicio === id); break;
      case "fechasCierre": item = fechasCierre.find(f => f.idFechaCierre === id); break;
      case "sedes": item = sedes.find(s => s.idSede === id); break;
      default: return;
    }
    if (item) setFormData(item);
  };

  const handleDelete = async (ids: number[]) => {
    try {
      if (!ids.length) throw new Error("No se seleccionaron elementos");
      let endpoint = "";
      switch (selectedTable) {
        case "usuarios": endpoint = "/api/usuarios"; break;
        case "fondos": endpoint = "/api/fondos"; break;
        case "clientes": endpoint = "/api/clientes"; break;
        case "rutas": endpoint = "/api/rutas"; break;
        case "servicios": endpoint = "/api/servicio"; break;
        case "fechasCierre": endpoint = "/api/fechacierre"; break;
        case "sedes": endpoint = "/api/sedes"; break;
        default: throw new Error("Tabla no válida");
      }
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Error al eliminar");

      switch (selectedTable) {
        case "usuarios": setUsuarios(usuarios.filter(u => !ids.includes(u.idUsuario))); break;
        case "fondos": setFondos(fondos.filter(f => !ids.includes(f.idFondo))); break;
        case "clientes": setClientes(clientes.filter(c => !ids.includes(c.idCliente))); break;
        case "rutas": setRutas(rutas.filter(r => !ids.includes(r.idRutaLlegada))); break;
        case "servicios": setServicios(servicios.filter(s => !ids.includes(s.idServicio || 0))); break;
        case "fechasCierre": setFechasCierre(fechasCierre.filter(f => !ids.includes(f.idFechaCierre))); break;
      }

      toast({ title: "Éxito", description: "Elementos eliminados", variant: "normal" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: err instanceof Error ? err.message : "Error", variant: "destructive" });
    }
  };

  // -------- onChange ESTÁNDAR: recibe el EVENTO --------
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // -------- onSubmit ESTÁNDAR: recibe el EVENTO --------
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
      if (!res.ok) throw new Error((await res.json()).error || "Error en la solicitud");
      const result = await res.json();

      switch (selectedTable) {
        case "usuarios":
          setUsuarios(method === "POST"
            ? [...usuarios, result]
            : usuarios.map(u => (u.idUsuario === result.idUsuario ? result : u)));
          break;
        case "fondos":
          setFondos(method === "POST"
            ? [...fondos, result]
            : fondos.map(f => (f.idFondo === result.idFondo ? result : f)));
          break;
        case "clientes":
          setClientes(method === "POST"
            ? [...clientes, result]
            : clientes.map(c => (c.idCliente === result.idCliente ? result : c)));
          break;
        case "rutas":
          setRutas(method === "POST"
            ? [...rutas, result]
            : rutas.map(r => (r.idRutaLlegada === result.idRutaLlegada ? result : r)));
          break;
        case "servicios":
          setServicios(method === "POST"
            ? [...servicios, result]
            : servicios.map(s => (s.idServicio === result.idServicio ? result : s)));
          break;
        case "fechasCierre":
          setFechasCierre(method === "POST"
            ? [...fechasCierre, result]
            : fechasCierre.map(f => (f.idFechaCierre === result.idFechaCierre ? result : f)));
          break;
        case "sedes":
          setSedes(method === "POST"
            ? [...sedes, result]
            : sedes.map(s => (s.idSede === result.idSede ? result : s)));
          break;
      }

      toast({
        title: "Éxito",
        description: `Elemento ${method === "POST" ? "creado" : "actualizado"} correctamente`,
        variant: "normal",
      });
      resetForm();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return {
    // menú
    estados, setEstados, selectedTable, setSelectedTable,
    // datos
    usuarios, fondos, clientes, rutas, servicios, fechasCierre, checkin,
    sedes, setSedes,
    loading, error,
    // edición
    handleDelete, handleEdit,
    formData, setFormData, handleInputChange, handleSubmit, resetForm,
    toast,
  };
}
