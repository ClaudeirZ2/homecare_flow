import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { rotulo } from '../../utils/formatters';

// Iniciais do nome para o avatar (ex.: "Ana Souza" -> "AS")
const iniciais = (nome = '') => nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export default function Navbar({ onAlternarMenu }) {
  const { usuario, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-esquerda">
        <button type="button" className="menu-toggle" onClick={onAlternarMenu} aria-label="Abrir menu">
          <Menu size={20} />
        </button>
        <Logo />
      </div>
      <div className="navbar-direita">
        <div className="usuario-chip">
          <span className="avatar" aria-hidden="true">{iniciais(usuario?.nome)}</span>
          <div className="usuario-info">
            <strong>{usuario?.nome}</strong>
            <span>{rotulo(usuario?.tipo)}</span>
          </div>
        </div>
        <button type="button" className="btn-sair" onClick={logout} aria-label="Sair">
          <LogOut size={16} /> <span>Sair</span>
        </button>
      </div>
    </header>
  );
}
