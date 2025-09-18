// src/app/admin/layout.tsx
import React from "react";
import AlertBell from "@/components/AlertBell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-3 border-b bg-white">
        <div className="font-semibold">Panel de Administración</div>
        <div className="flex items-center gap-3">
          <AlertBell />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
