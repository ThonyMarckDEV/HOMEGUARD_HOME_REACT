import React from 'react';
import Navbar from '../components/NavBar'; // Importar la barra de navegación

const Servicios = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-8">Nuestros Servicios</h1>
          <p className="text-lg text-center mb-8">
            En HomeGuard, ofrecemos una variedad de servicios de seguridad avanzados para el hogar. Nuestro objetivo es proteger lo más valioso: tu familia y tu propiedad, brindando soluciones personalizadas y tecnología de punta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Servicio 1 - Cámaras de Seguridad */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-black">Cámaras de Seguridad</h3>
              <p className="text-black">Instalación de cámaras de seguridad de alta definición para monitoreo en tiempo real desde cualquier lugar.</p>
            </div>
            
            {/* Servicio 2 - Sensores de Movimiento */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-black">Sensores de Movimiento</h3>
              <p className="text-black">Implementación de sensores inteligentes para detectar actividad sospechosa y proteger tu hogar las 24 horas.</p>
            </div>
            
            {/* Servicio 3 - Alarmas Inteligentes */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-black">Alarmas Inteligentes</h3>
              <p className="text-black">Alarmas integradas que se activan en caso de intrusión, con notificaciones en tiempo real a tu dispositivo.</p>
            </div>
          </div>
          
          {/* Servicios adicionales */}
          <div className="mt-12">
            <h2 className="text-3xl font-semibold text-center mb-8 text-white">Servicios Adicionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Sistema de Monitoreo a Medida */}
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-black">Sistema de Monitoreo a Medida</h3>
                <p className="text-black">Soluciones personalizadas para el monitoreo de tu hogar, con control total desde tu dispositivo móvil.</p>
              </div>
              
              {/* Domótica para Luces */}
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-black">Domótica para Luces</h3>
                <p className="text-black">Controla las luces de tu hogar de manera automática o manual, desde cualquier lugar a través de nuestro sistema web.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
              {/* Reportes y Dashboard */}
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-black">Reportes y Dashboard</h3>
                <p className="text-black">Accede a reportes detallados de seguridad, visualiza el estado de tu hogar y recibe alertas personalizadas en tiempo real.</p>
              </div>
              
              {/* Activación y Desactivación del Sistema */}
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-black">Activación y Desactivación del HomeGuard</h3>
                <p className="text-black">Activa y desactiva el sistema de seguridad desde tu dispositivo móvil o mediante programación automática.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
              {/* Adición de Familiares */}
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-black">Adición de Familiares</h3>
                <p className="text-black">Agrega familiares al sistema para que también puedan monitorear y controlar la seguridad del hogar.</p>
              </div>
              
              {/* Notificaciones por Gmail */}
              <div className="bg-white shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-black">Avisos por Gmail</h3>
                <p className="text-black">Recibe notificaciones y alertas por correo electrónico en caso de cualquier evento o intrusión en el hogar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Servicios;
