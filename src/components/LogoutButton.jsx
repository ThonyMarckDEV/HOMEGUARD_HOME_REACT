// LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../js/urlHelper'; // Asegúrate de que tienes la URL base

function LogoutButton() {
  const navigate = useNavigate();

  // Función para manejar el logout
  const handleLogout = async () => {
    // Obtener el token JWT del localStorage
    const token = localStorage.getItem('jwt');

    if (token) {
      try {
        // Decodificar el token JWT para obtener el idUsuario
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const idUsuario = decodedToken.idUsuario;

        // Enviar el idUsuario al backend para hacer el logout
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Enviar el token en el header
          },
          body: JSON.stringify({ idUsuario }), // Enviar el idUsuario en el cuerpo de la solicitud
        });

        if (response.ok) {
          // Eliminar el token JWT del localStorage
          localStorage.removeItem('jwt');

          // Redirigir al login
          navigate('/login');
        } else {
          console.error('Error en el logout');
        }
      } catch (error) {
        console.error('Error al hacer el logout:', error);
      }
    } else {
      console.log('No se encontró token en el localStorage');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
