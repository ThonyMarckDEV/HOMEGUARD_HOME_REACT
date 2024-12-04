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

    // Usamos useEffect para verificar el token y cargar usuarios
    useEffect(() => {
        const cargarDatos = async () => {
            await verificarYRenovarToken();  // Verificar el token
            fetchUsuarios();
            fetchAuditorias();
        };
        cargarDatos();
        
        // No es necesario limpiar nada aquí si no estamos usando un timer o suscripción
    }, []); // Solo se ejecuta una vez cuando el componente se monta

    useEffect(() => {
        fetchAuditorias();
    }, [selectedUsuario]);

    const fetchUsuarios = () => {
        fetch(`${API_BASE_URL}/api/usuarios/familiares/auditoria`)
            .then((response) => response.json())
            .then((data) => {
                setUsuarios(data);
            })
            .catch((error) => console.error('Error fetching usuarios:', error));
    };

    const fetchAuditorias = async () => {
        setIsLoading(true);
        await verificarYRenovarToken();  // Verificar el token
        fetch(`${API_BASE_URL}/api/auditorias?idUsuario=${selectedUsuario}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setAuditorias(data);
            })
            .catch((error) => console.error('Error fetching auditorias:', error))
            .finally(() => setIsLoading(false));
    };

    const handleUsuarioChange = (e) => {
        setSelectedUsuario(e.target.value);
    };

    return (
        <div className="flex min-h-screen bg-blue-50 text-gray-900 overflow-auto">
            <SidebarAdmin />

            <div className="flex-1 p-6 lg:p-10">
                <h1 className="text-3xl font-semibold mb-6">Auditoría</h1>
                
                <div className="mb-6 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                    <div className="w-full lg:w-1/3">
                        <label htmlFor="usuario" className="block text-sm font-medium mb-2 text-gray-700">Filtrar por usuario</label>
                        <select 
                            onChange={handleUsuarioChange} 
                            value={selectedUsuario}
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
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
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
                    <table className="min-w-full">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="p-3 text-left">Usuario</th>
                                <th className="p-3 text-left">Descripción</th>
                                <th className="p-3 text-left">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center">Cargando...</td>
                                </tr>
                            ) : auditorias.length > 0 ? (
                                auditorias.map((auditoria) => (
                                    <tr key={auditoria.id} className="hover:bg-gray-100">
                                        <td className="p-3 border-b">{auditoria.nombre_completo}</td>
                                        <td className="p-3 border-b">{auditoria.descripcion}</td>
                                        <td className="p-3 border-b">{auditoria.fecha_hora}</td>
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
        </div>
    );
}

export default Auditoria;
