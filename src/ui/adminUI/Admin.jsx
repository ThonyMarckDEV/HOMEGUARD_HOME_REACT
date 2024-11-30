import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin';
import API_BASE_URL from '../../js/urlHelper';
import Spinner from '../../components/Spinner';

const Admin = () => {
  const [isVigilanceModeOn, setIsVigilanceModeOn] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, []);

  const toggleVigilanceMode = async () => {
    const token = localStorage.getItem('jwt');
    setLoading(true);
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
    <div className="flex flex-col h-screen bg-blue-100 text-gray-900 min-h-screen">
      <SidebarAdmin />
  
      {/* Mostrar Spinner mientras carga */}
      {loading && <Spinner />}
  
      <div className="flex-1 flex flex-col items-center justify-start space-y-6 px-4 sm:px-8 md:px-16 mt-10 w-full overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Gestión de Dispositivos y Familiares
        </h2>
  
        {/* Contenedor de Modo Vigilancia */}
        <div className="w-full max-w-lg bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold">Modo Vigilancia</h3>
          <button
            onClick={toggleVigilanceMode}
            className={`flex items-center justify-center w-full h-12 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
              isVigilanceModeOn ? "bg-green-500" : "bg-red-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {isVigilanceModeOn
              ? "Modo Vigilancia Encendido"
              : "Modo Vigilancia Apagado"}
          </button>
        </div>
  
        {/* Contenedor de Agregar Familiar */}
        <div className="w-full max-w-lg bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold">Agregar Familiar</h3>
          <div className="space-y-4">
            {/* Campos flexibles */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 w-full">
                <input
                  type="text"
                  name="username"
                  value={familyData.username}
                  onChange={handleFamilyInputChange}
                  placeholder="Nombre de Usuario"
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm">{formErrors.username}</p>
                )}
              </div>
  
              <div className="flex-1 w-full">
                <input
                  type="text"
                  name="nombres"
                  value={familyData.nombres}
                  onChange={handleFamilyInputChange}
                  placeholder="Nombres"
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                />
                {formErrors.nombres && (
                  <p className="text-red-500 text-sm">{formErrors.nombres}</p>
                )}
              </div>
  
              <div className="flex-1 w-full">
                <input
                  type="text"
                  name="apellidos"
                  value={familyData.apellidos}
                  onChange={handleFamilyInputChange}
                  placeholder="Apellidos"
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  }}
                />
                {formErrors.apellidos && (
                  <p className="text-red-500 text-sm">{formErrors.apellidos}</p>
                )}
              </div>
  
              <div className="flex-1 w-full">
                <input
                  type="email"
                  name="correo"
                  value={familyData.correo}
                  onChange={handleFamilyInputChange}
                  placeholder="Correo Electrónico"
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {formErrors.correo && (
                  <p className="text-red-500 text-sm">{formErrors.correo}</p>
                )}
              </div>
  
              <div className="flex-1 w-full">
                <input
                  type="text"
                  name="dni"
                  value={familyData.dni}
                  onChange={handleFamilyInputChange}
                  placeholder="DNI"
                  maxLength={8}
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
                  }}
                />
                {formErrors.dni && (
                  <p className="text-red-500 text-sm">{formErrors.dni}</p>
                )}
              </div>
  
              <div className="flex-1 w-full">
                <input
                  type="password"
                  name="password"
                  value={familyData.password}
                  onChange={handleFamilyInputChange}
                  placeholder="Contraseña"
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm">{formErrors.password}</p>
                )}
              </div>
  
              <div className="flex-1 w-full">
                <input
                  type="password"
                  name="repeatPassword"
                  value={familyData.repeatPassword}
                  onChange={handleFamilyInputChange}
                  placeholder="Repetir Contraseña"
                  className="w-full px-4 py-2 bg-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {formErrors.repeatPassword && (
                  <p className="text-red-500 text-sm">
                    {formErrors.repeatPassword}
                  </p>
                )}
              </div>
            </div>
  
            <button
              onClick={addFamilyMember}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2 rounded transition-colors"
            >
              Agregar Familiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
