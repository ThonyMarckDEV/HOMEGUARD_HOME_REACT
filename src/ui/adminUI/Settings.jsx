import React, { useState, useEffect, useRef } from 'react';
import SidebarAdmin from '../../components/sidebarAdmin';
import API_BASE_URL from '../../js/urlHelper';
import jwtUtils from '../../utilities/jwtUtils';
import Spinner from '../../components/Spinner'; // Asegúrate de importar el Spinner

const Settings = () => {
  const [userData, setUserData] = useState({
    username: '',
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    edad: '',
    nacimiento: '',
    sexo: '',
    direccion: '',
    telefono: '',
    departamento: '',
    perfil: '', // Foto de perfil
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({ ...userData });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga para mostrar el spinner

  const editableContainerRef = useRef(null); // Ref para el contenedor editable

  // Detectar clics fuera del área editable
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editableContainerRef.current &&
        !editableContainerRef.current.contains(event.target)
      ) {
        setIsEditing(false); // Desactivar modo edición
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Mostrar el spinner al iniciar la solicitud
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${API_BASE_URL}/api/perfilUsuario`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData({
          ...data.data,
        });
        setUpdatedData({ ...data.data });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Ocultar el spinner una vez que la API haya respondido
      }
    };

    fetchUserData();
  }, []);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar la selección de nueva imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Subir la imagen de perfil
  const uploadProfileImage = async () => {
    if (!imageFile) {
      alert('Por favor selecciona una imagen antes de subir.');
      return;
    }

    const formData = new FormData();
    formData.append('perfil', imageFile);

    try {
      setIsUploading(true);
      const token = localStorage.getItem('jwt');
      const idUsuario = jwtUtils.getIdUsuario(token);

      const response = await fetch(`${API_BASE_URL}/api/uploadProfileImageUsuario/${idUsuario}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserData((prevState) => ({
          ...prevState,
          perfil: `${API_BASE_URL}/${data.filename}`,
        }));
        alert('Imagen de perfil actualizada con éxito.');
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Error uploading profile image:', errorData.message || 'Unknown error');
        alert('Error al subir la imagen.');
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      alert('Ocurrió un error al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const updateUserData = async () => {
    setLoading(true); // Mostrar el spinner al iniciar la solicitud

    try {
      const token = localStorage.getItem('jwt');
      const idUsuario = jwtUtils.getIdUsuario(token);

      const response = await fetch(`${API_BASE_URL}/api/updateUsuario/${idUsuario}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData({
          ...updatedData,
        });
        setIsEditing(false); // Desactivar el modo de edición
        alert('Datos actualizados con éxito.');
      } else {
        console.error('Error updating user data:', data.message || 'Unknown error');
        alert(`Error al actualizar los datos: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Ocurrió un error al actualizar los datos.');
    } finally {
      setLoading(false); // Ocultar el spinner al finalizar la solicitud
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <SidebarAdmin />
  
      {/* Mostrar Spinner mientras carga */}
      {loading && <Spinner />} {/* Mostrar el spinner si está en estado de carga */}
  
      {/* Contenido principal */}
      <div className="flex-1 ml-0 lg:ml-1 p-6 bg-blue-100 pt-16"> {/* Ajustado el padding-top */}
        <div
          ref={editableContainerRef} // Ref para el contenedor editable
          className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-4"
        >
          <h2 className="text-3xl font-semibold text-center mb-6">Mi Perfil</h2>
  
          {/* Foto de perfil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
              <img
                src={userData.perfil || '/placeholder.png'}
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <input type="file" onChange={handleImageChange} />
            <button
              onClick={uploadProfileImage}
              disabled={isUploading}
              className={`px-6 py-2 rounded-lg text-white ${
                isUploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-400'
              }`}
            >
              {isUploading ? 'Subiendo...' : 'Actualizar Imagen'}
            </button>
          </div>
  
          {/* Datos del usuario */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-4"> {/* Usar flex-wrap y espaciado */}
              {[
                'username',
                'nombres',
                'apellidos',
                'dni',
                'correo',
                'edad',
                'nacimiento',
                'sexo',
                'direccion',
                'telefono',
                'departamento',
              ].map((field, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full md:w-[48%] lg:w-[30%] mb-4"
                >
                  {/* Etiqueta del campo */}
                  <label className="font-semibold text-lg mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {/* Campo de entrada o texto */}
                  {isEditing && !['dni', 'nombres', 'apellidos'].includes(field) ? (
                    <input
                      type="text"
                      name={field}
                      value={updatedData[field]}
                      onChange={handleChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg w-full"
                    />
                  ) : (
                    <span
                      className={`block px-4 py-2 bg-gray-100 rounded-lg ${
                        ['dni', 'nombres', 'apellidos'].includes(field)
                          ? 'font-semibold'
                          : ''
                      }`}
                    >
                      {userData[field]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Botones para editar y guardar datos */}
          <div className="mt-6 flex justify-center space-x-4">
            {isEditing ? (
              <button
                onClick={updateUserData}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-lg"
              >
                Guardar Cambios
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-2 rounded-lg"
              >
                Editar Información
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
