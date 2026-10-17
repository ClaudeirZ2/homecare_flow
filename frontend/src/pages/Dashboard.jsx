import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import ResumoEscalas from '../components/dashboard/ResumoEscalas';
import AgendaHoje from '../components/dashboard/AgendaHoje';
import { pacienteService } from '../services/pacienteService';
import { profissionalService } from '../services/profissionalService';
import { escalaService } from '../services/escalaService';
import { plantaoService } from '../services/plantaoService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { hojeISO } from '../utils/formatters';

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
  const primeiroNome = usuario?.nome?.split(' ')[0];

  return (
    <>
      <PageHeader titulo="Visão Geral" subtitulo={`Olá, ${primeiroNome}! Este é o resumo da operação.`} />
      <div className="grid-cards">
        <Card title="Pacientes ativos" value={dados.pacientes.length} />
        <Card title="Cuidadores" value={dados.profissionais.length} />
        <Card title="Escalas de hoje" value={escalasHoje.length} />
        <Card title="Plantões em andamento" value={emPlantao} />
      </div>
      <div className="grid-2">
        <AgendaHoje escalas={escalasHoje} />
        <ResumoEscalas escalas={dados.escalas} />
      </div>
    </>
  );
}
