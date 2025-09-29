import React, { useState } from "react";
import { apiService } from "./services/service";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null); // Estado del error de email

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlurEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(formData.email) ? null : "Formato de email inválido");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) return; // ⚠️ evita enviar si el email no es válido

    setError(null);

    try {
      const response = await apiService.login(formData);
      console.log("Inicio de sesión exitoso:", response.data);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      navigate("/calculadora");
    } catch (err: any) {
      console.error("Error en el login:", err);
      setError(err.response?.data?.message || "Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="mt-16 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm lg:max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Inicia sesión
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlurEmail} // 👈 validar al salir del campo
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
            {emailError && (
              <p className="text-red-600 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            Iniciar Sesión
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
