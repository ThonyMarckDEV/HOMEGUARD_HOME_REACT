import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin';
import API_BASE_URL from '../../js/urlHelper'; 
import Spinner from '../../components/Spinner'; // Asegúrate de importar el Spinner

const Admin = () => {
  const [isVigilanceModeOn, setIsVigilanceModeOn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener el estado actual de la vigilancia desde la API
  useEffect(() => {
    const fetchVigilanceStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vigilance/status`);
        const data = await response.json();
        setIsVigilanceModeOn(data.is_active); // Ajusta según el nombre de tu campo
      } catch (error) {
        console.error('Error fetching vigilance mode', error);
      }
    };

    fetchVigilanceStatus();
  }, []);

  // Cambiar el estado del modo vigilancia
  const toggleVigilanceMode = async () => {
    const token = localStorage.getItem('jwt'); 
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/vigilance/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !isVigilanceModeOn,
        }),
      });

      if (response.ok) {
        setIsVigilanceModeOn(prevState => !prevState);
      } else {
        console.error('Error updating vigilance mode');
      }
    } catch (error) {
      console.error('Error toggling vigilance mode', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">

    <SidebarAdmin /> {/* SidebarAdmin integrado */}

    {/* Mostrar Spinner mientras carga */}
    {loading && <Spinner />} {/* Mostrar el spinner si está en estado de carga */}

    <div className="flex-1 flex justify-center items-center lg:justify-start lg:items-start lg:ml-10 mt-20"> 
      {/* En móviles: centrado; en PC: alineación superior */}

      <div className="text-center lg:text-left"> {/* En móviles: centrado, en PC alineado a la izquierda */}
        <h2 className="text-3xl font-bold mb-4">Programar</h2>

        {/* Botón Modo Vigilancia */}
        <div className="mb-6">
          <button
            onClick={toggleVigilanceMode}
            className={`flex items-center justify-center w-40 h-12 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${isVigilanceModeOn ? 'bg-green-500' : 'bg-red-500'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <span className="mr-2">{isVigilanceModeOn ? 'Modo Vigilancia Encendido' : 'Modo Vigilancia Apagado'}</span>
            <span className={`w-6 h-6 rounded-full ${isVigilanceModeOn ? 'bg-green-400' : 'bg-red-400'} transition-all duration-300`}></span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Admin;
