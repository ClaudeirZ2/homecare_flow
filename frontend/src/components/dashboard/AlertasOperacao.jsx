import { Link } from 'react-router-dom';
import { AlertTriangle, FileWarning, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatarData, formatarDistancia } from '../../utils/formatters';

const RAIO_PERMITIDO_M = 300;

// Pontos que a gestão precisa conferir: check-in longe da casa e plantão sem prontuário
export default function AlertasOperacao({ plantoes }) {
  const foraDoRaio = plantoes.filter((p) => p.checkin_distancia_m > RAIO_PERMITIDO_M);
  const semProntuario = plantoes.filter((p) => p.status === 'finalizado' && Number(p.qtd_prontuarios) === 0);
  const alertas = [
    ...foraDoRaio.map((p) => ({
      id: `gps-${p.id}`, icone: AlertTriangle, tipo: 'perigo',
      titulo: `Check-in a ${formatarDistancia(p.checkin_distancia_m)} da residência`,
      detalhe: `${p.profissional_nome} · ${p.paciente_nome} · ${formatarData(p.data_prevista)}`,
    })),
    ...semProntuario.map((p) => ({
      id: `pront-${p.id}`, icone: FileWarning, tipo: 'aviso',
      titulo: 'Plantão finalizado sem prontuário',
      detalhe: `${p.profissional_nome} · ${p.paciente_nome} · ${formatarData(p.data_prevista)}`,
    })),
  ].slice(0, 5);

  return (
    <div className="painel">
      <div className="painel-cabecalho">
        <h3 className="painel-titulo">Pontos de atenção</h3>
        <Link to="/plantoes" className="painel-link">Ver plantões <ArrowRight size={14} /></Link>
      </div>

      {alertas.length === 0 ? (
        <div className="vazio" style={{ padding: '20px 0' }}>
          <ShieldCheck size={26} style={{ color: 'var(--color-accent)' }} />
          <strong>Tudo em ordem</strong>
          <span>Nenhum check-in fora do endereço e nenhum plantão sem registro.</span>
        </div>
      ) : (
        <ul className="lista-alertas">
          {alertas.map(({ id, icone: Icone, tipo, titulo, detalhe }) => (
            <li key={id} className={`alerta alerta-${tipo}`}>
              <Icone size={16} />
              <div>
                <strong>{titulo}</strong>
                <span>{detalhe}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
