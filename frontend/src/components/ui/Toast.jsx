// Aviso flutuante de sucesso/erro (exibido pelo ToastProvider)
export default function Toast({ tipo = 'sucesso', mensagem, onFechar }) {
  return (
    <div className={`toast toast-${tipo}`} role="status">
      <span>{tipo === 'erro' ? '⚠️' : '✅'} {mensagem}</span>
      <button type="button" onClick={onFechar} aria-label="Fechar aviso">×</button>
    </div>
  );
}
