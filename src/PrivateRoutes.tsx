import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  // Verifica si existe un token de autenticación en el localStorage
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  if (isAuthenticated) {
    // Si el usuario está autenticado, permite el acceso a la ruta anidada
    return <Outlet />;
  } else {
    // Si no está autenticado, lo redirige al login
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;