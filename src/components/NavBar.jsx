import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-gray-900 text-white shadow-lg">
      <a href="#" className="text-3xl font-bold text-green-400">HomeGuard</a>
      {/* Menú en pantallas grandes */}
      <ul className="hidden lg:flex space-x-8 font-medium">
        <li><Link to="/" className="hover:text-green-300 transition-colors">Inicio</Link></li>
        <li><Link to="/nosotros" className="hover:text-green-300 transition-colors">Nosotros</Link></li>
        <li><Link to="/servicios" className="hover:text-green-300 transition-colors">Servicios</Link></li>
        <li><Link to="/contacto" className="hover:text-green-300 transition-colors">Contacto</Link></li>
      </ul>
      {/* Botón de menú para dispositivos móviles */}
      <button 
        className="lg:hidden text-white font-bold"
        onClick={toggleMenu}
      >
        ☰
      </button>
      {/* Menú desplegable para móviles */}
      <ul className={`lg:hidden absolute top-16 left-0 w-full bg-gray-900 text-center py-4 ${menuOpen ? 'block' : 'hidden'}`}>
        <li><Link to="/" className="block py-2 text-lg hover:text-green-300 transition-colors">Inicio</Link></li>
        <li><Link to="/nosotros" className="block py-2 text-lg hover:text-green-300 transition-colors">Nosotros</Link></li>
        <li><Link to="/servicios" className="block py-2 text-lg hover:text-green-300 transition-colors">Servicios</Link></li>
        <li><Link to="/contacto" className="block py-2 text-lg hover:text-green-300 transition-colors">Contacto</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
