// Modal genérico (usado para edição e confirmação)
export default function Modal({ aberto, titulo, onFechar, children }) {
  if (!aberto) return null;

  return (
    <div
      onClick={onFechar}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(28,46,62,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        style={{
          background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)', width: '100%', maxWidth: 520,
          maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <h3 style={{ color: 'var(--color-primary-dark)' }}>{titulo}</h3>
          <button type="button" aria-label="Fechar" onClick={onFechar} style={{ background: 'none', fontSize: '1.4rem', color: 'var(--color-text-muted)' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
