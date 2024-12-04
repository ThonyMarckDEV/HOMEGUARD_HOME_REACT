import React from 'react';
import Navbar from '../components/NavBar'; // Importar la barra de navegación

const Contacto = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Navbar />
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-8">Contáctanos</h1>
          <p className="text-lg text-center mb-8">
            Si tienes preguntas o deseas obtener más información sobre nuestros productos y servicios, no dudes en contactarnos. ¡Estamos aquí para ayudarte a proteger tu hogar!
          </p>
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium text-gray-800">Nombre</label>
                <input type="text" id="name" className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium text-gray-800">Correo Electrónico</label>
                <input type="email" id="email" className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-lg font-medium text-gray-800">Mensaje</label>
                <textarea id="message" className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md" rows="4"></textarea>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-400 transition-colors">Enviar</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
