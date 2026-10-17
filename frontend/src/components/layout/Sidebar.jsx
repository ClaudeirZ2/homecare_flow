import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// "somenteGestao": item visível apenas para admin/gestor
export const ITENS_MENU = [
  { para: '/', rotulo: 'Visão Geral', icone: '🏠' },
  { para: '/pacientes', rotulo: 'Pacientes', icone: '👥' },
  { para: '/profissionais', rotulo: 'Cuidadores', icone: '🩺' },
  { para: '/escalas', rotulo: 'Escalas', icone: '📅' },
  { para: '/plantoes', rotulo: 'Plantões', icone: '⏱️' },
  { para: '/prontuarios', rotulo: 'Prontuários', icone: '📋' },
  { para: '/financeiro', rotulo: 'Relatórios', icone: '💰', somenteGestao: true },
];

export default function Sidebar({ aberta, onNavegar }) {
  const { ehGestao } = useAuth();
  const itens = ITENS_MENU.filter((item) => !item.somenteGestao || ehGestao);

  return (
    <nav className={`sidebar ${aberta ? 'sidebar-aberta' : ''}`}>
      {itens.map((item) => (
        <NavLink
          key={item.para}
          to={item.para}
          end={item.para === '/'}
          onClick={onNavegar}
          className={({ isActive }) => `sidebar-link ${isActive ? 'ativo' : ''}`}
        >
          <span aria-hidden="true">{item.icone}</span> {item.rotulo}
        </NavLink>
      ))}
    </nav>
  );
}
