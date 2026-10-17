// Botão estilizado e reutilizável com variantes (primary, secondary, outline, danger, ghost)
export default function Button({
  children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, carregando, style,
}) {
  const estilos = {
    primary: { background: 'var(--color-accent-gradient)', color: '#fff' },
    secondary: { background: 'var(--color-primary-dark)', color: '#fff' },
    outline: { background: 'transparent', color: 'var(--color-primary-dark)', border: '1px solid var(--color-border)' },
    danger: { background: 'var(--color-danger)', color: '#fff' },
    ghost: { background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' },
  };
  const tamanhos = {
    sm: { padding: '6px 12px' },
    md: { padding: '10px 18px' },
  };
  const bloqueado = disabled || carregando;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={bloqueado}
      style={{
        ...estilos[variant],
        ...tamanhos[size],
        borderRadius: 'var(--radius-sm)',
        fontWeight: 600,
        fontSize: 'var(--font-size-sm)',
        opacity: bloqueado ? 0.6 : 1,
        cursor: bloqueado ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {carregando ? 'Aguarde...' : children}
    </button>
  );
}
