import { useCallback, useEffect, useState } from 'react';
import { CalendarClock, LogOut, QrCode } from 'lucide-react';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import BotaoCheckin from '../components/plantoes/BotaoCheckin';
import ModalCheckinQr from '../components/plantoes/ModalCheckinQr';
import TabelaHistoricoPlantoes from '../components/plantoes/TabelaHistoricoPlantoes';
import { escalaService } from '../services/escalaService';
import { plantaoService } from '../services/plantaoService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatarData, hojeISO, rotulo } from '../utils/formatters';

// Check-in / check-out dos plantões. O técnico vê só as próprias escalas (filtro feito na API).
export default function Plantoes() {
  const { ehGestao } = useAuth();
  const toast = useToast();

  const [pendentes, setPendentes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [escalaQr, setEscalaQr] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [agendadas, andamento, plantoes] = await Promise.all([
        escalaService.listar({ status: 'agendado' }),
        escalaService.listar({ status: 'em_andamento' }),
        plantaoService.listar(),
      ]);
      // Em andamento primeiro; depois as agendadas da mais próxima para a mais distante
      setPendentes([...andamento, ...agendadas.reverse()]);
      setHistorico(plantoes);
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Erro ao carregar plantões.'));
    }
  }, [toast]);

  useEffect(() => { carregar(); }, [carregar]);

  async function executar(acao, mensagemSucesso) {
    setSalvando(true);
    try {
      await acao();
      toast.sucesso(mensagemSucesso);
      setEscalaQr(null);
      carregar();
    } catch (err) {
      toast.erro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  const checkinGps = (escala, coords) =>
    executar(() => plantaoService.checkin({ escala_id: escala.id, metodo: 'gps', ...coords }), 'Check-in registrado com GPS.');

  const checkinQr = (codigo) =>
    executar(() => plantaoService.checkin({ escala_id: escalaQr.id, metodo: 'qrcode', codigo }), 'Check-in registrado com QR Code.');

  const checkout = (escala, coords) =>
    executar(() => plantaoService.checkout(escala.plantao_id, coords), 'Check-out registrado. Bom descanso!');

  const colunas = [
    { chave: 'data_prevista', titulo: 'Data', render: (e) => <span className="numero">{formatarData(e.data_prevista)}</span> },
    {
      chave: 'paciente_nome', titulo: 'Paciente',
      render: (e) => (
        <>
          <span className="celula-principal">{e.paciente_nome}</span>
          {e.paciente_endereco && <span className="celula-sub">{e.paciente_endereco}</span>}
        </>
      ),
    },
    ...(ehGestao ? [{ chave: 'profissional_nome', titulo: 'Profissional' }] : []),
    { chave: 'turno', titulo: 'Turno', render: (e) => rotulo(e.turno) },
    { chave: 'status', titulo: 'Status', render: (e) => <Badge status={e.status} /> },
    {
      chave: 'acao', titulo: 'Ação',
      render: (e) => {
        // Check-in só é liberado no dia da escala (a API também valida)
        if (e.status === 'agendado' && e.data_prevista > hojeISO()) {
          return <span className="info-linha"><CalendarClock size={14} /> Liberado em {formatarData(e.data_prevista)}</span>;
        }
        return (e.status === 'em_andamento' && e.plantao_id
        ? <BotaoCheckin rotulo="Check-out" variant="secondary" icone={LogOut} onLocalizado={(c) => checkout(e, c)}
            onErro={() => checkout(e, {})} />
        : (
          <div className="acoes" style={{ gap: 8, flexWrap: 'wrap' }}>
            <BotaoCheckin onLocalizado={(c) => checkinGps(e, c)} onErro={toast.erro} />
            <Button size="sm" variant="outline" icone={QrCode} onClick={() => setEscalaQr(e)}>QR Code</Button>
          </div>
        ));
      },
    },
  ];

  return (
    <>
      <PageHeader titulo="Plantões" subtitulo="Registre a chegada e a saída com GPS ou QR Code da residência." />

      <h2 className="secao-titulo" style={{ marginTop: 0 }}>Escalas para check-in / check-out</h2>
      <Table colunas={colunas} dados={pendentes} vazio="Nenhuma escala pendente." />

      <h2 className="secao-titulo">Histórico de plantões</h2>
      <TabelaHistoricoPlantoes plantoes={historico} mostrarProfissional={ehGestao} />

      <ModalCheckinQr escala={escalaQr} salvando={salvando} onConfirmar={checkinQr} onFechar={() => setEscalaQr(null)} />
    </>
  );
}
