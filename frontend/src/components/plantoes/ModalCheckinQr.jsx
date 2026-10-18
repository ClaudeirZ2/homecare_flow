import { useCallback, useEffect, useState } from 'react';
import { Camera, Keyboard } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LeitorQrCode from './LeitorQrCode';

// Check-in pelo QR Code que fica na casa do paciente.
// Duas formas: ler com a câmera do celular ou digitar o código impresso no cartão.
export default function ModalCheckinQr({ escala, salvando, onConfirmar, onFechar }) {
  const [codigo, setCodigo] = useState('');
  const [modo, setModo] = useState('digitar');

  // Toda vez que abre para uma escala nova, começa pela câmera se o aparelho tiver uma
  useEffect(() => {
    setCodigo('');
    setModo(navigator.mediaDevices?.getUserMedia ? 'camera' : 'digitar');
  }, [escala]);

  // Leu pela câmera: já confirma o check-in direto
  const aoLer = useCallback((texto) => {
    setCodigo(texto);
    setModo('digitar');
    onConfirmar(texto);
  }, [onConfirmar]);

  function handleSubmit(e) {
    e.preventDefault();
    onConfirmar(codigo);
  }

  return (
    <Modal aberto={!!escala} titulo="Check-in por QR Code" onFechar={onFechar}>
      <p className="texto-suave" style={{ marginBottom: 12 }}>
        Paciente: <strong>{escala?.paciente_nome}</strong>
      </p>

      <div className="abas" role="tablist">
        <button type="button" role="tab" aria-selected={modo === 'camera'}
          className={`aba ${modo === 'camera' ? 'ativa' : ''}`} onClick={() => setModo('camera')}>
          <Camera size={15} /> Ler com a câmera
        </button>
        <button type="button" role="tab" aria-selected={modo === 'digitar'}
          className={`aba ${modo === 'digitar' ? 'ativa' : ''}`} onClick={() => setModo('digitar')}>
          <Keyboard size={15} /> Digitar código
        </button>
      </div>

      {modo === 'camera' ? (
        <>
          <LeitorQrCode onLido={aoLer} />
          <p className="campo-ajuda" style={{ textAlign: 'center' }}>Aponte a câmera para o cartão fixado na residência.</p>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input label="Código do QR Code" name="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)}
            placeholder="QR-PAC-0001" required ajuda="O código está impresso logo abaixo do QR Code." />
          <div className="form-acoes">
            <Button variant="outline" onClick={onFechar}>Cancelar</Button>
            <Button type="submit" carregando={salvando}>Confirmar check-in</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
