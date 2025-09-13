// @/components/Digitador/procesoForm.tsx
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Fondo, Servicio } from "@/types/interfaces";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface ProcesoFormProps {
  fondos: Fondo[];
  selectedFondoId: number | null;
  onFondoChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSelectionChange: (id: number) => void;
  onCerrarFecha: () => void;
  availableServices: Servicio[];
  selectedServiceId: number | null;
}

const meses = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const ProcesoForm: React.FC<ProcesoFormProps> = ({
  selectedFondoId,
  onSelectionChange,
  onCerrarFecha,
  availableServices,
  selectedServiceId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(availableServices.length / itemsPerPage);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    const horas = date.getHours().toString().padStart(2, "0");
    const minutos = date.getMinutes().toString().padStart(2, "0");

    return `${dia} ${mes} ${año} - ${horas}:${minutos}`;
  };

  // Resetear la página cuando cambia el fondo seleccionado
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFondoId]);

  // Obtener los servicios para la página actual
  const getPaginatedServices = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return availableServices.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      {selectedFondoId && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Servicios Activos ({availableServices.length})
            </h3>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-cyan-700 text-white hover:bg-cyan-800"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-cyan-700 text-white hover:bg-cyan-800"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>

          {availableServices.length === 0 ? (
            <p className="text-gray-500">No hay servicios activos</p>
          ) : (
            <RadioGroup
              value={selectedServiceId?.toString() || ""}
              onValueChange={(value: string) =>
                onSelectionChange(Number(value))
              }
              className="space-y-3"
            >
              {getPaginatedServices().map((service) => (
                <div
                  key={service.idServicio}
                  className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50"
                >
                  <RadioGroupItem
                    value={(service.idServicio || 0).toString()}
                    id={(service.idServicio || 0).toString()}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={(service.idServicio || 0).toString()}>
                        Planilla: {service.planilla}
                      </Label>
                      <span className="text-sm text-gray-500">
                        {formatDate(service.fechaRegistro)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cliente: {service.clientes?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Monto: ${service.Sum_B?.toLocaleString("es-CO")}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          <Button
            onClick={onCerrarFecha}
            disabled={!selectedServiceId}
            className="w-full py-4 text-lg"
          >
            {selectedServiceId
              ? "Cerrar servicio"
              : "Seleccione un servicio para cerrar"}
          </Button>
        </div>
      )}
    </div>
  );
};
