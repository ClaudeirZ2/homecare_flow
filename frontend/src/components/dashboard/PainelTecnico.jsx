import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Timer, Wallet, ArrowRight, Clock, MapPin, CalendarX2, Activity } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { escalaService } from '../../services/escalaService';
import { plantaoService } from '../../services/plantaoService';
import { pagamentoService } from '../../services/pagamentoService';
import { mensagemDeErro } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatarData, formatarDataHora, formatarHoras, formatarMoeda, hojeISO, rotulo } from '../../utils/formatters';

// Painel do técnico/cuidador: o plantão de hoje em destaque, as próximas escalas
// e quanto ele já tem a receber no mês (calculado pelas horas reais).
export default function PainelTecnico() {
  const toast = useToast();
  const [dados, setDados] = useState({ escalas: [], plantoes: [], ganhos: null });

  useEffect(() => {
    Promise.all([escalaService.listar(), plantaoService.listar(), pagamentoService.meusGanhos()])
      .then(([escalas, plantoes, ganhos]) => setDados({ escalas, plantoes, ganhos }))
      .catch((err) => toast.erro(mensagemDeErro(err, 'Erro ao carregar o seu painel.')));
  }, [toast]);

  const hoje = hojeISO();
  const emAndamento = dados.plantoes.find((p) => p.status === 'em_andamento');
  const deHoje = dados.escalas.filter((e) => e.data_prevista === hoje && e.status === 'agendado');
  const proximas = dados.escalas
    .filter((e) => e.status === 'agendado' && e.data_prevista >= hoje)
    .sort((a, b) => a.data_prevista.localeCompare(b.data_prevista))
    .slice(0, 5);
  const resumo = dados.ganhos?.resumo;

  return (
    <>
      {/* Destaque: o que o profissional precisa fazer agora */}
      {emAndamento ? (
        <div className="destaque destaque-ativo">
          <Activity size={22} />
          <div>
            <strong>Você está em plantão na casa de {emAndamento.paciente_nome}</strong>
            <span>Check-in às {formatarDataHora(emAndamento.checkin_hora)}. Lembre de registrar o prontuário antes do check-out.</span>
          </div>
          <Link to="/plantoes" className="btn btn-secondary">Fazer check-out <ArrowRight size={16} /></Link>
        </div>
      ) : deHoje.length > 0 ? (
        <div className="destaque">
          <MapPin size={22} />
          <div>
            <strong>Hoje você atende {deHoje.map((e) => e.paciente_nome).join(' e ')}</strong>
            <span>Ao chegar na residência, faça o check-in pelo QR Code ou GPS.</span>
          </div>
          <Link to="/plantoes" className="btn btn-primary">Fazer check-in <ArrowRight size={16} /></Link>
        </div>
      ) : (
        <div className="destaque destaque-neutro">
          <CalendarX2 size={22} />
          <div>
            <strong>Nenhum plantão para hoje</strong>
            <span>Confira abaixo as suas próximas escalas.</span>
          </div>
        </div>
      )}

      <div className="grid-cards">
        <Card title="Plantões no mês" value={resumo ? resumo.qtd_plantoes : '—'} icon={CalendarCheck} dica="finalizados com check-out" />
        <Card title="Horas trabalhadas" value={resumo ? formatarHoras(resumo.horas) : '—'} icon={Timer} dica="pelo horário real de entrada e saída" />
        <Card title="A receber no mês" value={resumo ? formatarMoeda(resumo.valor) : '—'} icon={Wallet}
          dica={resumo ? `valor da hora: ${formatarMoeda(resumo.valor_hora)}` : ''} />
      </div>

      <div className="painel">
        <div className="painel-cabecalho">
          <h3 className="painel-titulo">Próximas escalas</h3>
          <Link to="/escalas" className="painel-link">Ver todas <ArrowRight size={14} /></Link>
        </div>
        {proximas.length === 0 && <p className="texto-suave">Você não tem escalas agendadas.</p>}
        <ul className="lista-agenda">
          {proximas.map((e) => (
            <li key={e.id} className="agenda-item">
              <div>
                <strong>{e.paciente_nome}</strong>
                <p className="texto-suave">{e.paciente_endereco}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="turno-tag"><Clock size={13} /> {formatarData(e.data_prevista)} · {rotulo(e.turno)}</span>
                <Badge status={e.status} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
