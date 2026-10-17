// Campo de formulário reutilizável (input, select ou textarea)
export default function Input({
  label, name, value, onChange, type = 'text', options, required, rows,
  placeholder, min, max, step, disabled, ajuda, textoVazio = 'Selecione...', icone: Icone,
}) {
  const comuns = { name, value: value ?? '', onChange, required, disabled, className: 'campo-controle' };

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
    <label className="campo">
      <span className="campo-rotulo">
        {label}{required && <span className="obrigatorio" aria-hidden="true">*</span>}
      </span>
      {Icone ? <span className="campo-busca"><Icone size={16} />{campo}</span> : campo}
      {ajuda && <small className="campo-ajuda">{ajuda}</small>}
    </label>
  );
}
