import React from 'react';

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl max-h-full overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-gray-600 p-2 rounded-full"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
