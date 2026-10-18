import { Link } from 'react-router-dom';
import { ArrowRight, CalendarX2, Clock } from 'lucide-react';
import Badge from '../ui/Badge';
import { rotulo } from '../../utils/formatters';

// Lista resumida com as escalas de hoje
export default function AgendaHoje({ escalas }) {
  return (
    <div className="painel">
      <div className="painel-cabecalho">
        <h3 className="painel-titulo">Agenda de hoje</h3>
        <Link to="/plantoes" className="painel-link">Ir para plantões <ArrowRight size={14} /></Link>
      </div>
      {escalas.length === 0 && (
        <div className="vazio" style={{ padding: '24px 0' }}>
          <CalendarX2 size={26} />
          <strong>Nenhuma escala para hoje</strong>
        </div>
      )}
      <ul className="lista-agenda">
        {escalas.map((e) => (
          <li key={e.id} className="agenda-item">
            <div>
              <strong>{e.paciente_nome}</strong>
              <p className="texto-suave">{e.profissional_nome}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="turno-tag"><Clock size={13} /> {rotulo(e.turno)}</span>
              <Badge status={e.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
