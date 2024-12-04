import React, { useState, useEffect } from 'react';
import LogoutButton from '../components/LogoutButton'; // Ajusta la ruta de importación
import API_BASE_URL from '../js/urlHelper'; // Ruta base de la API

// Importa la imagen predeterminada
import defaultImage from '../components/default.jpg'; // Ruta correcta de la imagen

function SidebarFamiliar() {
  // Estado para el nombre de usuario y perfil
  const [username, setUsername] = useState('');
  const [perfil, setPerfil] = useState(null); // Estado para manejar el perfil (null si no hay)

  // Estado para controlar la visibilidad de la sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para alternar la sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Obtener datos del token JWT solo una vez cuando el componente se monte
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      // Decodificar el token JWT para obtener la información del usuario
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUsername(decodedToken.username);  // Obtener el nombre de usuario
      const perfilUrl = decodedToken.perfil || null;  // Establecer null si no hay enlace de perfil
      setPerfil(perfilUrl);
    }
  }, []);  // Se ejecuta solo una vez cuando el componente se monta

  return (
    <div className="flex h-screen">
      {/* Barra lateral */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-gray-800 text-white p-5 fixed top-16 left-0 h-full z-10 transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white text-2xl p-2"
        >
          {/* Icono de menú para móviles */}
        </button>
        <h2 className="text-2xl font-bold mb-8">Menú</h2>
        <ul>
          <li className="mb-4">
            <a href="/familiar/camara" className="hover:text-gray-400">Cámara</a>
          </li>
          <li className="mb-4">
            <a href="/familiar/luces" className="hover:text-gray-400">Luces</a>
          </li>
          <li className="mb-4">
            <a href="/familiar/settings" className="hover:text-gray-400">Configuración</a>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 ml-0 lg:ml-64">
        {/* Barra superior */}
        <div className="bg-gray-900 text-white flex items-center justify-between p-4 fixed top-0 left-0 right-0 z-20">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white text-2xl p-2"
            >
              &#9776; {/* Icono de menú en móviles */}
            </button>
            {/* Imagen de perfil */}
            <img
              src={perfil ? `${API_BASE_URL}/${perfil}` : defaultImage} // Usa la imagen predeterminada si no hay perfil
              alt="Profile"
              className="rounded-full w-10 h-10 mr-3"
              onError={(e) => e.target.src = defaultImage} // Imagen predeterminada si falla
            />
            <span>{username}</span> {/* Mostrar el nombre de usuario */}
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default SidebarFamiliar;
