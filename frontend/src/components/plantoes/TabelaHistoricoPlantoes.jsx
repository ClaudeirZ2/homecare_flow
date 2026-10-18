import { AlertTriangle, FileCheck2, MapPin, QrCode } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import { formatarData, formatarDataHora, formatarDistancia, formatarHoras } from '../../utils/formatters';

const RAIO_PERMITIDO_M = 300;

// Histórico dos plantões: horário de entrada e saída, se foi por GPS ou QR, e as horas
export default function TabelaHistoricoPlantoes({ plantoes, mostrarProfissional }) {
  const colunas = [
    { chave: 'data_prevista', titulo: 'Data', render: (p) => <span className="numero">{formatarData(p.data_prevista)}</span> },
    { chave: 'paciente_nome', titulo: 'Paciente', render: (p) => <span className="celula-principal">{p.paciente_nome}</span> },
    ...(mostrarProfissional ? [{ chave: 'profissional_nome', titulo: 'Profissional' }] : []),
    {
      chave: 'checkin_hora', titulo: 'Check-in',
      render: (p) => (
        <span className="info-linha" style={{ color: 'var(--color-text)' }}>
          {p.checkin_metodo === 'qrcode' ? <QrCode size={14} /> : <MapPin size={14} />}
          <span className="numero">{formatarDataHora(p.checkin_hora)}</span>
          {p.checkin_distancia_m > RAIO_PERMITIDO_M && (
            <span className="alerta-distancia" title="Check-in feito longe da residência">
              <AlertTriangle size={12} /> {formatarDistancia(p.checkin_distancia_m)}
            </span>
          )}
        </span>
      ),
    },
    { chave: 'checkout_hora', titulo: 'Check-out', render: (p) => <span className="numero">{formatarDataHora(p.checkout_hora)}</span> },
    {
      chave: 'horas_trabalhadas', titulo: 'Horas', alinhar: 'right',
      render: (p) => <span className="numero">{formatarHoras(p.horas_trabalhadas)}</span>,
    },
    {
      chave: 'qtd_prontuarios', titulo: 'Prontuário',
      render: (p) => (p.qtd_prontuarios > 0
        ? <span className="info-linha" style={{ color: 'var(--color-accent-hover)' }}><FileCheck2 size={15} /> Registrado</span>
        : <span className="texto-suave">Pendente</span>),
    },
    { chave: 'status', titulo: 'Status', render: (p) => <Badge status={p.status} /> },
  ];

  return <Table colunas={colunas} dados={plantoes} vazio="Nenhum plantão registrado." />;
}
