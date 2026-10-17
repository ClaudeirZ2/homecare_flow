import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Check-in pelo código do QR Code fixado na residência do paciente.
// (Evolução: trocar o campo de texto por leitura pela câmera, ex.: biblioteca html5-qrcode.)
export default function ModalCheckinQr({ escala, salvando, onConfirmar, onFechar }) {
  const [codigo, setCodigo] = useState('');

  useEffect(() => { setCodigo(''); }, [escala]);

  function handleSubmit(e) {
    e.preventDefault();
    onConfirmar(codigo);
  }

  return (
    <Modal aberto={!!escala} titulo="Check-in por QR Code" onFechar={onFechar}>
      <form onSubmit={handleSubmit}>
        <p className="texto-suave" style={{ marginBottom: 'var(--space-md)' }}>
          Paciente: <strong>{escala?.paciente_nome}</strong><br />
          Digite o código impresso no QR Code da residência.
        </p>
        <Input label="Código do QR Code" name="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)}
          placeholder="QR-PAC-0001" required />
        <div className="form-acoes">
          <Button variant="outline" onClick={onFechar}>Cancelar</Button>
          <Button type="submit" carregando={salvando}>Confirmar check-in</Button>
        </div>
      </form>
    </Modal>
  );
}
