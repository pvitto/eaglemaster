"use client";

import React, { useMemo, useState } from "react";

/** ===== Mini InfoAlert local (sin dependencias) ===== */
type Kind = "success" | "error" | "warning" | "info";
const kindBg: Record<Kind, string> = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  warning: "bg-amber-600",
  info: "bg-cyan-600",
};
type Alert = { id: string; kind: Kind; title?: string; message: string };
function useMiniAlerts() {
  const [items, setItems] = useState<Alert[]>([]);
  const show = (a: Omit<Alert, "id">, timeoutMs = 2500) => {
    const id = crypto.randomUUID();
    setItems((p) => [...p, { id, ...a }]);
    if (timeoutMs > 0) setTimeout(() => close(id), timeoutMs);
  };
  const close = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const ui = (
    <div className="fixed top-4 right-4 z-[1000] w-[360px] max-w-[90vw] space-y-3">
      {items.map((a) => (
        <div
          key={a.id}
          className={`text-white shadow-lg rounded-lg px-4 py-3 ${kindBg[a.kind]}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {a.title && <div className="font-semibold">{a.title}</div>}
              <div className="text-sm opacity-95">{a.message}</div>
            </div>
            <button
              onClick={() => close(a.id)}
              className="opacity-90 hover:opacity-100"
              aria-label="Cerrar alerta"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  return { show, ui };
}

/** ===== Datos fake para el demo ===== */
type Servicio = {
  planilla: number; sello: number; total: string; fondo: string; cliente: string;
};
type Fondo = { codigo: number; nombre: string; tipo: "Publico" | "Privado"; clientes: string };
type Checkin = {
  planilla: number; sello: number; declarado: string; ruta: number;
  fecha: string; checkinero: string; cliente: string; fondo: string;
};

const serviciosSeed: Servicio[] = [
  { planilla: 2, sello: 2222, total: "$199.000.000", fondo: "Fondo A", cliente: "Cliente 1" },
  { planilla: 13, sello: 1300, total: "$8.100.000", fondo: "Fondo A", cliente: "Cliente 1" },
  { planilla: 6, sello: 6666, total: "$600.000.000", fondo: "Fondo A", cliente: "Cliente 1" },
  { planilla: 9, sello: 9999, total: "$90.000.000", fondo: "Fondo B", cliente: "Cliente 2" },
  { planilla: 16, sello: 1600, total: "$10.950.000", fondo: "Fondo C", cliente: "Cliente 3" },
];
const fondosSeed: Fondo[] = [
  { codigo: 1, nombre: "Fondo A", tipo: "Publico", clientes: "Cliente 1" },
  { codigo: 2, nombre: "Fondo B", tipo: "Privado", clientes: "Cliente 2" },
  { codigo: 3, nombre: "Fondo C", tipo: "Publico", clientes: "Cliente 3" },
];
const checkinsSeed: Checkin[] = [
  { planilla: 1, sello: 1111, declarado: "$10.000.000,00", ruta: 1, fecha: "19/3/2025, 11:51", checkinero: "Juan Perez", cliente: "Cliente 2", fondo: "Fondo B" },
  { planilla: 2, sello: 2222, declarado: "$200.000.000,00", ruta: 1, fecha: "21/3/2025, 4:47", checkinero: "Juan Perez", cliente: "Cliente 1", fondo: "Fondo A" },
  { planilla: 3, sello: 3333, declarado: "$30.000.000,00", ruta: 1, fecha: "21/3/2025, 5:00", checkinero: "Juan Perez", cliente: "Cliente 3", fondo: "Fondo C" },
  { planilla: 4, sello: 4444, declarado: "$40.000.000,00", ruta: 1, fecha: "21/3/2025, 5:03", checkinero: "Juan Perez", cliente: "Cliente 1", fondo: "Fondo A" },
  { planilla: 5, sello: 5555, declarado: "$500.000.000,00", ruta: 1, fecha: "21/3/2025, 5:03", checkinero: "Juan Perez", cliente: "Cliente 2", fondo: "Fondo B" },
];

/** ===== UI helpers ===== */
function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-6 rounded-lg shadow">{children}</div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-bold mb-6 text-gray-800">{children}</h2>;
}

/** ===== Página demo ===== */
export default function Prototipo() {
  const { show, ui } = useMiniAlerts();

  // pestañas
  const tabs = ["Servicios", "Fondos", "Check-ins"] as const;
  type Tab = typeof tabs[number];
  const [tab, setTab] = useState<Tab>("Servicios");

  // selección “cosmética”
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (k: number) =>
    setSelected((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  const resetSel = () => setSelected([]);

  // filtros de texto simples
  const [q, setQ] = useState("");

  const servicios = useMemo(
    () => serviciosSeed.filter(
      s => JSON.stringify(s).toLowerCase().includes(q.toLowerCase())
    ), [q]
  );
  const fondos = useMemo(
    () => fondosSeed.filter(
      f => JSON.stringify(f).toLowerCase().includes(q.toLowerCase())
    ), [q]
  );
  const checkins = useMemo(
    () => checkinsSeed.filter(
      c => JSON.stringify(c).toLowerCase().includes(q.toLowerCase())
    ), [q]
  );

  // acciones
  const abrirLlegadas = () => show({ kind: "info", title: "Gestión de procesos", message: "Se abrió el proceso de Llegadas." });
  const abrirCierre = () => show({ kind: "warning", title: "Proceso de Cierre", message: "Se inició proceso de cierre (demo)." });
  const abrirMenuPdfs = () => show({ kind: "info", title: "PDFs", message: "Menú de PDFs abierto (demo)." });

  const generarPdf = () => {
    if (!selected.length) {
      show({ kind: "error", title: "Generar PDF", message: "Seleccione al menos un registro." });
      return;
    }
    show({ kind: "success", title: "PDF generado", message: `${selected.length} registro(s) listos.` });
    resetSel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      {ui}

      {/* Cabecera */}
      <header className="text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Bienvenido, Maria Gomez</h1>
          <button
            className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-4 py-2 rounded"
            onClick={() => show({ kind: "info", message: "Sesión finalizada (demo)." })}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Gestión de procesos */}
        <Card>
          <h3 className="text-2xl font-bold mb-4">Gestión de procesos</h3>
          <div className="flex items-center gap-4">
            <button onClick={abrirLlegadas} className="bg-cyan-700 hover:bg-cyan-800 text-white rounded px-4 py-2">
              Abrir llegadas
            </button>
            <button onClick={abrirCierre} className="bg-cyan-700 hover:bg-cyan-800 text-white rounded px-4 py-2">
              Abrir proceso de Cierre
            </button>
            <button onClick={abrirMenuPdfs} className="ml-auto bg-cyan-700 hover:bg-cyan-800 text-white rounded px-4 py-2">
              Abrir Menu Pdfs
            </button>
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <div className="flex gap-2 mb-4">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); resetSel(); setQ(""); }}
                className={`px-3 py-2 rounded font-semibold ${tab === t ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-800"}`}
              >
                {t}
              </button>
            ))}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en todas las columnas..."
              className="ml-auto border rounded px-3 py-2 w-80"
            />
          </div>

          {/* SERVICIOS */}
          {tab === "Servicios" && (
            <>
              <SectionTitle>Servicios para Informar</SectionTitle>
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left">
                    <tr>
                      <th className="p-3 w-10"></th>
                      <th className="p-3">Planilla</th>
                      <th className="p-3">Sello</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Fondo</th>
                      <th className="p-3">Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicios.map((s) => (
                      <tr key={s.planilla} className="border-t hover:bg-slate-50">
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(s.planilla)}
                            onChange={() => toggle(s.planilla)}
                          />
                        </td>
                        <td className="p-3">{s.planilla}</td>
                        <td className="p-3">{s.sello}</td>
                        <td className="p-3">{s.total}</td>
                        <td className="p-3">{s.fondo}</td>
                        <td className="p-3">{s.cliente}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm opacity-80">{`0 de ${servicios.length} fila(s) seleccionadas.`}</div>
                <div className="flex gap-2">
                  <button className="bg-slate-300 text-slate-800 rounded px-3 py-2">Anterior</button>
                  <button className="bg-slate-300 text-slate-800 rounded px-3 py-2">Siguiente</button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={generarPdf}
                  className="w-full bg-cyan-700 hover:bg-cyan-800 text-white rounded px-4 py-2"
                >
                  {`Generar PDF (${selected.length} seleccionados)`}
                </button>
              </div>
            </>
          )}

          {/* FONDOS */}
          {tab === "Fondos" && (
            <>
              <SectionTitle>Listado de Fondos</SectionTitle>
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left">
                    <tr>
                      <th className="p-3 w-10"></th>
                      <th className="p-3">Código</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Clientes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fondos.map((f) => (
                      <tr key={f.codigo} className="border-t hover:bg-slate-50">
                        <td className="p-3 text-center">
                          <input
                            type="radio"
                            checked={selected.includes(f.codigo)}
                            onChange={() => setSelected([f.codigo])}
                          />
                        </td>
                        <td className="p-3">{f.codigo}</td>
                        <td className="p-3">{f.nombre}</td>
                        <td className="p-3">{f.tipo}</td>
                        <td className="p-3">{f.clientes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="bg-slate-300 text-slate-800 rounded px-3 py-2">Anterior</button>
                <button className="bg-slate-300 text-slate-800 rounded px-3 py-2">Siguiente</button>
              </div>
            </>
          )}

          {/* CHECKINS */}
          {tab === "Check-ins" && (
            <>
              <SectionTitle>Check-ins</SectionTitle>
              <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-left">
                    <tr>
                      <th className="p-3 w-10"></th>
                      <th className="p-3">Planilla</th>
                      <th className="p-3">Sello</th>
                      <th className="p-3">Declarado</th>
                      <th className="p-3">Ruta</th>
                      <th className="p-3">Fecha de Registro</th>
                      <th className="p-3">Checkinero</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Fondo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkins.map((c) => (
                      <tr key={c.planilla} className="border-t hover:bg-slate-50">
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selected.includes(c.planilla)}
                            onChange={() => toggle(c.planilla)}
                          />
                        </td>
                        <td className="p-3">{c.planilla}</td>
                        <td className="p-3">{c.sello}</td>
                        <td className="p-3">{c.declarado}</td>
                        <td className="p-3">{c.ruta}</td>
                        <td className="p-3">{c.fecha}</td>
                        <td className="p-3">{c.checkinero}</td>
                        <td className="p-3">{c.cliente}</td>
                        <td className="p-3">{c.fondo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="bg-slate-300 text-slate-800 rounded px-3 py-2">Anterior</button>
                <button className="bg-slate-300 text-slate-800 rounded px-3 py-2">Siguiente</button>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
