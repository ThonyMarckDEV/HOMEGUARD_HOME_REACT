import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './ui/Home';
import Login from './ui/Login';
import ProtectedRoute from './utilities/ProtectedRoute';
import AdminPage from './ui/adminUI/Admin';
import CamaraPage from './ui/adminUI/Camara';
import LucesPage from './ui/adminUI/Luces';
//Clases js Para actividad usuaruios y chekearToken y estado usuario (LoggedOn - Off)
import { updateLastActivity } from './js/lastActivity'; // Asegúrate de que esté exportada desde su archivo (Scritp para acutalizar la ultiam actividad del usuario)
import { checkToken, clearTokenCheckInterval } from './js/checkTokenIntervalanduserStatus';  // Importamos la función checkToken y clearTokenCheckInterval

function App() {

  useEffect(() => {
    // Llamamos a la función para verificar y renovar el token al inicio de la app
    checkToken();

    // Verificar si hay un token en localStorage y actualizar la actividad
    const token = localStorage.getItem('jwt');
    if (token) {
      // Verifica el token y actualiza la actividad
      updateLastActivity();

      // Configura el intervalo para actualizar la actividad cada 30 segundos
      const interval = setInterval(updateLastActivity, 30000);

      // Limpia los intervalos cuando el componente se desmonte
      return () => clearInterval(interval);
    }

    // Cleanup: cuando el componente se desmonte, limpiamos el intervalo de token
    return () => {
      clearTokenCheckInterval();
    };
  }, []);  // Solo se ejecuta una vez al montar el componente

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin"
          element={
            <ProtectedRoute
              element={<AdminPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route path="/admin/camara"
          element={
            <ProtectedRoute
              element={<CamaraPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route path="/admin/luces"
          element={
            <ProtectedRoute
              element={<LucesPage />}
              allowedRoles={['admin']}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
