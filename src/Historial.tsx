import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiService } from "./services/service";
import { CalculoImc } from "./services/types";

const ITEMS_PER_PAGE = 5;

export default function Historial() {
  const [historialCompleto, setHistorialCompleto] = useState<CalculoImc[]>([]);
  const [historialFiltrado, setHistorialFiltrado] = useState<CalculoImc[]>([]);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = historialFiltrado.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const fetchHistorialCompleto = async () => {
    setLoading(true);
    try {
      const data = await apiService.getHistorial();
      setHistorialCompleto(data.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorialCompleto();
  }, []);

  useEffect(() => {
    let datosFiltrados = [...historialCompleto];

    // Aplicar filtro de fechas en el frontend
    if (startDate && endDate) {
      // Ajuste para incluir el día de finalización completo
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      datosFiltrados = datosFiltrados.filter(
        (item) =>
          new Date(item.fecha_calculo ?? item.fecha) >= startDate &&
          new Date(item.fecha_calculo ?? item.fecha) <= endOfDay
      );
    }

    // Aplicar ordenamiento en el frontend
    datosFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fecha_calculo ?? a.fecha).getTime();
      const fechaB = new Date(b.fecha_calculo ?? b.fecha).getTime();
      return sort === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });

    setHistorialFiltrado(datosFiltrados);
    setCurrentPage(1);
  }, [historialCompleto, dateRange, sort]);

  // Lógica de paginación
  const paginatedHistorial = historialFiltrado.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Historial IMC</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div className="w-64">
          <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 w">
            Rango de fechas
          </label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            isClearable={true}
            placeholderText="Seleccionar rango"
            className="mt-1 block w-full border rounded px-5 py-1"
          />
        </div>

        <div>
          <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700">
            Orden
          </label>
          <select
            id="sort-order"
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="mt-1 block w-full border rounded px-2 py-1"
          >
            <option value="desc">Más nuevos primero</option>
            <option value="asc">Más viejos primero</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Fecha", "Peso (kg)", "Altura (m)", "IMC", "Categoría"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : paginatedHistorial.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay datos en el historial.
                </td>
              </tr>
            ) : (
              paginatedHistorial.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(
                      item.fecha_calculo ?? item.fecha
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.peso}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.altura}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Number(item.imc).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.categoria}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
