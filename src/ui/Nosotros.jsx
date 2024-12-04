import React from 'react';
import Navbar from '../components/NavBar'; // Importar la barra de navegación

const Nosotros = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-8">Sobre Nosotros</h1>
          <p className="text-lg text-center mb-8">
            En HomeGuard, nos especializamos en ofrecer soluciones de seguridad avanzadas para el hogar. Nuestro sistema incluye cámaras de alta definición, sensores de movimiento, alarmas integradas y un sistema web intuitivo para que puedas monitorear tu hogar desde cualquier lugar.
          </p>
          <div className="flex justify-center">
            <img src="../img/HOMEGUARDLOGO.jfif" alt="Imagen de HomeGuard" className="w-full max-w-4xl rounded-lg shadow-lg" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nosotros;
