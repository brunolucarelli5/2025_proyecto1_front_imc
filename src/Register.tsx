import React, { useState } from 'react';
import { apiService } from './services/service';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 🔍 Validación en el front antes de llamar al back
    const passwordError = validatePasswordFront(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(formData);
      setSuccess('Registro exitoso. Serás redirigido a la página de login.');
      console.log('Registro exitoso:', response.data);

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Error en el registro:', err);
      setError(err.response?.data?.message ?? 'Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };


  const validatePasswordFront = (password: string): string | null => {
    const minLength = 8;
    if (password.length < minLength) return `La contraseña debe tener al menos ${minLength} caracteres.`;
    if (!/[A-Z]/.test(password)) return 'La contraseña debe contener al menos una letra mayúscula.';
    if (!/[a-z]/.test(password)) return 'La contraseña debe contener al menos una letra minúscula.';
    if (!/\d/.test(password)) return 'La contraseña debe contener al menos un número.';
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(password)) return 'La contraseña debe contener al menos un carácter especial.';
    return null;
  };


  return (
    <div className="flex justify-center items-center h-full">
      <div className="mt-16 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm lg:max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Crea tu cuenta</h2>
        <p className="text-center text-gray-600 mb-6">
            Guarda tus cálculos para llevar un registro de tu progreso.
        </p>
        <form onSubmit={handleSubmit}>
          {/* Inputs */}
          <div className="mb-4">
            <label htmlFor="register-email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-password" className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
            <input
              id="register-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-1">Nombre</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-1">Apellido</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              required
            />
          </div>

          {/* Mensajes */}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 font-medium">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 font-medium">{success}</div>}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading || !!success} // <--- deshabilitado durante carga o mientras se muestra éxito
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Registrando...' : success ? 'Redirigiendo...' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
