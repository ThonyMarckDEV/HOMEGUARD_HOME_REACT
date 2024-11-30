import { useState, useEffect } from 'react';

const Notifications = ({ error, successMessage }) => {
  const [showNotification, setShowNotification] = useState(false);

  // Mostrar notificación cuando haya un mensaje de error o éxito
  useEffect(() => {
    if (error || successMessage) {
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Desaparece después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        showNotification ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Notificación de error */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg mb-4 transform animate-slideInDown">
          {error}
        </div>
      )}

      {/* Notificación de éxito */}
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg mb-4 transform animate-slideInDown">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Notifications;
