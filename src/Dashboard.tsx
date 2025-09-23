import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Mock de datos de historial
  const historialMock = [
    { fecha: "2025-09-01", imc: 22, peso: 70, categoria: "Normal" },
    { fecha: "2025-09-05", imc: 24, peso: 73, categoria: "Normal" },
    { fecha: "2025-09-10", imc: 26, peso: 75, categoria: "Sobrepeso" },
    { fecha: "2025-09-15", imc: 27, peso: 77, categoria: "Sobrepeso" },
    { fecha: "2025-09-20", imc: 28, peso: 78, categoria: "Sobrepeso" },
    { fecha: "2025-09-22", imc: 23, peso: 71, categoria: "Normal" },
  ];

  // Datos para gráfico de línea (IMC y peso a lo largo del tiempo)
  const lineData = {
    labels: historialMock.map((item) => item.fecha),
    datasets: [
      {
        label: "IMC",
        data: historialMock.map((item) => item.imc),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
      {
        label: "Peso",
        data: historialMock.map((item) => item.peso),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y1",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Evolución de IMC y Peso",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Conteo por categoría
  const categoryCounts = historialMock.reduce((acc: Record<string, number>, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Cantidad de cálculos por categoría",
        data: Object.values(categoryCounts),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Conteo de cálculos por categoría",
      },
    },
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: "400px" }}>
        <Line options={lineOptions} data={lineData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg"  style={{ height: "400px" }}>
        <Bar options={barOptions} data={barData} />
      </div>
    </div>
  );
};

export default Dashboard;
