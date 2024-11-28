import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin'; // Asegúrate de ajustar la ruta
import API_BASE_URL from '../../js/urlHelper'; // Asegúrate de que la ruta sea correcta
import Spinner from '../../components/Spinner'; // Asegúrate de importar el Spinner
import { verificarYRenovarToken } from '../../js/authToken';

function Luces() {
  // Estado para controlar si las luces están encendidas o apagadas
  const [isLightOn1, setIsLightOn1] = useState(false);
  const [isLightOn2, setIsLightOn2] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar el spinner
 
  // Función para obtener los estados de los LEDs
  const fetchLedStates = async () => {
    setLoading(true); // Mostrar el spinner al iniciar la solicitud
    try {
      // Verificar y renovar el token antes de cualquier solicitud
      await verificarYRenovarToken();

      const response = await fetch(`${API_BASE_URL}/api/getLedStates`);
      const data = await response.json();
      
      // Establecer los estados de los LEDs en base a la respuesta de la API
      setIsLightOn1(data[1] === 1); // LED 1
      setIsLightOn2(data[2] === 1); // LED 2
    } catch (error) {
      console.error("Error al obtener los estados de los LEDs:", error);
    } finally {
      setLoading(false); // Ocultar el spinner una vez que la API haya respondido
    }
  };

  // Función para alternar el estado de un LED
  const toggleLight = async (ledId, currentState) => {
    const newState = currentState ? 0 : 1; // Cambiar el estado (si estaba ON, ponerlo OFF y viceversa)
    setLoading(true); // Mostrar el spinner al iniciar la solicitud
    try {
      // Verificar y renovar el token antes de cualquier solicitud
      await verificarYRenovarToken();
      const response = await fetch(`${API_BASE_URL}/api/updateLedState/${ledId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: newState }),
      });

      if (response.ok) {
        // Si la respuesta es exitosa, actualizamos el estado del LED
        if (ledId === 1) {
          setIsLightOn1(newState === 1);
        } else if (ledId === 2) {
          setIsLightOn2(newState === 1);
        }
      } else {
        console.error('Error al actualizar el estado del LED');
      }
    } catch (error) {
      console.error("Error al cambiar el estado del LED:", error);
    } finally {
      setLoading(false); // Ocultar el spinner una vez que la API haya respondido
    }
  };

  // Cargar los estados de los LEDs al iniciar el componente
  useEffect(() => {
    fetchLedStates();
  }, []);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <SidebarAdmin />
  
      {/* Mostrar Spinner mientras carga */}
      {loading && <Spinner />} {/* Mostrar el spinner si está en estado de carga */}
  
      {/* Contenido de la página de luces */}
      <div className="flex-1 ml-0 lg:ml-1 p-6 mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Luces del hogar</h2>
  
        {/* Contenedor de los focos, se hace responsivo con flex-col en pantallas pequeñas */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 mb-6">
          {/* Foco Patio */}
          <div
            onClick={() => toggleLight(1, isLightOn1)} // Al hacer clic, alterna el estado del foco Patio
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn1 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 sm:w-40 sm:h-56 rounded-3xl justify-center`}
          >
            {/* Representa el foco Patio */}
            <div className={`w-24 h-36 sm:w-28 sm:h-40 ${isLightOn1 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div> {/* Representación de la bombilla */}
            <span className="text-white font-bold">{isLightOn1 ? 'Luz Patio ON' : 'Luz Patio OFF'}</span>
          </div>
  
          {/* Foco Casa */}
          <div
            onClick={() => toggleLight(2, isLightOn2)} // Al hacer clic, alterna el estado del foco Casa
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn2 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 sm:w-40 sm:h-56 rounded-3xl justify-center`}
          >
            {/* Representa el foco Casa */}
            <div className={`w-24 h-36 sm:w-28 sm:h-40 ${isLightOn2 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div> {/* Representación de la bombilla */}
            <span className="text-white font-bold">{isLightOn2 ? 'Luz Casa ON' : 'Luz Casa OFF'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Luces;
