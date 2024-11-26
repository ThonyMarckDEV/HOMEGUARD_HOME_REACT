// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './ui/Home';
import Login from './ui/Login';
import ProtectedRoute from './utilities/ProtectedRoute'; // Importa la ruta protegida
import AdminPage from './ui/adminUI/Admin'; // Ejemplo de una página para admin
import CamaraPage from './ui/adminUI/Camara'; // Ejemplo de una página para admin
import LucesPage from './ui/adminUI/Luces'; // Ejemplo de una página para admin

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta para la página de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta protegida para Admin, solo accesible por usuarios con rol 'admin' */}
        <Route path="/admin"
          element={
            <ProtectedRoute
              element={<AdminPage />}
              allowedRoles={['admin']} // Solo los usuarios con el rol 'admin' pueden acceder
            />
          }
        />

         <Route path="/admin/camara"
          element={
            <ProtectedRoute
              element={<CamaraPage />}
              allowedRoles={['admin']} // Solo los usuarios con el rol 'admin' pueden acceder
            />
          }
        />

        <Route path="/admin/luces"
          element={
            <ProtectedRoute
              element={<LucesPage />}
              allowedRoles={['admin']} // Solo los usuarios con el rol 'admin' pueden acceder
            />
          }
        />
        {/* Otras rutas protegidas pueden añadirse de forma similar */}
      </Routes>
    </Router>
  );
}

export default App;
