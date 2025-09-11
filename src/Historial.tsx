import React, { useEffect, useState } from "react";
import { apiService, CalculoImc } from "./services/service";

const ITEMS_PER_PAGE = 5;

export default function Historial() {
  const [historial, setHistorial] = useState<CalculoImc[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const data = await apiService.getHistorial(currentPage, ITEMS_PER_PAGE);
      setHistorial(data.items);
      setTotalItems(data.totalItems);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Historial IMC</h2>
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Fecha", "Peso (kg)", "Altura (m)", "IMC", "Categoría"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">Cargando...</td>
              </tr>
            ) : historial.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">No hay datos en el historial.</td>
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

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Anterior</button>
          <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Siguiente</button>
        </div>
      )}
    </div>
  );
}
