import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import ImcForm from './ImcForm';
import Historial from './Historial';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/calculadora" replace />} />
          <Route path="/calculadora" element={<ImcForm />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="*" element={<div className="text-center text-2xl">404 - Página no encontrada</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;