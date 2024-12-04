import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin';
import API_BASE_URL from '../../js/urlHelper';
import { verificarYRenovarToken } from '../../js/authToken';

function Auditoria() {
    const [usuarios, setUsuarios] = useState([]);
    const [auditorias, setAuditorias] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('jwt');

    useEffect(() => {
      fetch(`${API_BASE_URL}/api/usuarios/familiares/auditoria`)
          .then((response) => response.json())
          .then((data) => {
              console.log(data);  // Asegúrate de ver los datos aquí
              setUsuarios(data);
          })
          .catch((error) => console.error('Error fetching usuarios:', error));


        fetchAuditorias();
    }, []);

    useEffect(() => {
        fetchAuditorias();
    }, [selectedUsuario]);

    const fetchAuditorias = () => {
        setIsLoading(true);
       // En fetch de auditorías
      fetch(`${API_BASE_URL}/api/auditorias?idUsuario=${selectedUsuario}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Auditorías recibidas:", data); // Debug
          setAuditorias(data);
        })
        .catch((error) => console.error("Error fetching auditorias:", error))
        .finally(() => setIsLoading(false));
    };

    const handleUsuarioChange = (e) => {
        setSelectedUsuario(e.target.value);
    };

    return (
        <div className="flex min-h-screen bg-blue-100 text-gray-900 overflow-auto">

            <SidebarAdmin />

            <div className="flex-1 p-6">
              <h1 className="text-2xl font-bold mb-4">Auditoría</h1>
              <div className="mb-4">
                  <label htmlFor="usuario" className="block text-sm font-medium mb-2 text-gray-700">Filtrar por usuario</label>
                  <select 
                      onChange={handleUsuarioChange} 
                      value={selectedUsuario}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  >
                      <option value="" className="text-gray-500">Seleccionar usuario</option>
                      {usuarios.length > 0 ? (
                          usuarios.map((usuario) => (
                              <option key={usuario.id} value={usuario.id} className="text-black">
                                  {usuario.nombres} {usuario.apellidos}
                              </option>
                          ))
                      ) : (
                          <option disabled className="text-gray-500">Cargando usuarios...</option>
                      )}
                  </select>
              </div>


                <table className="min-w-full bg-white border border-gray-300 rounded-md">
                    <thead>
                        <tr>
                            <th className="p-2 border-b">Usuario</th>
                            <th className="p-2 border-b">Descripción</th>
                            <th className="p-2 border-b">Fecha y Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="3" className="p-4 text-center">Cargando...</td>
                            </tr>
                        ) : auditorias.length > 0 ? (
                            auditorias.map((auditoria) => (
                                <tr key={auditoria.id}>
                                    <td className="p-2 border-b">{auditoria.nombre_completo}</td>
                                    <td className="p-2 border-b">{auditoria.descripcion}</td>
                                    <td className="p-2 border-b">{auditoria.fecha_hora}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-4 text-center">No hay auditorías disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
            
        </div>
    );
}

export default Auditoria;
