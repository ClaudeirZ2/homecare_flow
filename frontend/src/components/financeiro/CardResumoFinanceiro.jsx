import { Users, CalendarCheck, Timer, Hourglass, BadgeCheck } from 'lucide-react';
import Card from '../ui/Card';
import { formatarHoras, formatarMoeda } from '../../utils/formatters';

export default function CardResumoFinanceiro({ relatorio }) {
  const soma = (campo, filtro = () => true) =>
    relatorio.filter(filtro).reduce((s, r) => s + Number(r[campo] || 0), 0);

  return (
    <div className="grid-cards grid-cards-compacto">
      <Card title="Profissionais no mês" value={relatorio.length} icon={Users} />
      <Card title="Plantões concluídos" value={soma('qtd_plantoes')} icon={CalendarCheck} />
      <Card title="Horas trabalhadas" value={formatarHoras(soma('horas_trabalhadas'))} icon={Timer} />
      <Card title="Total pendente" value={formatarMoeda(soma('valor_total', (r) => r.status !== 'pago'))} icon={Hourglass} />
      <Card title="Total pago" value={formatarMoeda(soma('valor_total', (r) => r.status === 'pago'))} icon={BadgeCheck} />
    </div>
  );
}
