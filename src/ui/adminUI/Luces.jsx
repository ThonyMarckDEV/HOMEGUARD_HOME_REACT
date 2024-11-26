import React, { useState } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin'; // Asegúrate de ajustar la ruta

function Luces() {
  // Estado para controlar si las luces están encendidas o apagadas
  const [isLightOn1, setIsLightOn1] = useState(false);
  const [isLightOn2, setIsLightOn2] = useState(false);

  // Funciones para alternar el estado de las luces
  const toggleLight1 = () => setIsLightOn1(!isLightOn1);
  const toggleLight2 = () => setIsLightOn2(!isLightOn2);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarAdmin />
      
      {/* Contenido de la página de luces */}
      <div className="flex-1 ml-0 lg:ml-1 p-6 mt-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Luces del hogar</h2>

        <div className="flex justify-center gap-16 mb-6">
            {/* Foco Patio */}
            <div
              onClick={toggleLight1} // Al hacer clic, alterna el estado del foco Patio
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn1 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 rounded-3xl justify-center`}
            >
              {/* Representa el foco Patio */}
              <div className={`w-24 h-36 ${isLightOn1 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div> {/* Representación de la bombilla */}
              <span className="text-white font-bold">{isLightOn1 ? 'Luz Patio ON' : 'Luz Patio OFF'}</span>
            </div>

            {/* Foco Casa */}
            <div
              onClick={toggleLight2} // Al hacer clic, alterna el estado del foco Casa
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn2 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 rounded-3xl justify-center`}
            >
              {/* Representa el foco Casa */}
              <div className={`w-24 h-36 ${isLightOn2 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div> {/* Representación de la bombilla */}
              <span className="text-white font-bold">{isLightOn2 ? 'Luz Casa ON' : 'Luz Casa OFF'}</span>
            </div>
        </div>
        
      </div>
    </div>
  );
}

export default Luces;
