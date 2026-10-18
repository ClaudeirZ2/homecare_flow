import { useEffect, useState } from 'react';
import { Users, UserRound, CalendarDays, Activity } from 'lucide-react';
import Card from '../ui/Card';
import ResumoEscalas from './ResumoEscalas';
import AgendaHoje from './AgendaHoje';
import GraficoAtividade from './GraficoAtividade';
import AtividadeRecente from './AtividadeRecente';
import AlertasOperacao from './AlertasOperacao';
import { pacienteService } from '../../services/pacienteService';
import { profissionalService } from '../../services/profissionalService';
import { escalaService } from '../../services/escalaService';
import { plantaoService } from '../../services/plantaoService';
import { auditoriaService } from '../../services/auditoriaService';
import { mensagemDeErro } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { hojeISO } from '../../utils/formatters';

// Painel da gestão: indicadores, gráfico, alertas, agenda e o que aconteceu por último no sistema
export default function PainelGestao() {
  const toast = useToast();
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState({ pacientes: [], profissionais: [], escalas: [], plantoes: [], atividades: [] });

  useEffect(() => {
    Promise.all([
      pacienteService.listar(), profissionalService.listar(), escalaService.listar(),
      plantaoService.listar(), auditoriaService.recentes(8),
    ])
      .then(([pacientes, profissionais, escalas, plantoes, atividades]) =>
        setDados({ pacientes, profissionais, escalas, plantoes, atividades }))
      .catch((err) => toast.erro(mensagemDeErro(err, 'Erro ao carregar o painel.')))
      .finally(() => setCarregando(false));
  }, [toast]);

  const hoje = hojeISO();
  const escalasHoje = dados.escalas.filter((e) => e.data_prevista === hoje);
  const emPlantao = dados.plantoes.filter((p) => p.status === 'em_andamento').length;
  const disponiveis = dados.profissionais.filter((p) => p.status_disponibilidade === 'disponivel').length;
  const v = (valor) => (carregando ? '—' : valor);

  return (
    <>
      <div className="grid-cards">
        <Card title="Pacientes ativos" value={v(dados.pacientes.length)} icon={Users} dica="em atendimento domiciliar" />
        <Card title="Cuidadores" value={v(dados.profissionais.length)} icon={UserRound} dica={`${disponiveis} disponíveis agora`} />
        <Card title="Escalas de hoje" value={v(escalasHoje.length)} icon={CalendarDays}
          dica={`${escalasHoje.filter((e) => e.status === 'concluido').length} concluídas`} />
        <Card title="Plantões em andamento" value={v(emPlantao)} icon={Activity} dica="check-in realizado" />
      </div>

      <div className="grid-dashboard">
        <GraficoAtividade escalas={dados.escalas} plantoes={dados.plantoes} />
        <ResumoEscalas escalas={dados.escalas} />
      </div>

      <div className="grid-dashboard">
        <AgendaHoje escalas={escalasHoje} />
        <AlertasOperacao plantoes={dados.plantoes} />
      </div>

      <AtividadeRecente atividades={dados.atividades} carregando={carregando} />
    </>
  );
}
