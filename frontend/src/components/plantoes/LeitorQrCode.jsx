import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CameraOff } from 'lucide-react';

// Liga a câmera traseira do celular e lê o QR Code.
// Quando consegue ler, chama onLido(codigo) e desliga a câmera.
// Obs.: o navegador só libera a câmera em https (Vercel) ou no localhost.
export default function LeitorQrCode({ onLido }) {
  const [erro, setErro] = useState('');

  // Guardo o onLido numa ref: assim a câmera liga uma vez só,
  // mesmo que a tela de cima renderize de novo e mande uma função "nova".
  const onLidoRef = useRef(onLido);
  onLidoRef.current = onLido;

  useEffect(() => {
    const leitor = new Html5Qrcode('leitor-qr', { verbose: false });
    let lido = false;
    let desmontado = false;

    // start() é assíncrono: guardo a promessa para só desligar depois que a câmera ligou de fato
    const inicio = leitor
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (texto) => {
          if (lido) return;
          lido = true;
          onLidoRef.current(texto);
        },
        () => {} // erros de "não achei QR neste quadro" acontecem o tempo todo, então ignoro
      )
      .catch(() => {
        if (!desmontado) setErro('Não foi possível abrir a câmera. Libere a permissão no navegador ou digite o código.');
      });

    // Desliga a câmera quando o componente sai da tela
    return () => {
      desmontado = true;
      inicio.then(() => (leitor.isScanning ? leitor.stop() : null)).then(() => leitor.clear()).catch(() => {});
    };
  }, []);

  if (erro) {
    return (
      <div className="vazio" style={{ padding: '24px 8px' }}>
        <CameraOff size={28} />
        <span>{erro}</span>
      </div>
    );
  }

  return <div id="leitor-qr" className="leitor-qr" />;
}
