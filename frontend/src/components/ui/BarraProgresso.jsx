// Barra horizontal com rótulo e valor (estilo do mockup do dashboard)
export default function BarraProgresso({ rotulo, valor, total, cor = 'var(--color-accent)' }) {
  const pct = total ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="barra">
      <div className="barra-topo">
        <span>{rotulo}</span>
        <strong className="numero">{valor} <span className="texto-suave">· {pct}%</span></strong>
      </div>
      <div className="barra-trilho">
        <div className="barra-preenchida" style={{ width: `${pct}%`, background: cor }} />
      </div>
    </div>
  );
}
