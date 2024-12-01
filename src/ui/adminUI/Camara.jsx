import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SidebarAdmin from '../../components/sidebarAdmin'; 
import API_BASE_URL from '../../js/urlHelper'; 
import { verificarYRenovarToken } from '../../js/authToken';
//import Spinner from '../../components/Spinner'; // Asegúrate de importar el Spinner

function Camara() {
  const [streamLink, setStreamLink] = useState(null);
  const [isStreamActive, setIsStreamActive] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar si la imagen está cargando
  //const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  

  useEffect(() => {
    const fetchStreamLink = async () => {
      const token = localStorage.getItem('jwt'); 

      if (!token) {
        console.error("Token JWT no encontrado.");
        return;
      }

      try {
        //setLoading(true); // Mostrar el spinner al iniciar la solicitud
        await verificarYRenovarToken();  // Verificar el token

        const response = await fetch(`${API_BASE_URL}/api/obtenerLinkStreamESP32Laravel`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data && data.link) {
          setStreamLink(data.link);
          setIsStreamActive(true); 
        } else {
          console.error("No se encontró el enlace del stream.");
        }
      } catch (error) {
        console.error("Error al obtener el enlace del stream:", error);
      } finally {
      //  setLoading(false); // Ocultar el spinner una vez que la API haya respondido
      }
    };

    fetchStreamLink();

    return () => {
      setStreamLink(null);
      setIsStreamActive(false);
    };
  }, []); 

   // Función que se ejecuta cuando la imagen termina de cargarse
   const handleImageLoad = () => {
    setIsLoading(false); // La imagen se ha cargado completamente, podemos ocultar el spinner
  };

  const stopStream = () => {
    if (isStreamActive) {
      console.log("Deteniendo el stream...");
      setStreamLink(null); 
      setIsStreamActive(false); 
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      stopStream(); 
    };

    navigate(handleRouteChange); 

    return () => {
      stopStream(); 
    };
  }, [navigate]); 

  return (
    <div className="flex min-h-screen bg-blue-100 text-gray-900 overflow-auto">
      <SidebarAdmin />
      <div className="flex-1 ml-0 lg:ml-1">
        <div className="p-6 mt-16">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Monitoreo de Cámara en Vivo
          </h2>
          <div className="flex justify-center mb-6">
            {streamLink ? (
              <div className="w-full max-w-3xl">
                {/* Imagen de la cámara */}
                <img
                  src={streamLink}
                  alt="Cámara principal del hogar"
                  className="w-full h-auto rounded-lg shadow-lg border-4 border-gray-300"
                  loading="eager" // Asegúrate de que se cargue tan pronto como sea posible
                  onLoad={handleImageLoad} // Cuando la imagen esté cargada, actualizamos el estado
                />
                <div className="text-center mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg">
                  Cámara principal del hogar
                </div>
              </div>
            ) : (
              <div className="w-full max-w-3xl bg-gray-200 h-96 flex justify-center items-center rounded-lg shadow-lg border-4 border-gray-300">
                <div className="flex flex-col items-center">
                  {/* Spinner con Tailwind mientras se carga la imagen */}
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
                  <div className="text-center text-gray-600">Cargando cámara...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Camara;
