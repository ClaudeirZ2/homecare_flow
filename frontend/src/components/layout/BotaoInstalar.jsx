import { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';

// Botão "Instalar app" (PWA). O navegador avisa quando o site pode ser instalado
// (evento beforeinstallprompt, no Chrome/Android/Edge). Guardo esse aviso e mostro o botão.
// No iPhone não existe esse evento: lá a instalação é pelo Safari → Compartilhar → "Adicionar à Tela de Início".
export default function BotaoInstalar() {
  const [pedido, setPedido] = useState(null);
  const [instalado, setInstalado] = useState(
    () => window.matchMedia?.('(display-mode: standalone)').matches || false
  );

  useEffect(() => {
    const aoPoderInstalar = (e) => { e.preventDefault(); setPedido(e); };
    const aoInstalar = () => { setInstalado(true); setPedido(null); };
    window.addEventListener('beforeinstallprompt', aoPoderInstalar);
    window.addEventListener('appinstalled', aoInstalar);
    return () => {
      window.removeEventListener('beforeinstallprompt', aoPoderInstalar);
      window.removeEventListener('appinstalled', aoInstalar);
    };
  }, []);

  if (instalado) {
    return <p className="instalar-ok"><Smartphone size={14} /> Usando como aplicativo</p>;
  }
  if (!pedido) return null;

  async function instalar() {
    pedido.prompt();
    await pedido.userChoice;
    setPedido(null);
  }

  return (
    <button type="button" className="botao-instalar" onClick={instalar}>
      <Download size={16} />
      <span>
        <strong>Instalar app</strong>
        <small>Use direto da tela inicial</small>
      </span>
    </button>
  );
}
