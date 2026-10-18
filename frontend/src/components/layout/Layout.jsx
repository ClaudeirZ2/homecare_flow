import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Esqueleto de todas as páginas depois do login: barra no topo, menu lateral e rodapé.
// No celular o menu lateral vira uma gaveta que abre pelo botão ☰.
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
