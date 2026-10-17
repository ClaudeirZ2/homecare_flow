// Botão reutilizável. Variantes: primary, secondary, outline, danger, ghost, ghost-danger.
// "icone" recebe um componente do lucide-react (ex.: icone={Plus}).
export default function Button({
  children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, carregando,
  icone: Icone, bloco, titulo,
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    bloco && 'btn-bloco',
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || carregando}
      className={classes}
      title={titulo}
      aria-label={!children ? titulo : undefined}
    >
      {carregando ? <span className="spinner" aria-hidden="true" /> : Icone && <Icone size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
      {children}
    </button>
  );
}
