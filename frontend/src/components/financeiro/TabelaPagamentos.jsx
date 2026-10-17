import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatarMoeda, formatarDataHora } from '../../utils/formatters';

// Fechamento mensal por profissional, com ação de marcar como pago
export default function TabelaPagamentos({ relatorio, onPagar }) {
  const colunas = [
    { chave: 'profissional_nome', titulo: 'Profissional' },
    { chave: 'qtd_plantoes', titulo: 'Plantões' },
    { chave: 'horas_trabalhadas', titulo: 'Horas', render: (r) => `${Number(r.horas_trabalhadas || 0).toFixed(1)} h` },
    { chave: 'valor_hora', titulo: 'Valor/hora', render: (r) => formatarMoeda(r.valor_hora) },
    { chave: 'valor_total', titulo: 'Valor a receber', render: (r) => <strong>{formatarMoeda(r.valor_total)}</strong> },
    { chave: 'status', titulo: 'Status', render: (r) => <Badge status={r.status} /> },
    {
      chave: 'acao', titulo: 'Ação',
      render: (r) => (r.status === 'pago'
        ? <span className="texto-suave">Pago em {formatarDataHora(r.pago_em)}</span>
        : <Button size="sm" onClick={() => onPagar(r)}>Marcar como pago</Button>),
    },
  ];
  return <Table colunas={colunas} dados={relatorio} vazio="Sem plantões finalizados neste mês." />;
}
