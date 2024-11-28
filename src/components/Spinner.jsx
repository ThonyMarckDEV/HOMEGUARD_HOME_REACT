import React from 'react';

function Spinner() {
  return (
    <div className="flex justify-center items-center w-full h-full absolute top-0 left-0 bg-gray-200 bg-opacity-50 z-50">
      <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
