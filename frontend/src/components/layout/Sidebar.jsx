import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserRound, CalendarDays, Clock, ClipboardList, Wallet, PiggyBank, UserCog,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BotaoInstalar from './BotaoInstalar';

// Itens do menu separados por seção.
// somenteGestao / somenteTecnico (na seção ou no item) escondem o que o perfil não usa.
// rotuloTecnico: nome diferente do item quando quem está logado é técnico.
const SECOES = [
  {
    titulo: 'Geral',
    itens: [{ para: '/', rotulo: 'Visão Geral', rotuloTecnico: 'Meu dia', icone: LayoutDashboard }],
  },
  {
    titulo: 'Cadastros',
    tituloTecnico: 'Atendimento',
    itens: [
      { para: '/pacientes', rotulo: 'Pacientes', rotuloTecnico: 'Meus pacientes', icone: Users },
      { para: '/profissionais', rotulo: 'Cuidadores', icone: UserRound, somenteGestao: true },
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
  const podeVer = (x) => (!x.somenteGestao || ehGestao) && (!x.somenteTecnico || !ehGestao);

  return (
    <nav className={`sidebar ${aberta ? 'sidebar-aberta' : ''}`} aria-label="Menu principal">
      {SECOES.filter(podeVer).map((secao) => (
        <div key={secao.titulo}>
          <p className="sidebar-secao">{!ehGestao && secao.tituloTecnico ? secao.tituloTecnico : secao.titulo}</p>
          {secao.itens.filter(podeVer).map(({ para, rotulo, rotuloTecnico, icone: Icone }) => (
            <NavLink
              key={para}
              to={para}
              end={para === '/'}
              onClick={onNavegar}
              className={({ isActive }) => `sidebar-link ${isActive ? 'ativo' : ''}`}
            >
              <Icone size={18} strokeWidth={1.9} /> {!ehGestao && rotuloTecnico ? rotuloTecnico : rotulo}
            </NavLink>
          ))}
        </div>
      ))}
      <BotaoInstalar />
    </nav>
  );
}
