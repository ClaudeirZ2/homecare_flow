import { rotulo } from '../../utils/formatters';

// Selo de status (agendado, concluído, cancelado, etc.)
const CORES_STATUS = {
  agendado: { bg: '#e6f0fa', color: '#2563eb' },
  em_andamento: { bg: '#fef3c7', color: '#b45309' },
  concluido: { bg: '#d1f5ea', color: '#0f7a5f' },
  finalizado: { bg: '#d1f5ea', color: '#0f7a5f' },
  cancelado: { bg: '#fde2e2', color: '#b91c1c' },
  disponivel: { bg: '#d1f5ea', color: '#0f7a5f' },
  em_plantao: { bg: '#fef3c7', color: '#b45309' },
  indisponivel: { bg: '#f1f1f1', color: '#666' },
  pendente: { bg: '#fef3c7', color: '#b45309' },
  pago: { bg: '#d1f5ea', color: '#0f7a5f' },
};

export default function Badge({ status }) {
  const estilo = CORES_STATUS[status] || { bg: '#eee', color: '#333' };
  return (
    <span
      style={{
        background: estilo.bg,
        color: estilo.color,
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {rotulo(status)}
    </span>
  );
}
