import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Profissionais from './pages/Profissionais';
import Escalas from './pages/Escalas';
import Plantoes from './pages/Plantoes';
import Prontuarios from './pages/Prontuarios';
import Financeiro from './pages/Financeiro';
import MeusGanhos from './pages/MeusGanhos';
import MeuPerfil from './pages/MeuPerfil';
import NaoEncontrada from './pages/NaoEncontrada';

// Componente que protege as páginas: sem login volta para /login.
// somenteGestao / somenteTecnico: se o perfil não puder ver a página, volta para o início.
function RotaPrivada({ children, somenteGestao, somenteTecnico }) {
  const { usuario, ehGestao, ehTecnico } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  if (somenteGestao && !ehGestao) return <Navigate to="/" replace />;
  if (somenteTecnico && !ehTecnico) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
      <Route path="/pacientes" element={<RotaPrivada><Pacientes /></RotaPrivada>} />
      <Route path="/profissionais" element={<RotaPrivada somenteGestao><Profissionais /></RotaPrivada>} />
      <Route path="/escalas" element={<RotaPrivada><Escalas /></RotaPrivada>} />
      <Route path="/plantoes" element={<RotaPrivada><Plantoes /></RotaPrivada>} />
      <Route path="/prontuarios" element={<RotaPrivada><Prontuarios /></RotaPrivada>} />
      <Route path="/financeiro" element={<RotaPrivada somenteGestao><Financeiro /></RotaPrivada>} />
      <Route path="/meus-ganhos" element={<RotaPrivada somenteTecnico><MeusGanhos /></RotaPrivada>} />
      <Route path="/perfil" element={<RotaPrivada><MeuPerfil /></RotaPrivada>} />
      <Route path="*" element={<RotaPrivada><NaoEncontrada /></RotaPrivada>} />
    </Routes>
  );
}
