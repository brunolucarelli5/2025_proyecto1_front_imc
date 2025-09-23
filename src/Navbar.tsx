// Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserPlus, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { apiService } from "./services/service";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sincroniza el estado de autenticación con el token
    const token = localStorage.getItem('accessToken'); // CLAVE CORREGIDA
    setIsAuthenticated(!!token);
  }, [location.pathname]); // El pathname como dependencia está bien para este caso

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 flex gap-4 sticky top-0 z-50">
      <Link
        to="/calculadora" // Cambia la ruta a calculadora
        className={`px-4 py-2 rounded ${
          location.pathname === "/calculadora"
            ? "bg-white text-gray-800 font-semibold"
            : "text-white hover:bg-gray-700"
        }`}
      >
        Calculadora
      </Link>

      <Link
        to="/historial"
        className={`px-4 py-2 rounded ${
          location.pathname === "/historial"
            ? "bg-white text-gray-800 font-semibold"
            : "text-white hover:bg-gray-700"
        }`}
      >
        Historial
      </Link>

      <Link
        to="/dashboard"
        className={`px-4 py-2 rounded ${
          location.pathname === "/dashboard"
            ? "bg-white text-gray-800 font-semibold"
            : "text-white hover:bg-gray-700"
        }`}
      >
        Estadísticas
      </Link>
      
      <div className="flex-grow flex justify-end gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/register" className={`px-4 py-2 rounded flex items-center gap-2 ${
              location.pathname === "/register" ? "bg-white text-gray-800 font-semibold" : "text-white hover:bg-gray-700"
            }`}>
              <FaUserPlus /> Registrar
            </Link>
            <Link to="/login" className={`px-4 py-2 rounded flex items-center gap-2 ${
              location.pathname === "/login" ? "bg-white text-gray-800 font-semibold" : "text-white hover:bg-gray-700"
            }`}>
              <FaSignInAlt /> Login
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="px-4 py-2 rounded flex items-center gap-2 text-white hover:bg-gray-700">
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;