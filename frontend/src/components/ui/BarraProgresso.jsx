// Barra horizontal com rótulo e valor (estilo do mockup do dashboard)
export default function BarraProgresso({ rotulo, valor, total, cor = 'var(--color-accent)' }) {
  const pct = total ? Math.round((valor / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: 4 }}>
        <span>{rotulo}</span>
        <strong>{valor}</strong>
      </div>
      <div style={{ height: 8, background: 'var(--color-bg)', borderRadius: 999 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: cor, borderRadius: 999, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}
