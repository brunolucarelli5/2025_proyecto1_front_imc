import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ImcForm from './ImcForm';
import Historial from './Historial';
import RegisterForm from './Register'; 
import LoginForm from './Login';
import PrivateRoute from './PrivateRoutes'; // Importa el guardián de rutas

const App: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/register' || location.pathname === '/login';
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 p-4 bg-gray-100">
        <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route element={<PrivateRoute />}>
          <Route path="/calculadora" element={<ImcForm />} />
          <Route path="/historial" element={<Historial />} />
        </Route>
        
       <Route
          path="/"
          element={
            localStorage.getItem("accessToken")
              ? <Navigate to="/calculadora" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
      </main>
    </div>
  );
};

export default App;