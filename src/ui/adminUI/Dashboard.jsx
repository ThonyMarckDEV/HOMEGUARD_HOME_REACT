import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin';
import API_BASE_URL from '../../js/urlHelper';
import Spinner from '../../components/Spinner';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [cantidadFamiliares, setCantidadFamiliares] = useState(0);
  const [cantidadLeds, setCantidadLeds] = useState(0);
  const [reportesPorMes, setReportesPorMes] = useState([]);
  const [reportesPorDia, setReportesPorDia] = useState([]);
  const [nombreMes, setNombreMes] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mes actual

  useEffect(() => {
    async function fetchData() {
      try {
        const responseFamiliares = await fetch(`${API_BASE_URL}/api/familiares/cantidad`);
        const dataFamiliares = await responseFamiliares.json();
        setCantidadFamiliares(dataFamiliares.cantidad);

        const responseLeds = await fetch(`${API_BASE_URL}/api/leds/cantidad`);
        const dataLeds = await responseLeds.json();
        setCantidadLeds(dataLeds.cantidad);

        // Cargar reportes por mes
        const responseReportesPorMes = await fetch(`${API_BASE_URL}/api/reportes/por-mes`);
        const dataReportesPorMes = await responseReportesPorMes.json();
        setReportesPorMes(dataReportesPorMes);

        // Cargar reportes por día
        const responseReportesPorDia = await fetch(`${API_BASE_URL}/api/reportes/por-dia/${selectedMonth}`);
        const dataReportesPorDia = await responseReportesPorDia.json();
        if (dataReportesPorDia) {
          setNombreMes(dataReportesPorDia.nombreMes);
          setReportesPorDia(dataReportesPorDia.reportes);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedMonth]);

  // Gráfico de Reportes por Mes
  const chartDataMeses = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        label: 'Reportes por Mes',
        data: reportesPorMes.length > 0 ? reportesPorMes.map(mov => mov.cantidad) : Array(12).fill(0),  // Asegurar que siempre haya 12 valores, incluso si el mes no tiene reportes
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Gráfico de Reportes por Día
  const chartDataDia = {
    labels: reportesPorDia.length > 0 ? reportesPorDia.map(mov => {
      const dayName = dayjs().date(mov.dia).format('dddd');
      return dayName;
    }) : [],
    datasets: [
      {
        label: 'Movimientos por Día',
        data: reportesPorDia.length > 0 ? reportesPorDia.map(mov => mov.cantidad) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const changeMonth = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="flex min-h-screen bg-blue-100 text-gray-900 overflow-auto">
      <SidebarAdmin />
  
      {/* Mostrar Spinner mientras carga */}
      {loading && <Spinner />}
  
      <div className="flex-1 flex flex-col items-center justify-start space-y-8 px-4 sm:px-8 md:px-16 mt-20">
        <h2 className="text-3xl font-bold text-center">Dashboard</h2>
  
        {/* Sección de información general */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Cantidad de Familiares</h3>
            <p className="text-2xl">{cantidadFamiliares}</p>
          </div>
  
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold">Cantidad de LEDs</h3>
            <p className="text-2xl">{cantidadLeds}</p>
          </div>
        </div>
  
        {/* Sección de los gráficos - Sección Responsiva */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 w-full">
  
          {/* Gráfico de Reportes por Mes */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-h-[450px] sm:max-h-[400px] flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Reportes de Movimiento por Mes</h3>
            <div className="flex-1">
              <Bar
                data={chartDataMeses}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Reportes Registrados por Mes',
                    },
                    tooltip: {
                      enabled: true
                    }
                  },
                  scales: {
                    y: {
                      title: {
                        display: true,
                        text: 'Cantidad de Reportes',
                      }
                    }
                  }
                }}
                height={300} // Ajuste de altura para que se vea bien
              />
            </div>
          </div>
  
          {/* Gráfico de Reportes por Día */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-h-[450px] sm:max-h-[400px] flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Reportes de movimiento por Día de {nombreMes}</h3>
            <div className="flex-1">
              <Bar
                data={chartDataDia}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: `Reportes Registrados por Día en ${nombreMes}`,
                    },
                    tooltip: {
                      enabled: true
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Día de la Semana',
                      }
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Cantidad de Reportes',
                      }
                    }
                  }
                }}
                height={300} // Ajuste de altura para que se vea bien
              />
            </div>
          </div>
  
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
