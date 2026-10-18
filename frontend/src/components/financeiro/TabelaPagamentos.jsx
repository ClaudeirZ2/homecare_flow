import { CheckCheck, FileText } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatarHoras, formatarMoeda, formatarDataHora } from '../../utils/formatters';

// Tabela do fechamento do mês, com o botão para marcar como pago
export default function TabelaPagamentos({ relatorio, onPagar, onDemonstrativo }) {
  const colunas = [
    { chave: 'profissional_nome', titulo: 'Profissional', render: (r) => <span className="celula-principal">{r.profissional_nome}</span> },
    { chave: 'qtd_plantoes', titulo: 'Plantões', alinhar: 'right', render: (r) => <span className="numero">{r.qtd_plantoes}</span> },
    { chave: 'horas_trabalhadas', titulo: 'Horas', alinhar: 'right', render: (r) => <span className="numero">{formatarHoras(r.horas_trabalhadas || 0)}</span> },
    { chave: 'valor_hora', titulo: 'Valor/hora', alinhar: 'right', render: (r) => <span className="numero">{formatarMoeda(r.valor_hora)}</span> },
    { chave: 'valor_total', titulo: 'A receber', alinhar: 'right', render: (r) => <strong className="numero">{formatarMoeda(r.valor_total)}</strong> },
    { chave: 'status', titulo: 'Status', render: (r) => <Badge status={r.status} /> },
    {
      chave: 'acao', titulo: 'Ação', alinhar: 'right',
      render: (r) => (
        <div className="acoes" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <Button size="sm" variant="ghost" icone={FileText} titulo="Demonstrativo" onClick={() => onDemonstrativo(r)} />
          {r.status === 'pago'
            ? <span className="texto-suave">Pago em {formatarDataHora(r.pago_em)}</span>
            : <Button size="sm" variant="outline" icone={CheckCheck} onClick={() => onPagar(r)}>Marcar como pago</Button>}
        </div>
      ),
    },
  ];
  return <Table colunas={colunas} dados={relatorio} vazio="Sem plantões finalizados neste mês." />;
}
