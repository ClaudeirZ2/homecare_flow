import Modal from './Modal';
import Button from './Button';

// Modal genérico de confirmação (usado nas exclusões de todos os CRUDs)
export default function ModalConfirmacao({
  aberto, titulo = 'Confirmar exclusão', mensagem, textoConfirmar = 'Sim, excluir',
  carregando, onConfirmar, onCancelar,
}) {
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar}>
      <p style={{ marginBottom: 'var(--space-lg)' }}>{mensagem}</p>
      <div className="form-acoes">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirmar} carregando={carregando}>{textoConfirmar}</Button>
      </div>
    </Modal>
  );
}
