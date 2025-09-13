import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800 p-4 flex gap-4 sticky top-0 z-50">
      <Link
        to="/"
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
    <div className="flex-grow flex justify-end gap-4">
        <Link
          to="/register"
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            location.pathname === "/register"
              ? "bg-white text-gray-800 font-semibold"
              : "text-white hover:bg-gray-700"
          }`}
        >
          <FaUserPlus />
          Registrarme
        </Link>
        <Link
          to="/login"
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            location.pathname === "/login"
              ? "bg-white text-gray-800 font-semibold"
              : "text-white hover:bg-gray-700"
          }`}
        >
          <FaSignInAlt />
          Iniciar sesión
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;
