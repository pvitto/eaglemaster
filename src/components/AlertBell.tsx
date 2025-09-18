"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: number;
  kind: string;
  title: string;
  message: string;
  severity: "INFO" | "WARN" | "CRITICAL";
  status: "OPEN" | "ACK" | "RESOLVED" | "SILENCED";
  createdAt: string;
};

export default function AlertBell() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/alerts", { cache: "no-store" });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        console.warn("GET /api/alerts no devolvió JSON válido:", res.status);
        setAlerts([]);
        return;
      }
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("load alerts error:", e);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: "ACK" | "RESOLVED" | "SILENCED") {
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const openCount = alerts.filter((a) => a.status === "OPEN").length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-gray-100"
        title="Alertas"
      >
        <span>🔔</span>
        {openCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1.5">
            {openCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-[28rem] overflow-auto bg-white shadow-xl rounded-2xl p-3 border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Alertas</h4>
            <button
              onClick={load}
              className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="text-sm text-gray-500">Sin alertas</div>
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li key={a.id} className="border rounded-xl p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{a.title}</span>
                    <span
                      className={`text-xs ${
                        a.severity === "CRITICAL"
                          ? "text-red-600"
                          : a.severity === "WARN"
                          ? "text-amber-600"
                          : "text-gray-600"
                      }`}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{a.message}</div>
                  <div className="mt-1 flex gap-2">
                    {a.status !== "ACK" && (
                      <button
                        onClick={() => updateStatus(a.id, "ACK")}
                        className="text-xs px-2 py-1 rounded bg-amber-100 hover:bg-amber-200"
                      >
                        ACK
                      </button>
                    )}
                    {a.status !== "RESOLVED" && (
                      <button
                        onClick={() => updateStatus(a.id, "RESOLVED")}
                        className="text-xs px-2 py-1 rounded bg-green-100 hover:bg-green-200"
                      >
                        Resolver
                      </button>
                    )}
                    {a.status !== "SILENCED" && (
                      <button
                        onClick={() => updateStatus(a.id, "SILENCED")}
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        Silenciar
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
