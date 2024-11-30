import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/sidebarAdmin";
import API_BASE_URL from "../../js/urlHelper";
import { verificarYRenovarToken } from "../../js/authToken";
import Modal from "../../components/Modal";

function Reportes() {
  const [groupedImagenes, setGroupedImagenes] = useState([]); // Imágenes agrupadas por fecha
  const [modalOpen, setModalOpen] = useState(false); // Modal abierto/cerrado
  const [selectedImage, setSelectedImage] = useState(null); // Imagen seleccionada
  const [selectedDate, setSelectedDate] = useState(null); // Fecha seleccionada para abrir/cerrar

  useEffect(() => {
    verificarYRenovarToken();

    const fetchImagenes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reportes-imagenes`);
        const data = await response.json();

        const grouped = data.reduce((acc, imagen) => {
          const date = new Date(imagen.fecha).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push({
            ...imagen,
            ruta_imagen: `${API_BASE_URL}${imagen.ruta_imagen}`,
          });
          return acc;
        }, {});

        const groupedImagenesData = Object.keys(grouped)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date) => ({
            date,
            images: grouped[date],
          }));

        setGroupedImagenes(groupedImagenesData);
      } catch (error) {
        console.error("Error al cargar las imágenes:", error);
      }
    };

    fetchImagenes();
  }, []);

  const toggleModule = (date) => {
    setSelectedDate(selectedDate === date ? null : date); // Abrir o cerrar
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div className="flex h-screen bg-blue-100">
      <SidebarAdmin />

      <div className="flex-1 p-6 sm:p-6 pt-20 sm:pt-28 overflow-auto">
        <h2 className="text-3xl font-bold mb-4 text-center sm:text-left">
          Reportes de Imágenes
        </h2>

        <div className="max-w-6xl mx-auto">
          {groupedImagenes.map((group) => (
            <div key={group.date} className="mb-8">
              <div
                className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg flex items-center gap-3"
                onClick={() => toggleModule(group.date)}
              >
                <div className="bg-blue-500 text-white p-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h18M3 12h18m-6 5h6"
                    />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {group.date}
                </span>
              </div>

              {selectedDate === group.date && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
                  {group.images.map((imagen) => (
                    <div
                      key={imagen.idImagen}
                      className="cursor-pointer bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg flex flex-col items-center"
                      onClick={() => openModal(imagen.ruta_imagen)}
                    >
                      <img
                        src={imagen.ruta_imagen}
                        alt="Imagen de reporte"
                        className="w-48 h-40 object-cover rounded-lg"
                      />
                      <p className="mt-2 text-gray-700 text-center">
                        {new Date(imagen.fecha).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {modalOpen && (
          <div
            onClick={handleModalClick}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white w-4/5 sm:w-2/3 lg:w-1/3 p-4 rounded-lg shadow-lg">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <img
                src={selectedImage}
                alt="Imagen seleccionada"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;
