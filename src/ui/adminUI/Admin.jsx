import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin';
import API_BASE_URL from '../../js/urlHelper';
import Spinner from '../../components/Spinner';
import { verificarYRenovarToken } from '../../js/authToken';

const Admin = () => {
  const [isVigilanceModeOn, setIsVigilanceModeOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const [familyData, setFamilyData] = useState({
    username: '',
    nombres: '',
    apellidos: '',
    password: '',
    repeatPassword: '',
  });

  // Obtener el estado actual de la vigilancia desde la API
  useEffect(() => {

    const fetchVigilanceStatus = async () => {
      setLoading(true);
      await verificarYRenovarToken();  // Verificar el token
      try {
        const response = await fetch(`${API_BASE_URL}/api/vigilance/status`);
        const data = await response.json();
        setIsVigilanceModeOn(data.is_active);
      } catch (error) {
        console.error('Error fetching vigilance mode', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVigilanceStatus();
    fetchFamiliares();
  }, []);

  const fetchFamiliares = async () => {
    setLoading(true);
    await verificarYRenovarToken(); // Verificar y renovar token si es necesario
    const token = localStorage.getItem('jwt');  // Obtener el token JWT desde el almacenamiento local
    try {
      const response = await fetch(`${API_BASE_URL}/api/usuarios/familiares`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data);  // Guardamos los usuarios con el rol familiar
      } else {
        console.error('Error al obtener los familiares', data);
      }
    } catch (error) {
      console.error('Error fetching familiares', error);
    } finally {
      setLoading(false);
    }
  };


  const toggleVigilanceMode = async () => {
    const token = localStorage.getItem('jwt');
    setLoading(true);
    await verificarYRenovarToken();  // Verificar el token
    try {
      const response = await fetch(`${API_BASE_URL}/api/vigilance/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !isVigilanceModeOn,
        }),
      });

      if (response.ok) {
        setIsVigilanceModeOn((prevState) => !prevState);
      } else {
        console.error('Error updating vigilance mode');
      }
    } catch (error) {
      console.error('Error toggling vigilance mode', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFamilyInputChange = (e) => {
    setFamilyData({
      ...familyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setLoading(true);
      const token = localStorage.getItem('jwt'); // Obtener el token JWT
      try {
        const response = await fetch(`${API_BASE_URL}/api/usuarios/eliminar/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Autorización con el token JWT
          },
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message); // Mostrar el mensaje de éxito
          setUsuarios(usuarios.filter(usuario => usuario.idUsuario !== id));  // Eliminar de la lista local
          fetchFamiliares();
        } else {
          alert('Error al eliminar el usuario');
        }
      } catch (error) {
        console.error('Error eliminando el usuario', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const [formErrors, setFormErrors] = useState({
    username: '',
    nombres: '',
    apellidos: '',
    password: '',
    repeatPassword: '',
    correo: '',
    dni: '',
  });
  
  const addFamilyMember = async () => {
    const { username, nombres, apellidos, password, repeatPassword, correo, dni } = familyData;
  
    // Limpiar errores previos
    setFormErrors({
      username: '',
      nombres: '',
      apellidos: '',
      password: '',
      repeatPassword: '',
      correo: '',
      dni: '',
    });
  
    // Verificar que todos los campos obligatorios estén completos
    if (!username || !nombres || !apellidos || !password || !repeatPassword || !correo || !dni) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    // Verificar que las contraseñas coincidan
    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    const token = localStorage.getItem('jwt');
    setLoading(true);
    await verificarYRenovarToken();  // Verificar el token
    try {
      const response = await fetch(`${API_BASE_URL}/api/registrarUsuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          nombres,
          apellidos,
          correo,
          dni,
          password,
          password_confirmation: repeatPassword,
        }),
      });
  
      // Verificar que la respuesta no sea HTML
      const textResponse = await response.text(); // Obtener la respuesta como texto
      let data = {};
  
      try {
        data = JSON.parse(textResponse); // Intentar parsear la respuesta como JSON
      } catch (e) {
        console.error('Respuesta no JSON:', textResponse); // Si no es JSON, imprimir el texto
        alert('La respuesta del servidor no es válida JSON.');
        return;
      }
  
      if (response.ok) {
        alert('Familiar añadido con éxito.');
        setFamilyData({
          username: '',
          nombres: '',
          apellidos: '',
          correo: '',
          dni: '',
          password: '',
          repeatPassword: '',
        });
        fetchFamiliares();
      } else {
        // Capturar los errores del backend y mostrarlos en el estado
        setFormErrors(data.errors || {});
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al enviar los datos.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-blue-100 text-gray-900 overflow-auto">
      <SidebarAdmin />

      {/* Mostrar Spinner mientras carga */}
      {loading && <Spinner />}

      <div className="flex-1 flex flex-col items-center justify-start space-y-8 px-4 sm:px-8 md:px-16 mt-20">
        <h2 className="text-3xl font-bold text-center">Gestión de Dispositivos y Familiares</h2>

        {/* Contenedor de Modo Vigilancia */}
        <div className="w-full max-w-3xl bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold">Modo Vigilancia</h3>
          <button
            onClick={toggleVigilanceMode}
            className={`flex items-center justify-center w-full sm:w-60 h-12 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
              isVigilanceModeOn ? 'bg-green-500' : 'bg-red-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <span className="mr-2">
              {isVigilanceModeOn ? 'Modo Vigilancia Encendido' : 'Modo Vigilancia Apagado'}
            </span>
          </button>
        </div>

        {/* Contenedor de Agregar Familiar */}
        <div className="w-full max-w-3xl bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold">Agregar Familiar</h3>
          <div className="space-y-4">

            {/* Contenedor con flexbox para campos */}
            <div className="flex flex-wrap gap-4">
              {/* Campo para el nombre de usuario */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  name="username"
                  value={familyData.username}
                  onChange={handleFamilyInputChange}
                  placeholder="Nombre de Usuario"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm">{formErrors.username}</p>
                )}
              </div>

              {/* Campo para los nombres */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  name="nombres"
                  value={familyData.nombres}
                  onChange={handleFamilyInputChange}
                  placeholder="Nombres"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  }}
                  title="El campo 'Nombres' solo debe contener letras y espacios."
                />
                {formErrors.nombres && (
                  <p className="text-red-500 text-sm">{formErrors.nombres}</p>
                )}
              </div>

              {/* Campo para los apellidos */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  name="apellidos"
                  value={familyData.apellidos}
                  onChange={handleFamilyInputChange}
                  placeholder="Apellidos"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  }}
                  title="El campo 'Apellidos' solo debe contener letras y espacios."
                />
                {formErrors.apellidos && (
                  <p className="text-red-500 text-sm">{formErrors.apellidos}</p>
                )}
              </div>

              {/* Campo para el correo */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="email"
                  name="correo"
                  value={familyData.correo}
                  onChange={handleFamilyInputChange}
                  placeholder="Correo Electrónico"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.correo && (
                  <p className="text-red-500 text-sm">{formErrors.correo}</p>
                )}
              </div>

              {/* Campo para el DNI */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  name="dni"
                  value={familyData.dni}
                  onChange={handleFamilyInputChange}
                  placeholder="DNI"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={8}
                  pattern="^\d{8}$"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8);
                  }}
                />
                {formErrors.dni && (
                  <p className="text-red-500 text-sm">{formErrors.dni}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Campo para la contraseña */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="password"
                  name="password"
                  value={familyData.password}
                  onChange={handleFamilyInputChange}
                  placeholder="Contraseña"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm">{formErrors.password}</p>
                )}
              </div>

              {/* Campo para repetir la contraseña */}
              <div className="flex-1 min-w-[250px]">
                <input
                  type="password"
                  name="repeatPassword"
                  value={familyData.repeatPassword}
                  onChange={handleFamilyInputChange}
                  placeholder="Repetir Contraseña"
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.repeatPassword && (
                  <p className="text-red-500 text-sm">{formErrors.repeatPassword}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={addFamilyMember}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            Agregar Familiar
          </button>
        </div>


        <div className="w-full">
          <h2 className="text-2xl font-bold mb-4">Usuarios Familiares</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <>
              {/* Tabla para dispositivos de escritorio */}
              <div className="hidden md:block w-full overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Nombre</th>
                      <th className="px-4 py-2 border">Correo</th>
                      <th className="px-4 py-2 border">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.idUsuario}>
                        <td className="px-4 py-2 border">{usuario.nombres} {usuario.apellidos}</td>
                        <td className="px-4 py-2 border">{usuario.correo}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => handleEliminar(usuario.idUsuario)}
                            className="bg-red-500 text-white py-1 px-3 rounded"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Lista para dispositivos móviles */}
              <div className="md:hidden space-y-4">
                {usuarios.map((usuario) => (
                  <div 
                    key={usuario.idUsuario} 
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{usuario.nombres} {usuario.apellidos}</span>
                      <button
                        onClick={() => handleEliminar(usuario.idUsuario)}
                        className="bg-red-500 text-white py-1 px-3 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="text-gray-600">{usuario.correo}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
  
      </div>
    </div>
  );
};

export default Admin;
