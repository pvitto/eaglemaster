"use client";

import { useCallback, type ChangeEvent } from "react";

import { Card } from "@/components/ui/card";
import { Informa } from "@/components/General/informa";
import { TopPage } from "@/components/General/topPage";

import { MenuBotones } from "@/components/General/menuBotones";
import { opcionesAdmin } from "@/components/Admin/opcionesAdmin";

import { useAdminLogic } from "@/hooks/Admin/useAdmin";
import { useCheckinForm } from "@/hooks/Checkin/useCheckinForm";
import { initialFormData } from "@/components/General/utils";

// Tablas
import { DataTableUsuarios } from "@/components/Admin/dataTableUsuarios";
import { DataTableFondos } from "@/components/Digitador/dataTableFondos";
import { DataTableClientes } from "@/components/Admin/dataTableClientes";
import { DataTableRutas } from "@/components/Admin/dataTableRutas";
import { DataTableFechasCierre } from "@/components/Admin/dataTableFechasCierre";
import { DataTableSedes } from "@/components/Admin/dataTableSedes";
import { DataTableCheckin } from "@/components/Checkin/dataTableCheckin";
import { ServiciosTable } from "@/components/Digitador/serviciosTable";

// Formularios
import UsuarioForm from "@/components/Admin/usuarioForm";
import { FondoForm } from "@/components/Admin/fondoForm";
import { ClienteForm } from "@/components/Admin/clienteForm";
import { RutaForm } from "@/components/Admin/rutaForm";
import { ServicioForm } from "@/components/Admin/servicioForm";
import { FechaCierreForm } from "@/components/Admin/fechaCierreForm";
import { SedeForm } from "@/components/Admin/sedeForm";

// Si tu proyecto define este tipo, úsalo; si no, puedes quitarlo
import type { user as AppUser } from "@/types/interfaces";

type AdminProps = {
  user?: AppUser;
};

export const Admin: React.FC<AdminProps> = ({ user }) => {
  const {
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

    // estado de red
    loading,
    error,

    // CRUD helpers
    handleDelete,
    handleEdit,
    handleSubmit,
    handleInputChange, // <- firma (campo, valor)
    formData,
    resetForm,
    toast,
  } = useAdminLogic(UsuarioForm);

  // Adaptador de evento -> (campo, valor) para reutilizar tu lógica actual
  const handleFormEvent = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const t = e.target as HTMLInputElement;
      let value: any = t.type === "checkbox" ? t.checked : t.value;

      // Mini normalizaciones útiles
      if (t.type === "number") value = Number(t.value);

      // Para ids que guardas como number | null
      const mayBeId = [
        "sedeId",
        "idCliente",
        "idRutaLlegada",
        "idServicio",
        "idFondo",
        "idFechaCierre",
        "idSede",
      ];

      if (mayBeId.includes(t.name)) {
        value = t.value === "" ? null : Number(t.value);
      }

      handleInputChange(t.name as any, value);
    },
    [handleInputChange]
  );

  // Hooks específicos de checkin (edición desde tabla)
  const { handleEdit: handleEditCheckin, handleDelete: handleDeleteCheckin } =
    useCheckinForm(initialFormData, clientes, checkin, /* toast opcional */ toast);

  // --------- Carga / errores ---------
  if (loading) {
    return <Informa text="Cargando..." btntxt="si" log={false} />;
  }
  if (error) {
    return <Informa text={error} btntxt="Cerrar sesión" log={true} />;
  }
  if (!usuarios.length) {
    return (
      <Informa
        text="No se encontraron datos"
        btntxt="Volver para iniciar sesión"
        log={true}
      />
    );
  }

  // --------- Formularios ---------
  const renderForm = () => {
    switch (selectedTable) {
      case "usuarios":
        return (
          <UsuarioForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idUsuario}
            sedes={sedes}
          />
        );

      case "fondos":
        return (
          <FondoForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idFondo}
          />
        );

      case "clientes":
        return (
          <ClienteForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idCliente}
            fondos={fondos}
          />
        );

      case "rutas":
        return (
          <RutaForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idRutaLlegada}
          />
        );

      case "servicios":
        return (
          <ServicioForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idServicio}
            checkin={checkin}
            usuarios={usuarios}
            clientes={clientes}
            fondos={fondos}
          />
        );

      case "fechasCierre":
        return (
          <FechaCierreForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idFechaCierre}
            usuarios={usuarios}
            fondos={fondos}
            servicios={servicios}
          />
        );

      case "sedes":
        return (
          <SedeForm
            formData={formData as any}
            onInputChange={handleFormEvent}
            onSubmit={handleSubmit}
            isEditMode={!!(formData as any).idSede}
          />
        );

      default:
        return null;
    }
  };

  // --------- Tablas ---------
  const renderTable = () => {
    switch (selectedTable) {
      case "usuarios":
        return (
          <DataTableUsuarios
            data={usuarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
          />
        );

      case "fondos":
        return (
          <DataTableFondos
            data={fondos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
            mode="admin"
          />
        );

      case "clientes":
        return (
          <DataTableClientes
            data={clientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
          />
        );

      case "rutas":
        return (
          <DataTableRutas
            data={rutas}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
          />
        );

      case "checkins":
        return (
          <DataTableCheckin
            data={checkin}
            onEdit={handleEditCheckin}
            onDelete={handleDeleteCheckin}
            user={user as any}
          />
        );

      case "servicios":
        return (
          <ServiciosTable
            data={servicios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
          />
        );

      case "fechasCierre":
        return (
          <DataTableFechasCierre
            data={fechasCierre}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
          />
        );

      case "sedes":
        return (
          <DataTableSedes
            data={sedes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            user={user as any}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      <TopPage user={usuarios[0]} />

      <main className="container mx-auto p-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Panel de Administración
          </h2>

          <MenuBotones
            opciones={opcionesAdmin}
            estados={estados}
            setEstados={setEstados}
            activeKey={selectedTable}
            onSelect={(id) => {
              // al hacer click, seteamos la tabla y limpiamos el form
              setSelectedTable(id);
              resetForm();
            }}
            onResetSelection={() => {
              setSelectedTable("");
              resetForm();
            }}
          />
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow mt-6">
          {selectedTable ? (
            <>
              <div className="mb-6">{renderForm()}</div>
              {renderTable()}
            </>
          ) : (
            <h3 className="text-center w-full font-bold text-3xl">
              Seleccione una tabla para administrar
            </h3>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Admin;
