"use client";

import { useMemo, useState } from "react";

/**
 * Prototipo InfoAlert (cascarón)
 * - Sin back-end, solo datos mock.
 * - Tabla seleccionable, búsqueda, agrupación Fondo/Cliente, paginación y botón "Generar PDF".
 * - Tarjeta superior de "Gestión de procesos" con acciones de demo.
 */

// ====== Tipos
type Servicio = {
  id: number;
  planilla: number;
  sello: number;
  total: number;
  fondo: string;
  cliente: string;
  fecha: string;
  checkinero: string;
};

// ====== Datos mock (parecidos a tus screenshots)
const MOCK: Servicio[] = [
  { id: 1, planilla: 1,  sello: 1111, total: 10_000_000,  fondo: "Fondo B", cliente: "Cliente 2", fecha: "2025-03-19T11:51:20", checkinero: "Juan Perez" },
  { id: 2, planilla: 2,  sello: 2222, total: 200_000_000, fondo: "Fondo A", cliente: "Cliente 1", fecha: "2025-03-21T16:47:00", checkinero: "Juan Perez" },
  { id: 3, planilla: 3,  sello: 3333, total: 30_000_000,  fondo: "Fondo C", cliente: "Cliente 3", fecha: "2025-03-21T17:00:46", checkinero: "Juan Perez" },
  { id: 4, planilla: 4,  sello: 4444, total: 40_000_000,  fondo: "Fondo A", cliente: "Cliente 1", fecha: "2025-03-21T17:03:03", checkinero: "Juan Perez" },
  { id: 5, planilla: 5,  sello: 5555, total: 500_000_000, fondo: "Fondo B", cliente: "Cliente 2", fecha: "2025-03-21T17:03:23", checkinero: "Juan Perez" },
  { id: 6, planilla: 9,  sello: 9999, total: 90_000_000,  fondo: "Fondo B", cliente: "Cliente 2", fecha: "2025-03-22T14:15:10", checkinero: "Juan Perez" },
  { id: 7, planilla: 13, sello: 1300, total: 8_100_000,   fondo: "Fondo A", cliente: "Cliente 1", fecha: "2025-03-22T10:23:10", checkinero: "Juan Perez" },
  { id: 8, planilla: 16, sello: 1600, total: 10_950_000,  fondo: "Fondo C", cliente: "Cliente 3", fecha: "2025-03-23T09:12:00", checkinero: "Juan Perez" },
  { id: 9, planilla: 6,  sello: 6666, total: 600_000_000, fondo: "Fondo A", cliente: "Cliente 1", fecha: "2025-03-24T08:55:00", checkinero: "Juan Perez" },
];

// ====== Util
const money = (n: number) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const cls = (...x: (string | false | undefined)[]) => x.filter(Boolean).join(" ");

// ====== Página
export default function InfoAlertPrototype() {
  // Estado UI
  const [groupBy, setGroupBy] = useState<"fondo" | "cliente">("fondo");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Selecciones
  const [selected, setSelected] = useState<number[]>([]);

  // Datos filtrados y agrupados
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let arr = MOCK.filter((row) => {
      if (!s) return true;
      return (
        String(row.planilla).includes(s) ||
        String(row.sello).includes(s) ||
        row.fondo.toLowerCase().includes(s) ||
        row.cliente.toLowerCase().includes(s)
      );
    });

    // Ordenamos por grupo
    arr.sort((a, b) => {
      const ka = groupBy === "fondo" ? a.fondo : a.cliente;
      const kb = groupBy === "fondo" ? b.fondo : b.cliente;
      return ka.localeCompare(kb) || a.planilla - b.planilla;
    });

    return arr;
  }, [groupBy, search]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Selecciones
  const toggleAllVisible = (checked: boolean) => {
    const ids = pageData.map((r) => r.id);
    setSelected((prev) => {
      if (checked) {
        const set = new Set([...prev, ...ids]);
        return Array.from(set);
      } else {
        return prev.filter((id) => !ids.includes(id));
      }
    });
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const allVisibleChecked = pageData.every((r) => selected.includes(r.id)) && pageData.length > 0;

  // Acciones de demo
  const abrirLlegadas = () => alert("Abrir llegadas (demo)");
  const abrirProcesoCierre = () => alert("Abrir proceso de Cierre (demo)");
  const abrirMenuPdfs = () => alert("Abrir Menú PDFs (demo)");
  const cerrarMenuPdfs = () => alert("Cerrar Menú PDFs (demo)");

  const generarPdf = () => {
    if (!selected.length) return;
    alert(`Generar PDF para ${selected.length} servicio(s) (demo)`);
  };

  // Layout
  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-400 to-cyan-800">
      {/* Header simple */}
      <header className="p-6 text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Bienvenido, Maria Gomez</h1>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Gestión de procesos */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Gestión de procesos</h2>
          <div className="flex gap-4 flex-wrap">
            <button onClick={abrirLlegadas} className="px-5 py-2 rounded-md bg-teal-700 text-white hover:opacity-90">
              Abrir llegadas
            </button>
            <button onClick={abrirProcesoCierre} className="px-5 py-2 rounded-md bg-cyan-700 text-white hover:opacity-90">
              Abrir proceso de Cierre
            </button>
            <button onClick={abrirMenuPdfs} className="px-5 py-2 rounded-md bg-cyan-700 text-white hover:opacity-90">
              Abrir Menu Pdfs
            </button>
            <button onClick={cerrarMenuPdfs} className="px-5 py-2 rounded-md bg-red-800 text-white hover:opacity-90 ml-auto">
              Cerrar Menu Pdfs
            </button>
          </div>
        </section>

        {/* Servicios para Informar */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <h3 className="text-2xl font-semibold text-gray-800">Servicios para Informar</h3>

            {/* Agrupar y búsqueda */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Agrupar por:</span>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    checked={groupBy === "fondo"}
                    onChange={() => setGroupBy("fondo")}
                  />
                  <span>Fondo</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    checked={groupBy === "cliente"}
                    onChange={() => setGroupBy("cliente")}
                  />
                  <span>Cliente</span>
                </label>
              </div>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar en todas las columnas…"
                className="w-72 rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={allVisibleChecked}
                      onChange={(e) => toggleAllVisible(e.target.checked)}
                    />
                  </th>
                  <th className="p-3">Planilla</th>
                  <th className="p-3">Sello</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">{groupBy === "fondo" ? "Fondo" : "Cliente"}</th>
                  <th className="p-3">{groupBy === "fondo" ? "Cliente" : "Fondo"}</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, idx) => {
                  const checked = selected.includes(row.id);
                  const showDivider =
                    idx > 0 &&
                    (groupBy === "fondo"
                      ? pageData[idx - 1].fondo !== row.fondo
                      : pageData[idx - 1].cliente !== row.cliente);

                  return (
                    <tr key={row.id} className={cls(showDivider && "border-t-4 border-gray-200")}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={(e) => toggleOne(row.id, e.target.checked)}
                        />
                      </td>
                      <td className="p-3">{row.planilla}</td>
                      <td className="p-3">{row.sello}</td>
                      <td className="p-3">{money(row.total)}</td>
                      <td className="p-3">{groupBy === "fondo" ? row.fondo : row.cliente}</td>
                      <td className="p-3">{groupBy === "fondo" ? row.cliente : row.fondo}</td>
                    </tr>
                  );
                })}

                {pageData.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan={6}>
                      Sin resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tabla: Vpaginación + botón PDF */}
          <div className="mt-4 flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
            <button
              className="px-4 py-2 rounded-md bg-teal-700 text-white hover:opacity-90 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
            </button>

            <div className="ml-auto w-full md:w-auto">
              <button
                onClick={generarPdf}
                disabled={!selected.length}
                className={cls(
                  "w-full md:w-auto px-6 py-3 rounded-md text-white font-medium transition",
                  selected.length ? "bg-cyan-700 hover:opacity-90" : "bg-cyan-300 cursor-not-allowed"
                )}
              >


                Generar PDF ({selected.length} seleccionado{selected.length === 1 ? "" : "s"})
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
