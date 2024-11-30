import React, { useState, useEffect } from 'react';
import SidebarFamiliar from '../../components/sidebarFamiliar'; 
import API_BASE_URL from '../../js/urlHelper'; 
import Spinner from '../../components/Spinner'; 
import { verificarYRenovarToken } from '../../js/authToken';
import Notifications from '../../components/Notificacion'; // Importa el componente Notifications

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
  
      if (data.message) {
        setError(data.message);  // Si la respuesta tiene el campo message, lo mostramos como error
        setSchedules([]);         // Limpiamos las programaciones en el estado
      } else {
        // Asegúrate de que data sea un arreglo antes de asignarlo
        setSchedules(Array.isArray(data) ? data : []);  // Si no es un arreglo, asigna un arreglo vacío
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
  
    const data = {
      hora_encendido: horaEncendido + ":00", // Asegúrate de que las horas estén en formato HH:mm:ss
      hora_apagado: horaApagado + ":00",
      id: lightId,
    };
    const token = localStorage.getItem("jwt");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/led/scheduleFamiliar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSuccessMessage(result.message);
        setError(""); // Limpiar cualquier mensaje de error
        fetchSchedules();
        setScheduledTime1("");
        setScheduledTimeOff1("");
        setScheduledTime2("");
        setScheduledTimeOff2("");
      } else {
        setError(result.error);
        setSuccessMessage(""); // Limpiar cualquier mensaje de éxito
        fetchSchedules();
        setScheduledTime1("");
        setScheduledTimeOff1("");
        setScheduledTime2("");
        setScheduledTimeOff2("");
      }
    } catch (err) {
      setError("Hubo un error al enviar la solicitud");
      setSuccessMessage(""); // Limpiar cualquier mensaje de éxito
      fetchSchedules();
      setScheduledTime1("");
      setScheduledTimeOff1("");
      setScheduledTime2("");
      setScheduledTimeOff2("");
    } finally {
      setLoading(false);
    }
  };

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

  const isLight1ButtonEnabled =
  scheduledTime1 && scheduledTimeOff1 && scheduledTime1 !== scheduledTimeOff1;
  const isLight2ButtonEnabled =
  scheduledTime2 && scheduledTimeOff2 && scheduledTime2 !== scheduledTimeOff2;

  return (
    <div className="flex flex-col lg:flex-row h-screen relative">
      <SidebarFamiliar />
      {loading && <Spinner />}
      
      <div className="flex-1 p-6 mt-16 bg-blue-100 flex flex-col lg:flex-row gap-8">
  
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg mb-6 lg:mb-0">
          <h2 className="text-3xl font-bold mb-6 text-center">Programar Luces</h2>

          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div 
              onClick={() => toggleLight(1, isLightOn1)} 
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn1 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 sm:w-40 sm:h-56 rounded-3xl justify-center`}>
              <div className={`w-24 h-36 sm:w-28 sm:h-40 ${isLightOn1 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div>
              <span className="text-white font-bold">{isLightOn1 ? 'Luz Patio ON' : 'Luz Patio OFF'}</span>
            </div>
  
            <div 
              onClick={() => toggleLight(2, isLightOn2)} 
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 ease-in-out ${isLightOn2 ? 'bg-yellow-500 shadow-2xl shadow-yellow-400' : 'bg-gray-400'} w-32 h-48 sm:w-40 sm:h-56 rounded-3xl justify-center`}>
              <div className={`w-24 h-36 sm:w-28 sm:h-40 ${isLightOn2 ? 'bg-yellow-500' : 'bg-gray-600'} rounded-full mb-2`}></div>
              <span className="text-white font-bold">{isLightOn2 ? 'Luz Oficina ON' : 'Luz Oficina OFF'}</span>
            </div>
          </div>
  
          <div className="flex flex-col gap-8">
            {/* Horarios de la luz 1 */}
            <div className="flex flex-col gap-4">
              <input
                type="time"
                value={scheduledTime1}
                onChange={(e) => setScheduledTime1(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-md"
              />
              <input
                type="time"
                value={scheduledTimeOff1}
                onChange={(e) => setScheduledTimeOff1(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={() => scheduleLights(1)}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isLight1ButtonEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                disabled={!isLight1ButtonEnabled}
              >
                Programar Luz Patio
              </button>
            </div>

            {/* Horarios de la luz 2 */}
            <div className="flex flex-col gap-4">
              <input
                type="time"
                value={scheduledTime2}
                onChange={(e) => setScheduledTime2(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-md"
              />
              <input
                type="time"
                value={scheduledTimeOff2}
                onChange={(e) => setScheduledTimeOff2(e.target.value)}
                className="border-2 border-gray-300 p-2 rounded-md"
              />
              <button
                onClick={() => scheduleLights(2)}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md ${isLight2ButtonEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                disabled={!isLight2ButtonEnabled}
              >
                Programar Luz Oficina
              </button>
            </div>
          </div>
        </div>

        {/* Mostrar las programaciones */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Programaciones</h2>
          
          <table className="table-auto w-full text-sm text-left">
            <thead>
              <tr>
                <th>Id</th>
                <th>Hora Encendido</th>
                <th>Hora Apagado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.id}</td>
                  <td>{schedule.hora_encendido}</td>
                  <td>{schedule.hora_apagado}</td>
                  <td>
                    <button
                      onClick={() => deleteSchedule(schedule.id)}
                      className="text-red-500 hover:text-red-700"
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

      {/* Componente Notifications */}
      <Notifications error={error} successMessage={successMessage} />
    </div>
  );
}

export default Luces;
