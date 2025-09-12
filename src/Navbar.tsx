import React from "react";
import { Link, useLocation } from "react-router-dom";

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
    </nav>
  );
};

export default Navbar;
