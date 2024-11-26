import React from 'react';
import SidebarAdmin from '../../components/sidebarAdmin'; // Asegúrate de ajustar la ruta

function Camara() {
  return (
    <div className="flex h-screen">
      
      <SidebarAdmin />
      {/* Contenido de la página de la cámara */}
      <div className="flex-1 ml-0 lg:ml-1">

        {/* Contenido de la página */}
        <div className="p-6 mt-16">
          <h2 className="text-3xl font-bold mb-4">Vista en vivo de la cámara</h2>
          <div className="flex justify-center mb-6">
            {/* Aquí puedes agregar la vista en vivo de la cámara, ya sea con un video o una imagen */}
            <iframe
            src="https://www.youtube.com/embed/ffu93KhnSKg"  // Reemplaza con la URL de la cámara en vivo
            className="w-full h-96"
            frameBorder="0"
            allowFullScreen
            title="Cámara en vivo"
          />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Camara;
