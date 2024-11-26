import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import API_BASE_URL from '../js/urlHelper'; // Asegúrate de que la ruta sea correcta

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú en móvil

  // Función para manejar el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenir la acción por defecto del formulario
  
    // Preparar los datos para el login
    const data = {
      username: username, // Asegúrate de que estos estados existan en tu componente
      password: password,
    };
  
    try {
      // Enviar la solicitud POST al backend para hacer el login
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Enviar las credenciales al backend
      });
  
      // Verificar si la respuesta fue exitosa
      if (response.ok) {
        const data = await response.json();
  
        // Almacenar el token en localStorage
        const token = data.token;
        localStorage.setItem('jwt', token);
  
        console.log('Login exitoso, token almacenado:', token);
  
        // por ejemplo, redirigir a una ruta protegida:
        window.location.href = '/admin'; // Ajusta según tus rutas
  
      } else {
        // Si la respuesta no es exitosa, manejar el error
        const errorData = await response.json();
        console.log('Error en login:', errorData.error);
        alert(errorData.error || 'Error en el login');
      }
  
    } catch (error) {
      console.error('Error al intentar hacer login:', error);
      alert('Hubo un error, por favor intenta nuevamente');
    }
  };

 // Función para alternar el menú móvil
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
    <div className="bg-gray-800 font-sans text-gray-200 min-h-screen flex flex-col">
      
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

      {/* Login Section */}
      <section className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:px-24 py-12 lg:py-24 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 flex-grow">
        <div className="text-center lg:text-left lg:max-w-lg px-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">Inicia sesión para continuar</h1>
          <p className="text-lg mb-6">Accede a tu cuenta para usar las funciones del sistema.</p>
        </div>
        
        <div className="mt-8 lg:mt-0 lg:w-96 mx-auto relative px-4 fade-in">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full mx-auto">
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-300 text-lg mb-2">Usuario</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-300 text-lg mb-2">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className="w-full px-4 py-2 bg-gray-800 text-gray-200 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="flex justify-center mb-4">
                <button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  Iniciar sesión
                </button>
              </div>

              <div className="flex justify-center">
                <p className="text-gray-300">¿No tienes cuenta? <Link to="/registro" className="text-green-400 hover:text-green-300">Regístrate</Link></p>
              </div>
            </form>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="flex justify-center space-x-4 text-gray-200 p-4 bg-gray-900 mt-auto">
        <a href="https://www.facebook.com/homeguard" className="hover:text-green-300 transition-colors"><i className="fab fa-facebook-f"></i> Facebook</a>
        <a href="https://twitter.com/homeguard" className="hover:text-green-300 transition-colors"><i className="fab fa-twitter"></i> Twitter</a>
        <a href="https://www.instagram.com/homeguard" className="hover:text-green-300 transition-colors"><i className="fab fa-instagram"></i> Instagram</a>
      </footer>
    </div>
  );
}

export default Login;