"use client";

import React from "react";

type Usuario = {
  idUsuario: number;
  name: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
  sedeId: number | null;
};

interface TopPageProps {
  user?: Usuario | null;
}

export const TopPage: React.FC<TopPageProps> = ({ user }) => {
  if (!user) return null;
  return (
    <header className="bg-transparent text-white top-0 z-50 p-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          Bienvenido, {user.name + " " + user.lastname}
        </h1>
        {/* Tu botón de logout si aplica */}
      </div>
    </header>
  );
};
