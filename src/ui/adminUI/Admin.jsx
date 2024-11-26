import React from 'react';
import SidebarAdmin from '../../components/sidebarAdmin'; // Asegúrate de ajustar la ruta


function Admin() {

  return (
    <div className="flex h-screen">

      <SidebarAdmin />
      
      {/* Contenido de la página escritorio */}
      <div className="flex-1 ml-0 lg:ml-10 mt-20">  {/* Añadido mt-16 para el espacio debajo de la barra superior */}
        <h2 className="text-3xl font-bold mb-4">Escritorio</h2>
      </div>

    </div>
  );
}

export default Admin;
