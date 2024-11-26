import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton'; // Ajusta la ruta de importación
import API_BASE_URL from '../js/urlHelper'; // Ruta base de la API

function SidebarAdmin() {
  // Obtener el token JWT del localStorage
  const token = localStorage.getItem('jwt');

  let username = '';
  let perfil = '';

  if (token) {
    // Decodificar el token JWT para obtener la información del usuario
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    username = decodedToken.username;  // Obtener el nombre de usuario
    perfil = decodedToken.perfil;  // Obtener la URL del perfil
  }

  // Estado para controlar la visibilidad de la sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para alternar la sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Barra lateral */}
      <div
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } lg:block w-64 bg-gray-800 text-white p-5 fixed top-16 left-0 h-full z-10 transition-all duration-300 ease-in-out`}
      >
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white text-2xl p-2"
        >
          
        </button>
        <h2 className="text-2xl font-bold mb-8">Menu</h2>
        <ul>
          <li className="mb-4">
            <Link to="/admin/" className="hover:text-gray-400">Escritorio</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/camara" className="hover:text-gray-400">Camara</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/reportes" className="hover:text-gray-400">Reportes</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/luces" className="hover:text-gray-400">Luces</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/dashboard" className="hover:text-gray-400">Dashboard</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/settings" className="hover:text-gray-400">Settings</Link>
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
            <img
              src={`${API_BASE_URL}${perfil}`} // Concatenar la URL base con el perfil
              alt="Profile"
              className="rounded-full w-10 h-10 mr-3"
            />
            <span>{username}</span> {/* Mostrar el nombre de usuario */}
          </div>
          <LogoutButton />
        </div>

      </div>
    </div>
  );
}

export default SidebarAdmin;
