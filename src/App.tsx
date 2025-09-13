import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ImcForm from './ImcForm';
import Historial from './Historial';
import RegisterForm from './Register';
import LoginForm from './Login';

const App: React.FC = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/register' || location.pathname === '/login';
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 p-4 bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/calculadora" replace />} />
          <Route path="/calculadora" element={<ImcForm />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<div className="text-center text-2xl">404 - Página no encontrada</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;