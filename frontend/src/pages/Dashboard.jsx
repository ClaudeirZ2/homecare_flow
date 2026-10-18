import { useEffect, useState } from 'react';
import { Users, UserRound, CalendarDays, Activity } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import ResumoEscalas from '../components/dashboard/ResumoEscalas';
import AgendaHoje from '../components/dashboard/AgendaHoje';
import GraficoAtividade from '../components/dashboard/GraficoAtividade';
import { pacienteService } from '../services/pacienteService';
import { profissionalService } from '../services/profissionalService';
import { escalaService } from '../services/escalaService';
import { plantaoService } from '../services/plantaoService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { hojeISO } from '../utils/formatters';

// Data por extenso no cabeçalho, tipo "sexta-feira, 16 de outubro"
const dataExtenso = () => new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Dashboard() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [dados, setDados] = useState({ pacientes: [], profissionais: [], escalas: [], plantoes: [] });

  useEffect(() => {
    Promise.all([
      pacienteService.listar(), profissionalService.listar(), escalaService.listar(), plantaoService.listar(),
    ])
      .then(([pacientes, profissionais, escalas, plantoes]) => setDados({ pacientes, profissionais, escalas, plantoes }))
      .catch((err) => toast.erro(mensagemDeErro(err, 'Erro ao carregar o painel.')));
  }, [toast]);

  const hoje = hojeISO();
  const escalasHoje = dados.escalas.filter((e) => e.data_prevista === hoje);
  const emPlantao = dados.plantoes.filter((p) => p.status === 'em_andamento').length;
  const disponiveis = dados.profissionais.filter((p) => p.status_disponibilidade === 'disponivel').length;
  const primeiroNome = usuario?.nome?.split(' ')[0];

  return (
    <>
      <PageHeader titulo="Visão Geral" subtitulo={`Olá, ${primeiroNome}. Hoje é ${dataExtenso()}.`} />
      <div className="grid-cards">
        <Card title="Pacientes ativos" value={dados.pacientes.length} icon={Users} dica="em atendimento domiciliar" />
        <Card title="Cuidadores" value={dados.profissionais.length} icon={UserRound} dica={`${disponiveis} disponíveis agora`} />
        <Card title="Escalas de hoje" value={escalasHoje.length} icon={CalendarDays}
          dica={`${escalasHoje.filter((e) => e.status === 'concluido').length} concluídas`} />
        <Card title="Plantões em andamento" value={emPlantao} icon={Activity} dica="check-in realizado" />
      </div>
      <div className="grid-dashboard">
        <GraficoAtividade escalas={dados.escalas} plantoes={dados.plantoes} />
        <ResumoEscalas escalas={dados.escalas} />
      </div>
      <AgendaHoje escalas={escalasHoje} />
    </>
  );
}
