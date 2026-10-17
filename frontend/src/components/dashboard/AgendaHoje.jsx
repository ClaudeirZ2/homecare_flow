import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { rotulo } from '../../utils/formatters';

// Lista compacta das escalas do dia
export default function AgendaHoje({ escalas }) {
  return (
    <div className="painel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="painel-titulo">Agenda de hoje</h3>
        <Link to="/plantoes" style={{ color: 'var(--color-accent)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
          Ir para plantões →
        </Link>
      </div>
      {escalas.length === 0 && <p className="texto-suave">Nenhuma escala para hoje.</p>}
      <ul style={{ listStyle: 'none' }}>
        {escalas.map((e) => (
          <li key={e.id} className="agenda-item">
            <div>
              <strong>{e.paciente_nome}</strong>
              <p className="texto-suave">{e.profissional_nome} · {rotulo(e.turno)}</p>
            </div>
            <Badge status={e.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
