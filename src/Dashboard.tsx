import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { apiService } from "./services/service";

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
  const [historiales, setHistoriales] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any>({});
  const [estadisticasImc, setEstadisticasImc] = useState<any>({});
  const [estadisticasPeso, setEstadisticasPeso] = useState<any>({});

  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await apiService.obtenerDashboard();
      if (data) {
        setHistoriales(data.historiales);
        setCategorias(data.categorias);
        setEstadisticasImc(data.estadisticasImc);
        setEstadisticasPeso(data.estadisticasPeso);
      }
    };
    fetchDashboard();
  }, []);

  const lineData = {
    labels: historiales.map((item) => new Date(item.fecha_calculo).toLocaleDateString()),
    datasets: [
      {
        label: "IMC",
        data: historiales.map((item) => item.imc),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        yAxisID: "y",
      },
      {
        label: "Peso",
        data: historiales.map((item) => item.peso),
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

  const barData = {
    labels: ["Bajo peso", "Normal", "Sobrepeso", "Obeso"],
    datasets: [
      {
        label: "Cantidad de cálculos por categoría",
        data: [
          categorias.cantBajoPeso || 0,
          categorias.cantNormal || 0,
          categorias.cantSobrepeso || 0,
          categorias.cantObeso || 0,
        ],
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0, // solo enteros
        },
      },
    },
  };

  return (
    <div className="space-y-12">

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
        <p><strong>Peso:</strong> Promedio = {estadisticasPeso.promedio}, Desviación = {estadisticasPeso.desviacion}</p>
        <p><strong>IMC:</strong> Promedio = {estadisticasImc.promedio}, Desviación = {estadisticasImc.desviacion}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: "400px" }}>
        <Line options={lineOptions} data={lineData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ height: "400px" }}>
        <Bar options={barOptions} data={barData} />
      </div>

    </div>
  );
};

export default Dashboard;