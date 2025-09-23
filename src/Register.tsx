import React, { useState, useEffect } from 'react';
import { apiService } from './services/service';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false); // 👈 Nuevo estado

  useEffect(() => {
    if (passwordTouched) {
      setPasswordErrors(validatePasswordFront(formData.password));
    }
  }, [formData.password, passwordTouched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'password') setPasswordTouched(true); // marca que el usuario empezó a escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordErrors.length > 0) {
      setError('Corrige los errores de la contraseña antes de continuar.');
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

  const validatePasswordFront = (password: string): string[] => {
    const errors: string[] = [];
    const minLength = 8;

    if (password.length < minLength) errors.push(`Debe tener al menos ${minLength} caracteres.`);
    if (!/[A-Z]/.test(password)) errors.push('Debe contener al menos una letra mayúscula.');
    if (!/[a-z]/.test(password)) errors.push('Debe contener al menos una letra minúscula.');
    if (!/\d/.test(password)) errors.push('Debe contener al menos un número.');
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(password)) errors.push('Debe contener al menos un carácter especial.');

    return errors;
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="mt-16 bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm lg:max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Crea tu cuenta</h2>
        <p className="text-center text-gray-600 mb-6">
          Guarda tus cálculos para llevar un registro de tu progreso.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="register-password" className="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Mostrar errores solo si el usuario empezó a escribir */}
            {passwordTouched && passwordErrors.length > 0 && (
              <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                {passwordErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Nombre */}
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

          {/* Apellido */}
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

          {/* Mensajes generales */}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 font-medium">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4 font-medium">{success}</div>}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
          >
            {loading ? 'Registrando...' : success ? 'Redirigiendo...' : 'Registrarme'}
          </button>
          {" "}
          <p className="mt-4 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Inicia sesión
            </Link>
            {" "}
          </p>
          {" "}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
