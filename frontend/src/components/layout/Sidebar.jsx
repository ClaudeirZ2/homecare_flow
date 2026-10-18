import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserRound, CalendarDays, Clock, ClipboardList, Wallet, PiggyBank, UserCog,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BotaoInstalar from './BotaoInstalar';

// Itens do menu separados por seção.
// A seção com somenteGestao (Relatórios) não aparece para o técnico.
const SECOES = [
  {
    titulo: 'Geral',
    itens: [{ para: '/', rotulo: 'Visão Geral', icone: LayoutDashboard }],
  },
  {
    titulo: 'Cadastros',
    itens: [
      { para: '/pacientes', rotulo: 'Pacientes', icone: Users },
      { para: '/profissionais', rotulo: 'Cuidadores', icone: UserRound },
    ],
  },
  {
    titulo: 'Operação',
    itens: [
      { para: '/escalas', rotulo: 'Escalas', icone: CalendarDays },
      { para: '/plantoes', rotulo: 'Plantões', icone: Clock },
      { para: '/prontuarios', rotulo: 'Prontuários', icone: ClipboardList },
    ],
  },
  {
    titulo: 'Gestão',
    somenteGestao: true,
    itens: [{ para: '/financeiro', rotulo: 'Relatórios', icone: Wallet }],
  },
  {
    titulo: 'Meu trabalho',
    somenteTecnico: true,
    itens: [{ para: '/meus-ganhos', rotulo: 'Meus ganhos', icone: PiggyBank }],
  },
  {
    titulo: 'Conta',
    itens: [{ para: '/perfil', rotulo: 'Meu perfil', icone: UserCog }],
  },
];

export default function Sidebar({ aberta, onNavegar }) {
  const { ehGestao } = useAuth();

  return (
    <nav className={`sidebar ${aberta ? 'sidebar-aberta' : ''}`} aria-label="Menu principal">
      {SECOES.filter((s) => (!s.somenteGestao || ehGestao) && (!s.somenteTecnico || !ehGestao)).map((secao) => (
        <div key={secao.titulo}>
          <p className="sidebar-secao">{secao.titulo}</p>
          {secao.itens.map(({ para, rotulo, icone: Icone }) => (
            // Para o técnico, a página inicial se chama "Meu dia"
            <NavLink
              key={para}
              to={para}
              end={para === '/'}
              onClick={onNavegar}
              className={({ isActive }) => `sidebar-link ${isActive ? 'ativo' : ''}`}
            >
              <Icone size={18} strokeWidth={1.9} /> {para === '/' && !ehGestao ? 'Meu dia' : rotulo}
            </NavLink>
          ))}
        </div>
      ))}
      <BotaoInstalar />
    </nav>
  );
}
