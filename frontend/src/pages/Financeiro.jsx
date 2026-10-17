import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import ModalConfirmacao from '../components/ui/ModalConfirmacao';
import CardResumoFinanceiro from '../components/financeiro/CardResumoFinanceiro';
import TabelaPagamentos from '../components/financeiro/TabelaPagamentos';
import { pagamentoService } from '../services/pagamentoService';
import { mensagemDeErro } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatarMoeda, hojeISO } from '../utils/formatters';
import { exportarCsv } from '../utils/exportarCsv';

export default function Financeiro() {
  const toast = useToast();
  const [mes, setMes] = useState(hojeISO().slice(0, 7));
  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pagando, setPagando] = useState(null);

  const gerar = useCallback(async () => {
    if (!mes) return;
    setCarregando(true);
    try {
      setRelatorio(await pagamentoService.gerarRelatorioMensal(mes));
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao gerar o relatório.'));
    } finally {
      setCarregando(false);
    }
  }, [mes, toast]);

  useEffect(() => { gerar(); }, [gerar]);

  async function confirmarPagamento() {
    try {
      await pagamentoService.marcarComoPago(pagando.id);
      toast.sucesso(`Pagamento de ${pagando.profissional_nome} registrado.`);
      setPagando(null);
      gerar();
    } catch (err) {
      toast.erro(mensagemDeErro(err));
    }
  }

  function exportar() {
    exportarCsv(`fechamento-${mes}.csv`, [
      { titulo: 'Profissional', valor: (r) => r.profissional_nome },
      { titulo: 'Plantões', valor: (r) => r.qtd_plantoes },
      { titulo: 'Horas', valor: (r) => Number(r.horas_trabalhadas || 0).toFixed(2).replace('.', ',') },
      { titulo: 'Valor/hora', valor: (r) => Number(r.valor_hora).toFixed(2).replace('.', ',') },
      { titulo: 'Valor total', valor: (r) => Number(r.valor_total).toFixed(2).replace('.', ',') },
      { titulo: 'Status', valor: (r) => r.status },
    ], relatorio);
  }

  return (
    <>
      <PageHeader titulo="Relatórios Financeiros" subtitulo="Fechamento mensal calculado a partir das horas reais de check-in/check-out.">
        <Button variant="outline" icone={Download} onClick={exportar} disabled={!relatorio.length}>Exportar CSV</Button>
      </PageHeader>

      <div className="barra-filtros">
        <Input label="Mês de referência" type="month" name="mes" value={mes} onChange={(e) => setMes(e.target.value)} />
      </div>

      {carregando ? <p className="texto-suave">Calculando...</p> : (
        <>
          <CardResumoFinanceiro relatorio={relatorio} />
          <TabelaPagamentos relatorio={relatorio} onPagar={setPagando} />
        </>
      )}

      <ModalConfirmacao
        aberto={!!pagando}
        titulo="Confirmar pagamento"
        mensagem={`Registrar o pagamento de ${formatarMoeda(pagando?.valor_total)} para ${pagando?.profissional_nome}?`}
        textoConfirmar="Confirmar pagamento"
        tipo="neutro"
        onConfirmar={confirmarPagamento}
        onCancelar={() => setPagando(null)}
      />
    </>
  );
}
