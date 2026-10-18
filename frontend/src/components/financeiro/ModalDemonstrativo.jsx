import { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { plantaoService } from '../../services/plantaoService';
import { formatarData, formatarDataHora, formatarHora, formatarHoras, formatarMoeda } from '../../utils/formatters';
import logoIcone from '../../assets/logo-icone.png';

const nomeDoMes = (mes) => new Date(`${mes}-15T12:00:00`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

// Demonstrativo de pagamento do profissional no mês: cada plantão com entrada, saída e horas.
// Pode ser impresso ou salvo em PDF pelo próprio navegador (Ctrl+P → Salvar como PDF).
export default function ModalDemonstrativo({ pagamento, onFechar }) {
  const [plantoes, setPlantoes] = useState([]);

  useEffect(() => {
    if (!pagamento) return;
    plantaoService.listarPorProfissional(pagamento.profissional_id).then((lista) =>
      setPlantoes(lista
        .filter((p) => p.status === 'finalizado' && formatarMesLocal(p.checkin_hora) === pagamento.mes_referencia)
        .sort((a, b) => new Date(a.checkin_hora) - new Date(b.checkin_hora))));
  }, [pagamento]);

  if (!pagamento) return null;

  return (
    <Modal aberto titulo="Demonstrativo de pagamento" onFechar={onFechar} largura={780}>
      <div className="area-impressao demonstrativo">
        <header className="demonstrativo-topo">
          <div className="marca">
            <img src={logoIcone} alt="" width={30} height={30} />
            <strong style={{ color: 'var(--color-primary-dark)' }}>Home Care Flow</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Demonstrativo de pagamento</strong>
            <span className="texto-suave" style={{ display: 'block' }}>Referência: {nomeDoMes(pagamento.mes_referencia)}</span>
          </div>
        </header>

        <div className="demonstrativo-dados">
          <div><span>Profissional</span><strong>{pagamento.profissional_nome}</strong></div>
          <div><span>Valor da hora</span><strong>{formatarMoeda(pagamento.valor_hora)}</strong></div>
          <div><span>Situação</span><Badge status={pagamento.status} /></div>
        </div>

        <table className="tabela tabela-compacta">
          <thead>
            <tr><th>Data</th><th>Paciente</th><th>Entrada</th><th>Saída</th><th style={{ textAlign: 'right' }}>Horas</th></tr>
          </thead>
          <tbody>
            {plantoes.map((p) => (
              <tr key={p.id}>
                <td className="numero">{formatarData(p.data_prevista)}</td>
                <td>{p.paciente_nome}</td>
                <td className="numero">{formatarHora(p.checkin_hora)}</td>
                <td className="numero">{formatarHora(p.checkout_hora)}</td>
                <td className="numero" style={{ textAlign: 'right' }}>{formatarHoras(p.horas_trabalhadas)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="demonstrativo-total">
          <span>{pagamento.qtd_plantoes} plantões · {formatarHoras(pagamento.horas_trabalhadas)}</span>
          <strong>Total: {formatarMoeda(pagamento.valor_total)}</strong>
        </div>
        <p className="campo-ajuda">
          Horas calculadas automaticamente entre o check-in e o check-out registrados no sistema.
          {pagamento.pago_em && ` Pago em ${formatarDataHora(pagamento.pago_em)}.`}
        </p>
      </div>

      <div className="form-acoes nao-imprimir">
        <Button variant="outline" onClick={onFechar}>Fechar</Button>
        <Button icone={Printer} onClick={() => window.print()}>Imprimir / salvar PDF</Button>
      </div>
    </Modal>
  );
}

// Mês (AAAA-MM) da data no horário local
function formatarMesLocal(valor) {
  const d = new Date(valor);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
