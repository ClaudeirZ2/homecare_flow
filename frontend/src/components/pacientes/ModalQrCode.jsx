import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import logoIcone from '../../assets/logo-icone.png';

// Gera a imagem do QR Code do paciente para imprimir e colar na casa dele.
// O profissional lê esse código com o celular na hora do check-in.
export default function ModalQrCode({ paciente, onFechar }) {
  const [imagem, setImagem] = useState('');

  useEffect(() => {
    if (!paciente) return;
    QRCode.toDataURL(paciente.qr_code_id, { width: 320, margin: 1, color: { dark: '#1c2e3e' } })
      .then(setImagem);
  }, [paciente]);

  return (
    <Modal aberto={!!paciente} titulo="QR Code da residência" onFechar={onFechar}>
      {/* "area-impressao": só esta parte sai na impressão (ver global.css) */}
      <div className="area-impressao cartao-qr">
        <div className="marca" style={{ justifyContent: 'center' }}>
          <img src={logoIcone} alt="" width={28} height={28} />
          <strong style={{ color: 'var(--color-primary-dark)' }}>Home Care Flow</strong>
        </div>
        <p className="texto-suave">Check-in do profissional</p>
        {imagem && <img src={imagem} alt={`QR Code ${paciente?.qr_code_id}`} className="cartao-qr-imagem" />}
        <strong className="cartao-qr-nome">{paciente?.nome}</strong>
        <span className="texto-suave">{paciente?.endereco}</span>
        <code>{paciente?.qr_code_id}</code>
        <p className="cartao-qr-dica">Fixe este cartão em local visível na residência.</p>
      </div>

      <div className="form-acoes nao-imprimir">
        <Button variant="outline" onClick={onFechar}>Fechar</Button>
        <Button icone={Printer} onClick={() => window.print()} disabled={!imagem}>Imprimir cartão</Button>
      </div>
    </Modal>
  );
}
