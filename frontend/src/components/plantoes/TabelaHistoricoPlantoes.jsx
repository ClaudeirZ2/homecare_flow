import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { formatarData, formatarDataHora, rotulo } from '../../utils/formatters';

// Histórico de plantões realizados (check-in/out, método e horas)
export default function TabelaHistoricoPlantoes({ plantoes, mostrarProfissional }) {
  const colunas = [
    { chave: 'data_prevista', titulo: 'Data', render: (p) => formatarData(p.data_prevista) },
    { chave: 'paciente_nome', titulo: 'Paciente' },
    ...(mostrarProfissional ? [{ chave: 'profissional_nome', titulo: 'Profissional' }] : []),
    {
      chave: 'checkin_hora', titulo: 'Check-in',
      render: (p) => `${formatarDataHora(p.checkin_hora)} (${rotulo(p.checkin_metodo)})`,
    },
    { chave: 'checkout_hora', titulo: 'Check-out', render: (p) => formatarDataHora(p.checkout_hora) },
    { chave: 'horas_trabalhadas', titulo: 'Horas', render: (p) => (p.horas_trabalhadas != null ? `${p.horas_trabalhadas} h` : '—') },
    { chave: 'qtd_prontuarios', titulo: 'Prontuário', render: (p) => (p.qtd_prontuarios > 0 ? '✅' : '—') },
    { chave: 'status', titulo: 'Status', render: (p) => <Badge status={p.status} /> },
  ];

  return <Table colunas={colunas} dados={plantoes} vazio="Nenhum plantão registrado." />;
}
