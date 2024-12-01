import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

// Importar las imágenes
import img1 from '../img/1.jpg';
import img2 from '../img/2.jpg';
import img3 from '../img/3.jpg';
import img4 from '../img/4.jpg';
import img5 from '../img/5.jpg';
import img6 from '../img/6.jpg';

function Home() {
  const images = [img1, img2, img3, img4, img5, img6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú en móvil
  const navigate = useNavigate(); // Hook para redirigir al usuario
  
    // Función para verificar el token en localStorage y redirigir
    const checkAuth = () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        // Decodificar el token JWT para obtener el rol y el estado del usuario
        const decodedToken = parseJwt(token);
        if (decodedToken) {
          const role = decodedToken.rol;
          if (role === 'admin') {
            // Redirigir al panel de admin si el rol es 'admin'
            navigate('/admin');
          } else if(role === 'familiar') {
             // Redirigir al panel de admin si el rol es 'admin'
             navigate('/familiar/camara');
          }else{
              // Redirigir al home si el rol no es nongun rol
             navigate('/');
          }
        }
      }
    };
  
    useEffect(() => {
      checkAuth(); // Verificar autenticación cuando el componente se monta
    }, []);

      // Función para parsear el token JWT
      const parseJwt = (token) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
          );
          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error("Error al decodificar el token JWT:", error);
          return null;
        }
      };

  // Función para mover el slider hacia la izquierda
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Función para mover el slider hacia la derecha
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Función para alternar el menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-gray-800 font-sans text-gray-200">
      
      {/* Navbar */}
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
          onClick={toggleMenu} // Alternar visibilidad del menú
        >
          ☰
        </button>
      </nav>

      {/* Menú desplegable para móviles */}
      <ul className={`lg:hidden absolute top-16 left-0 w-full bg-gray-900 text-center py-4 ${menuOpen ? 'block' : 'hidden'}`}>
        <li><Link to="/" className="block py-2 text-lg hover:text-green-300 transition-colors">Inicio</Link></li>
        <li><Link to="/nosotros" className="block py-2 text-lg hover:text-green-300 transition-colors">Nosotros</Link></li>
        <li><Link to="/servicios" className="block py-2 text-lg hover:text-green-300 transition-colors">Servicios</Link></li>
        <li><Link to="/contacto" className="block py-2 text-lg hover:text-green-300 transition-colors">Contacto</Link></li>
      </ul>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:px-24 py-12 lg:py-24 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200">
        <div className="text-center lg:text-left lg:max-w-lg px-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">Protege tu hogar con tecnología avanzada</h1>
          <p className="text-lg mb-6">Sistema de seguridad domótico con monitoreo en tiempo real y control desde cualquier lugar.</p>
          <div className="flex justify-center lg:justify-start space-x-4 mb-4">
            <Link to="/login" className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition-colors">Comenzar</Link>
          </div>
          <p className="font-medium">#HomeGuard</p>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:max-w-lg relative px-4 fade-in">
          <img src="../img/HOMEGUARDLOGO.jfif" alt="HomeGuard Logo" className="rounded-lg shadow-lg w-full lg:w-auto"/>
          <div className="absolute top-12 right-10 font-semibold text-2xl text-gray-300">Tecnología al servicio de tu hogar</div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="bg-gray-800 py-20 flex justify-center items-center">
        <div className="relative w-full max-w-4xl overflow-hidden">
          {/* Botón para ir a la izquierda */}
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 font-bold text-xl py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition-all z-10"
            onClick={prevImage}
          >
            ‹
          </button>
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {images.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0 flex justify-center">
                <img 
                  src={image} 
                  alt={`Imagen del sistema ${index + 1}`} 
                  className="w-full sm:w-[400px] md:w-[600px] h-auto sm:h-[250px] md:h-[400px] object-contain rounded-lg shadow-lg" 
                />
              </div>
            ))}
          </div>
          {/* Botón para ir a la derecha */}
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 font-bold text-xl py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition-all z-10"
            onClick={nextImage}
          >
            ›
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-center space-x-4 text-gray-200 p-4 bg-gray-900">
        <a href="https://www.facebook.com/homeguard" className="hover:text-green-300 transition-colors"><i className="fab fa-facebook-f"></i> Facebook</a>
        <a href="https://twitter.com/homeguard" className="hover:text-green-300 transition-colors"><i className="fab fa-twitter"></i> Twitter</a>
        <a href="https://www.instagram.com/homeguard" className="hover:text-green-300 transition-colors"><i className="fab fa-instagram"></i> Instagram</a>
      </footer>
    </div>
  );
}

export default Home;
