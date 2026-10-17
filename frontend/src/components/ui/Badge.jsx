import { rotulo } from '../../utils/formatters';

// Selo de status discreto (ponto colorido + texto)
const COR_STATUS = {
  agendado: 'azul',
  em_andamento: 'ambar',
  em_plantao: 'ambar',
  pendente: 'ambar',
  concluido: 'verde',
  finalizado: 'verde',
  disponivel: 'verde',
  pago: 'verde',
  cancelado: 'vermelho',
  indisponivel: 'cinza',
};

export default function Badge({ status }) {
  return <span className={`badge badge-${COR_STATUS[status] || 'cinza'}`}>{rotulo(status)}</span>;
}
