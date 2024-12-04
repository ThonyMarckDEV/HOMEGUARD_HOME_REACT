import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './ui/Home';
import Login from './ui/Login';
import ProtectedRoute from './utilities/ProtectedRoute';
//UIADMIN
import AdminPage from './ui/adminUI/Admin';
import CamaraPage from './ui/adminUI/Camara';
import LucesPage from './ui/adminUI/Luces';
import SettingsPage from './ui/adminUI/Settings';
import ReportesPage from './ui/adminUI/Reportes';
import DashboardPage from './ui/adminUI/Dashboard';
import AuditoriaPage from './ui/adminUI/Auditoria';

//UIFAMILIAR
import FamiliarCamara from './ui/familiarUI/Camarafamiliar';
import LucesPageFamiliar from './ui/familiarUI/LucesFamiliar';
import SettingsPageFamiliar from './ui/familiarUI/SettingsFamiliar';


//Clases js Para actividad usuaruios y chekearToken y estado usuario (LoggedOn - Off)
import { updateLastActivity } from './js/lastActivity'; // Asegúrate de que esté exportada desde su archivo (Scritp para acutalizar la ultiam actividad del usuario)
import { checkToken, clearTokenCheckInterval,checkUserStatus } from './js/checkTokenIntervalanduserStatus';  // Importamos la función checkToken y clearTokenCheckInterval

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
        <Route path="/admin/settings"
          element={
            <ProtectedRoute
              element={<SettingsPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route path="/admin/reportes"
          element={
            <ProtectedRoute
              element={<ReportesPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route path="/admin/dashboard"
          element={
            <ProtectedRoute
              element={<DashboardPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route path="/admin/auditoria"
          element={
            <ProtectedRoute
              element={<AuditoriaPage />}
              allowedRoles={['admin']}
            />
          }
        />

        <Route path="/familiar/camara"
          element={
            <ProtectedRoute
              element={<FamiliarCamara />}
              allowedRoles={['familiar']}
            />
          }
        />
        <Route path="/familiar/luces"
          element={
            <ProtectedRoute
              element={<LucesPageFamiliar />}
              allowedRoles={['familiar']}
            />
          }
        />
        <Route path="/familiar/settings"
          element={
            <ProtectedRoute
              element={<SettingsPageFamiliar />}
              allowedRoles={['familiar']}
            />
          }
        />


      </Routes>
    </Router>
  );
}

export default App;
