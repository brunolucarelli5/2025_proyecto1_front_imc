import React, { useEffect, useState } from "react";

type HistorialItem = {
  fecha: string;
  peso: number;
  altura: number;
  imc: number;
  categoria: string;
};

// 🔹 Mock temporal para simular API
const mockHistorial: HistorialItem[] = [
  { fecha: "2025-09-01", peso: 70, altura: 1.75, imc: 22.86, categoria: "Normal" },
  { fecha: "2025-08-15", peso: 68, altura: 1.75, imc: 22.20, categoria: "Normal" },
  { fecha: "2025-07-10", peso: 75, altura: 1.75, imc: 24.49, categoria: "Normal" },
  { fecha: "2025-06-05", peso: 80, altura: 1.75, imc: 26.12, categoria: "Sobrepeso" },
  { fecha: "2025-05-01", peso: 82, altura: 1.75, imc: 26.78, categoria: "Sobrepeso" },
  { fecha: "2025-04-01", peso: 85, altura: 1.75, imc: 27.76, categoria: "Sobrepeso" },
  { fecha: "2025-03-01", peso: 83, altura: 1.75, imc: 27.10, categoria: "Sobrepeso" },
];

const ITEMS_PER_PAGE = 5;

export default function Historial() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔹 Simula un fetch (cuando haya backend, reemplazás esta función)
  async function fetchHistorial() {
    setLoading(true);
    try {
      // 🚀 En producción harías:
      // const res = await fetch(`/api/historial?page=${currentPage}&limit=${ITEMS_PER_PAGE}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      // const data = await res.json();

      // Mock de paginación en front
      const filtered = mockHistorial.filter((item) => {
        const fecha = new Date(item.fecha);
        const inicio = fechaInicio ? new Date(fechaInicio) : null;
        const fin = fechaFin ? new Date(fechaFin) : null;
        if (inicio && fecha < inicio) return false;
        if (fin && fecha > fin) return false;
        return true;
      });

      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

      // Simula respuesta del backend
      const data = { items: paginated, totalItems: filtered.length };

      setHistorial(data.items);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistorial();
  }, [currentPage, fechaInicio, fechaFin]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Historial IMC</h2>

      {/* Filtros de fecha */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => {
              setCurrentPage(1); // Reinicia a página 1 al filtrar
              setFechaInicio(e.target.value);
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => {
              setCurrentPage(1);
              setFechaFin(e.target.value);
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Fecha", "Peso (kg)", "Altura (m)", "IMC", "Categoría"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : historial.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay datos en el historial.
                </td>
              </tr>
            ) : (
              historial.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.peso}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.altura}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.imc.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.categoria}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
