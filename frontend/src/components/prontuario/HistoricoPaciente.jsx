import { formatarDataHora } from '../../utils/formatters';

// Linha do tempo com os registros do paciente (mais recente primeiro)
export default function HistoricoPaciente({ registros }) {
  if (!registros.length) {
    return <p className="texto-suave">Nenhum registro para este paciente.</p>;
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {registros.map((r) => (
        <div key={r.id} className="painel" style={{ borderLeft: '4px solid var(--color-accent)', padding: 16 }}>
          <strong>{formatarDataHora(r.criado_em)}</strong>
          <span className="texto-suave"> · {r.profissional_nome}</span>
          <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 6 }}>
            PA: {r.pressao_arterial || '—'} · FC: {r.frequencia_cardiaca ?? '—'} bpm · Temp: {r.temperatura ?? '—'} °C · SpO₂: {r.saturacao_oxigenio ?? '—'}%
          </p>
          {r.medicacao_administrada && <p><b>Medicação:</b> {r.medicacao_administrada}</p>}
          {r.intercorrencias && <p><b>Intercorrências:</b> {r.intercorrencias}</p>}
          {r.observacoes && <p><b>Obs.:</b> {r.observacoes}</p>}
        </div>
      ))}
    </div>
  );
}
