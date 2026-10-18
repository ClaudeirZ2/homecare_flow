import { CheckCircle2, AlertCircle, X } from 'lucide-react';

// Aviso que aparece no canto da tela (sucesso em verde, erro em vermelho)
export default function Toast({ tipo = 'sucesso', mensagem, onFechar }) {
  const Icone = tipo === 'erro' ? AlertCircle : CheckCircle2;
  return (
    <div className={`toast toast-${tipo}`} role="status">
      <Icone size={18} className="toast-icone" />
      <span className="toast-texto">{mensagem}</span>
      <button type="button" onClick={onFechar} aria-label="Fechar aviso"><X size={16} /></button>
    </div>
  );
}
