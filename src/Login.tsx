import React, { useState } from "react";
import { apiService } from "./services/service";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await apiService.login(formData);
      console.log("Inicio de sesión exitoso:", response.data);

      // Corregido: Guarda los tokens usando los nombres correctos de las propiedades
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      navigate("/calculadora");
    } catch (err: any) {
      console.error("Error en el login:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Credenciales incorrectas. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
           {" "}
      <div className="mt-16 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm lg:max-w-md">
               {" "}
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Inicia sesión
        </h2>
               {" "}
        <form onSubmit={handleSubmit}>
                   {" "}
          <div className="mb-4">
                       {" "}
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
                       {" "}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
                     {" "}
          </div>
                   {" "}
          <div className="mb-6">
                       {" "}
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
                       {" "}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
                     {" "}
          </div>
                   {" "}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 font-medium">
              {error}
            </div>
          )}
                   {" "}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
                        Iniciar Sesión          {" "}
          </button>
                   {" "}
          <p className="mt-4 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Regístrate
            </Link>
                     {" "}
          </p>
                 {" "}
        </form>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default LoginForm;
