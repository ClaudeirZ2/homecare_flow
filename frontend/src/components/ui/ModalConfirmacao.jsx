import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

// Modal genérico de confirmação. tipo="perigo" (exclusões) ou "neutro" (ex.: pagamentos).
export default function ModalConfirmacao({
  aberto, titulo = 'Confirmar exclusão', mensagem, textoConfirmar = 'Sim, excluir',
  tipo = 'perigo', carregando, onConfirmar, onCancelar,
}) {
  const perigo = tipo === 'perigo';
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar}>
      <div className="confirmacao">
        <span className={`confirmacao-icone ${perigo ? '' : 'neutro'}`}>
          {perigo ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
        </span>
        <p>{mensagem}</p>
      </div>
      <div className="form-acoes">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button variant={perigo ? 'danger' : 'primary'} onClick={onConfirmar} carregando={carregando}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}
