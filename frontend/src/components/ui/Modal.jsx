import { useEffect } from 'react';
import { X } from 'lucide-react';

// Janela modal que uso nos formulários e confirmações.
// Fecha no X, com a tecla Esc ou clicando fora dela.
export default function Modal({ aberto, titulo, onFechar, children }) {
  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (e) => { if (e.key === 'Escape') onFechar(); };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-cabecalho">
          <h3 className="modal-titulo">{titulo}</h3>
          <button type="button" className="modal-fechar" aria-label="Fechar" onClick={onFechar}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-corpo">{children}</div>
      </div>
    </div>
  );
}
