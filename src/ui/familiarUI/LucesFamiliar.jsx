import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/sidebarFamiliar'; 
import API_BASE_URL from '../../js/urlHelper'; 
import Spinner from '../../components/Spinner'; 
import { verificarYRenovarToken } from '../../js/authToken';

function Luces() {
  const [isLightOn1, setIsLightOn1] = useState(false);
  const [isLightOn2, setIsLightOn2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scheduledTime1, setScheduledTime1] = useState('');
  const [scheduledTimeOff1, setScheduledTimeOff1] = useState('');
  const [scheduledTime2, setScheduledTime2] = useState('');
  const [scheduledTimeOff2, setScheduledTimeOff2] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [schedules, setSchedules] = useState([]);

  // Obtener los estados de los LEDs
  const fetchLedStates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      await verificarYRenovarToken();
      const response = await fetch(`${API_BASE_URL}/api/getLedStates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsLightOn1(data[1] === 1); 
      setIsLightOn2(data[2] === 1); 
    } catch (error) {
      console.error("Error al obtener los estados de los LEDs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Alternar estado de los LEDs
  const toggleLight = async (ledId, currentState) => {
    const newState = currentState ? 0 : 1;
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      await verificarYRenovarToken();
      const response = await fetch(`${API_BASE_URL}/api/updateLedState/${ledId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ state: newState }),
      });

      if (response.ok) {
        if (ledId === 1) {
          setIsLightOn1(newState === 1);
        } else if (ledId === 2) {
          setIsLightOn2(newState === 1);
        }
      } else {
        console.error('Error al actualizar el estado del LED');
      }
    } catch (error) {
      console.error("Error al cambiar el estado del LED:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('jwt');  // Obtener el token del localStorage
      const response = await fetch(`${API_BASE_URL}/api/led/schedulesFamiliar`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Enviar el token en el encabezado Authorization
        },
      });
  
      const data = await response.json();
  
      // Verificamos si no hay programaciones
      if (data.message) {
        setError(data.message);  // Si la respuesta tiene el campo message, lo mostramos como error
        setSchedules([]);         // Limpiamos las programaciones en el estado
      } else {
        setSchedules(data);       // Si hay programaciones, las guardamos en el estado
        setError('');             // Limpiamos cualquier mensaje de error
      }
    } catch (err) {
      setError('Hubo un error al obtener las programaciones.');
      setSchedules([]); // Limpiamos las programaciones en caso de error
    }
  };

  const scheduleLights = async (lightId) => {
    let horaEncendido, horaApagado;
    if (lightId === 1) {
      horaEncendido = scheduledTime1;
      horaApagado = scheduledTimeOff1;
    } else {
      horaEncendido = scheduledTime2;
      horaApagado = scheduledTimeOff2;
    }

    // Crear el objeto con los datos a enviar
    const data = {
      hora_encendido: horaEncendido + ':00',  // Asegúrate de que las horas estén en formato HH:mm:ss
      hora_apagado: horaApagado + ':00',
      id: lightId,
    };
    const token = localStorage.getItem('jwt');
    setLoading(true);
    try {
      // Enviar los datos al servidor usando fetch
      const response = await fetch(`${API_BASE_URL}/api/led/scheduleFamiliar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message);
        setError('');
        fetchSchedules();
      } else {
        setError(result.error);
        setSuccessMessage('');
        fetchSchedules();
      }
    } catch (err) {
      setError('Hubo un error al enviar la solicitud');
      setSuccessMessage('');
      fetchSchedules();
    }finally {
      setLoading(false);
    }
  };

  // Eliminar programación
  const deleteSchedule = async (id) => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await fetch(`${API_BASE_URL}/api/led/scheduleFamiliar/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setError('');
        fetchSchedules(); 
      } else {
        setError(data.error);
        setSuccessMessage('');
      }
    } catch (err) {
      setError('Hubo un error al eliminar la programación.');
      setSuccessMessage('');
    }
  };

  useEffect(() => {
    fetchLedStates();
    fetchSchedules();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen relative">
      <SidebarAdmin />
      {loading && <Spinner />}
      
      <div className="flex-1 p-6 mt-16 bg-blue-100 flex flex-col lg:flex-row gap-8">
  
        {/* Contenedor para la programación de luces */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg mb-6 lg:mb-0">
          <h2 className="text-3xl font-bold mb-6 text-center">Programar Luces</h2>
  
          {/* Flexbox para mostrar las luces en fila */}
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {/* Foco Patio */}
            <div 
              onClick={() => toggleLight(1, isLightOn1)} 
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn1 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 sm:w-40 sm:h-56 rounded-3xl justify-center`}>
              <div className={`w-24 h-36 sm:w-28 sm:h-40 ${isLightOn1 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div>
              <span className="text-white font-bold">{isLightOn1 ? 'Luz Patio ON' : 'Luz Patio OFF'}</span>
            </div>
  
            {/* Foco Casa */}
            <div 
              onClick={() => toggleLight(2, isLightOn2)} 
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn2 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 sm:w-40 sm:h-56 rounded-3xl justify-center`}>
              <div className={`w-24 h-36 sm:w-28 sm:h-40 ${isLightOn2 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div>
              <span className="text-white font-bold">{isLightOn2 ? 'Luz Casa ON' : 'Luz Casa OFF'}</span>
            </div>
          </div>
  
          {/* Formulario de programación de luces debajo de las luces */}
          <div className="my-6">
            <div className="flex flex-col gap-4">
              {/* Programación para Luz 1 */}
              <div>
                <label className="block">Hora de encendido (Luz Patio)</label>
                <input
                  type="time"
                  value={scheduledTime1}
                  onChange={(e) => setScheduledTime1(e.target.value)}
                  className="border p-2 rounded w-full sm:w-56"
                />
                <label className="block">Hora de apagado (Luz Patio)</label>
                <input
                  type="time"
                  value={scheduledTimeOff1}
                  onChange={(e) => setScheduledTimeOff1(e.target.value)}
                  className="border p-2 rounded w-full sm:w-56"
                />
                <button
                  onClick={() => scheduleLights(1)}
                  className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
                >
                  Programar Luz Patio
                </button>
              </div>
  
              {/* Programación para Luz 2 */}
              <div>
                <label className="block">Hora de encendido (Luz Casa)</label>
                <input
                  type="time"
                  value={scheduledTime2}
                  onChange={(e) => setScheduledTime2(e.target.value)}
                  className="border p-2 rounded w-full sm:w-56"
                />
                <label className="block">Hora de apagado (Luz Casa)</label>
                <input
                  type="time"
                  value={scheduledTimeOff2}
                  onChange={(e) => setScheduledTimeOff2(e.target.value)}
                  className="border p-2 rounded w-full sm:w-56"
                />
                <button
                  onClick={() => scheduleLights(2)}
                  className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
                >
                  Programar Luz Casa
                </button>
              </div>
            </div>
          </div>
  
          {/* Mensajes de Error y Éxito */}
          {error && <div className="text-red-500">{error}</div>}
          {successMessage && <div className="text-green-500">{successMessage}</div>}
        </div>
  
        {/* Contenedor para la tabla de programaciones */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-center">Programaciones</h3>
          
          {/* Contenedor con scroll horizontal */}
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full min-w-max border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Luz</th>
                  <th className="px-4 py-2 border">Hora Encendido</th>
                  <th className="px-4 py-2 border">Hora Apagado</th>
                  <th className="px-4 py-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(schedule => (
                  <tr key={schedule.id}>
                    <td className="px-4 py-2 border">
                      {schedule.id === 1 ? 'Luz Patio' : 'Luz Casa'}
                    </td>
                    <td className="px-4 py-2 border">{schedule.hora_encendido}</td>
                    <td className="px-4 py-2 border">{schedule.hora_apagado}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Luces;
