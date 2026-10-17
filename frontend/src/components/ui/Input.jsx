// Campo de formulário reutilizável (input, select ou textarea)
export default function Input({
  label, name, value, onChange, type = 'text', options, required, rows,
  placeholder, min, max, step, disabled, ajuda, textoVazio = 'Selecione...',
}) {
  const base = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: 'var(--font-size-base)',
    background: disabled ? 'var(--color-bg)' : 'var(--color-surface)',
  };
  const comuns = { name, value: value ?? '', onChange, required, disabled, style: base };

  let campo;
  if (options) {
    campo = (
      <select {...comuns}>
        <option value="">{textoVazio}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (type === 'textarea') {
    campo = <textarea {...comuns} rows={rows || 3} placeholder={placeholder} />;
  } else {
    campo = <input {...comuns} type={type} placeholder={placeholder} min={min} max={max} step={step} />;
  }

  return (
    <label style={{ display: 'block', marginBottom: 'var(--space-md)' }}>
      <span style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 4 }}>
        {label}{required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
      </span>
      {campo}
      {ajuda && <small style={{ color: 'var(--color-text-muted)' }}>{ajuda}</small>}
    </label>
  );
}
