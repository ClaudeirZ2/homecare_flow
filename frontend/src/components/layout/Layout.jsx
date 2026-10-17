import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Estrutura padrão das páginas autenticadas (no celular, o menu lateral vira gaveta)
export default function Layout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onAlternarMenu={() => setMenuAberto(!menuAberto)} />
      <div className="app-layout">
        <Sidebar aberta={menuAberto} onNavegar={() => setMenuAberto(false)} />
        <div className="app-content">
          <main className="page-container">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
