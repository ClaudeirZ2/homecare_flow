import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Logo from './Logo';
import { rotulo } from '../../utils/formatters';

export default function Navbar({ onAlternarMenu }) {
  const { usuario, logout } = useAuth();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" className="menu-toggle" onClick={onAlternarMenu} aria-label="Abrir menu">☰</button>
        <Logo />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="navbar-usuario">
          {usuario?.nome} <small>· {rotulo(usuario?.tipo)}</small>
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
      </div>
    </header>
  );
}
