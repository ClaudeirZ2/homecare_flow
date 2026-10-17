import Card from '../ui/Card';
import { formatarMoeda } from '../../utils/formatters';

export default function CardResumoFinanceiro({ relatorio }) {
  const soma = (campo, filtro = () => true) =>
    relatorio.filter(filtro).reduce((s, r) => s + Number(r[campo] || 0), 0);

  return (
    <div className="grid-cards">
      <Card title="Profissionais no mês" value={relatorio.length} />
      <Card title="Plantões concluídos" value={soma('qtd_plantoes')} />
      <Card title="Horas trabalhadas" value={`${soma('horas_trabalhadas').toFixed(1)} h`} />
      <Card title="Total pendente" value={formatarMoeda(soma('valor_total', (r) => r.status !== 'pago'))} />
      <Card title="Total já pago" value={formatarMoeda(soma('valor_total', (r) => r.status === 'pago'))} />
    </div>
  );
}
