import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

// Importa los componentes
import Home from './ui/Home';
import Login from './ui/Login';
import Nosotros from './ui/Nosotros';
import Servicios from './ui/Servicios';
import Contacto from './ui/Contacto';
import ProtectedRoute from './utilities/ProtectedRoute';

// UI Admin
import AdminPage from './ui/adminUI/Admin';
import CamaraPage from './ui/adminUI/Camara';
import LucesPage from './ui/adminUI/Luces';
import SettingsPage from './ui/adminUI/Settings';
import ReportesPage from './ui/adminUI/Reportes';
import DashboardPage from './ui/adminUI/Dashboard';
import AuditoriaPage from './ui/adminUI/Auditoria';

// UI Familiar
import FamiliarCamara from './ui/familiarUI/Camarafamiliar';
import LucesPageFamiliar from './ui/familiarUI/LucesFamiliar';
import SettingsPageFamiliar from './ui/familiarUI/SettingsFamiliar';

// Scripts para actividad y token
import { updateLastActivity } from './js/lastActivity';
import { checkToken, clearTokenCheckInterval } from './js/checkTokenIntervalanduserStatus';

// Componente para manejar la lógica con `useLocation`
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      updateLastActivity();
      checkToken();
    }

    return () => {
      clearTokenCheckInterval();
    };
  }, [location.pathname]); // Ejecutar cada vez que cambie la ruta

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />} />
      <Route path="/admin/camara" element={<ProtectedRoute element={<CamaraPage />} allowedRoles={['admin']} />} />
      <Route path="/admin/luces" element={<ProtectedRoute element={<LucesPage />} allowedRoles={['admin']} />} />
      <Route path="/admin/settings" element={<ProtectedRoute element={<SettingsPage />} allowedRoles={['admin']} />} />
      <Route path="/admin/reportes" element={<ProtectedRoute element={<ReportesPage />} allowedRoles={['admin']} />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute element={<DashboardPage />} allowedRoles={['admin']} />} />
      <Route path="/admin/auditoria" element={<ProtectedRoute element={<AuditoriaPage />} allowedRoles={['admin']} />} />
      <Route path="/familiar/camara" element={<ProtectedRoute element={<FamiliarCamara />} allowedRoles={['familiar']} />} />
      <Route path="/familiar/luces" element={<ProtectedRoute element={<LucesPageFamiliar />} allowedRoles={['familiar']} />} />
      <Route path="/familiar/settings" element={<ProtectedRoute element={<SettingsPageFamiliar />} allowedRoles={['familiar']} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
