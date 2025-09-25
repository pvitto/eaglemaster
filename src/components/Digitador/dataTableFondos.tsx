// src/components/Digitador/dataTableFondos.tsx
"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Fondo, user } from "@/types/interfaces";
import { Pagination } from "@/components/General/pagination";
import { SearchBar } from "@/components/General/searchBar";
import { TableHeader } from "@/components/General/tableHeader";
import { TableBody } from "@/components/General/tableBody";
import { TableActions } from "@/components/General/tableActions";

import { RadioGroup } from "@/components/ui/radio-group";
import { columns } from "@/components/Digitador/columnsFondos";

type Mode = "admin" | "selection";

interface DataTableProps {
  data: Fondo[];
  user: user;

  // Acciones admin (opcionales si estás en modo selección)
  onDelete?: (ids: number[]) => void;
  onEdit?: (id: number) => void;

  // Selección de fondo (sólo útil en modo "selection")
  onSelect?: (fondoId: number) => void;
  selectedFondoId?: number | null;
  setSelectedServiceId?: (selectedServiceId: number | null) => void;

  mode?: Mode; // "admin" (por defecto) o "selection"
}

export function DataTableFondos({
  data,
  user,
  onDelete,
  onEdit,
  onSelect,
  selectedFondoId,
  setSelectedServiceId,
  mode = "admin",
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterValue, setFilterValue] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filterValue,
    },
    // Búsqueda global (código, nombre, tipo y nombres de clientes)
    globalFilterFn: (row, _columnId, rawFilter) => {
      const f = (rawFilter ?? "").toString().toLowerCase();
      if (!f) return true;

      const fondo = row.original;
      if (
        fondo.idFondo?.toString().toLowerCase().includes(f) ||
        fondo.nombre?.toLowerCase().includes(f) ||
        (fondo.tipo as string)?.toLowerCase().includes(f)
      ) {
        return true;
      }

      if (fondo.clientes?.some((c) => c.name?.toLowerCase().includes(f))) {
        return true;
      }

      return false;
    },
  });

  React.useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  const handleDeleteSelected = () => {
    if (!onDelete) return;
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((r) => r.original.idFondo)
      .filter((id): id is number => typeof id === "number");

    if (selectedIds.length === 0) {
      alert("No se seleccionaron fondos para eliminar");
      return;
    }
    onDelete(selectedIds);
  };

  const handleEditSelected = () => {
    if (!onEdit) return;
    const first = table.getSelectedRowModel().rows[0];
    const id = first?.original?.idFondo;
    if (typeof id === "number") {
      onEdit(id);
      table.toggleAllRowsSelected(false);
      window.scrollTo(0, 0);
    }
  };

  // --- Contenido de la tabla (sin el wrapper del RadioGroup) ---
  const tableMarkup = (
    <>
      <div className="flex items-center py-4">
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-bold">Fondos</h2>
          <SearchBar onSearch={setFilterValue} />
        </div>
      </div>

      <div className="rounded-md border">
        <table>
          <TableHeader table={table} />
          <TableBody table={table} columns={table.getAllColumns()} />
        </table>
      </div>
    </>
  );

  return (
    <div className="w-full">
      {/* Siempre damos contexto de RadioGroup para que los RadioGroupItem en la columna "select" nunca queden huérfanos */}
      <RadioGroup
        value={mode === "selection" ? (selectedFondoId?.toString() || "") : ""}
        onValueChange={
          mode === "selection"
            ? (value: string) => {
              const id = Number(value);
              if (!Number.isNaN(id)) {
                onSelect?.(id);
                setSelectedServiceId?.(null);
              }
            }
            : () => {} // no-op en modo admin; sólo provee el contexto
        }
        className="space-y-4"
      >
        {tableMarkup}
      </RadioGroup>

      <div className="flex items-center justify-between py-4">
        {mode === "admin" && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          </div>
        )}

        <div className="flex items-center space-x-2">
          {mode === "admin" && user.role === "administrador" && (
            <TableActions
              onEdit={handleEditSelected}
              onDelete={handleDeleteSelected}
              selectedCount={table.getSelectedRowModel().rows.length}
            />
          )}
          <Pagination table={table} />
        </div>
      </div>
    </div>
  );
}
