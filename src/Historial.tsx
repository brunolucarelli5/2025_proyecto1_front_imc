import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiService } from "./services/service";
import { CalculoImc } from "./services/types";

export default function Historial() {
  const [historial, setHistorial] = useState<CalculoImc[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Función para traer historial desde el backend
  const fetchHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getHistorial(currentPage, itemsPerPage, sort);

      // Filtrado por rango de fechas en frontend
      let filteredData = data.data;
      if (startDate && endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        filteredData = filteredData.filter((item: CalculoImc) => {
          const fechaItem = new Date(item.fecha_calculo);
          return fechaItem >= startDate && fechaItem <= endOfDay;
        });
      }

      setHistorial(filteredData);
      setTotalItems(data.total);
    } catch (err: any) {
      if (err.response?.status) {
        console.error(err);
      }
      setError("No se pudo cargar el historial. Intenta recargar la página.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [currentPage, itemsPerPage, sort, dateRange]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Historial IMC</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700">Rango de fechas</label>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            placeholderText="Seleccionar rango"
            className="mt-1 block w-full border rounded px-5 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Orden</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="desc">Más nuevos primero</option>
            <option value="asc">Más viejos primero</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filas por página</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
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
              historial.map((item: CalculoImc, idx: number) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.fecha_calculo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.peso}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.altura}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{Number(item.imc).toFixed(2)}</td>
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

      {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
    </div>
  );
}
