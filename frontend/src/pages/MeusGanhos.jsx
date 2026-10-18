import { useCallback, useEffect, useState } from 'react';
import { CalendarCheck, Timer, Wallet, Info } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import { pagamentoService } from '../services/pagamentoService';
import { mensagemDeErro } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatarDataHora, formatarHoras, formatarMoeda, hojeISO } from '../utils/formatters';

// '2026-10' -> 'outubro de 2026'
const nomeDoMes = (mes) => new Date(`${mes}-15T12:00:00`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

// "Meus ganhos": transparência para o profissional. Ele vê quanto já tem a receber no mês,
// calculado pelas horas reais dos plantões, e o histórico dos pagamentos (pendente/pago).
// É a parte do sistema que mais conversa com a ODS 8 (trabalho decente).
export default function MeusGanhos() {
  const toast = useToast();
  const [mes, setMes] = useState(hojeISO().slice(0, 7));
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setDados(await pagamentoService.meusGanhos(mes));
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao carregar os seus ganhos.'));
    } finally {
      setCarregando(false);
    }
  }, [mes, toast]);

  useEffect(() => { carregar(); }, [carregar]);

  const resumo = dados?.resumo;
  const colunas = [
    { chave: 'mes_referencia', titulo: 'Mês', render: (p) => <span className="celula-principal">{nomeDoMes(p.mes_referencia)}</span> },
    { chave: 'qtd_plantoes', titulo: 'Plantões', alinhar: 'right', render: (p) => <span className="numero">{p.qtd_plantoes}</span> },
    { chave: 'valor_total', titulo: 'Valor', alinhar: 'right', render: (p) => <strong className="numero">{formatarMoeda(p.valor_total)}</strong> },
    { chave: 'status', titulo: 'Status', render: (p) => <Badge status={p.status} /> },
    { chave: 'pago_em', titulo: 'Pago em', render: (p) => (p.pago_em ? formatarDataHora(p.pago_em) : '—') },
  ];

  return (
    <>
      <PageHeader titulo="Meus ganhos" subtitulo="Acompanhe suas horas e quanto você tem a receber, com base nos seus check-ins." />

      <div className="barra-filtros">
        <Input label="Mês" type="month" name="mes" value={mes} onChange={(e) => setMes(e.target.value)} />
      </div>

      <div className="grid-cards">
        <Card title="Plantões finalizados" value={resumo ? resumo.qtd_plantoes : '—'} icon={CalendarCheck} dica={mes && nomeDoMes(mes)} />
        <Card title="Horas trabalhadas" value={resumo ? formatarHoras(resumo.horas) : '—'} icon={Timer} dica="entre o check-in e o check-out" />
        <Card title="Valor do mês" value={resumo ? formatarMoeda(resumo.valor) : '—'} icon={Wallet}
          dica={resumo ? `${formatarHoras(resumo.horas)} × ${formatarMoeda(resumo.valor_hora)}` : ''} />
      </div>

      <div className="aviso-info">
        <Info size={16} />
        <span>
          O valor é calculado automaticamente: <strong>minutos trabalhados ÷ 60 × valor da sua hora</strong>.
          Você não depende de anotação em papel nem de combinado por mensagem.
        </span>
      </div>

      <h2 className="secao-titulo">Histórico de pagamentos</h2>
      <Table colunas={colunas} dados={dados?.historico || []} carregando={carregando}
        vazio="Nenhum fechamento ainda. Ele aparece aqui quando a gestão fecha o mês." />
    </>
  );
}
