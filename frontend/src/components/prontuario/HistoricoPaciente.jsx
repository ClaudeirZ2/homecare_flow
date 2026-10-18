import { ClipboardList } from 'lucide-react';
import EstadoVazio from '../ui/EstadoVazio';
import { formatarDataHora } from '../../utils/formatters';

// Caixinha de cada sinal vital (pressão, frequência, etc.)
function Sinal({ rotulo, valor, unidade }) {
  return (
    <div className="sinal">
      <span>{rotulo}</span>
      <strong className="numero">{valor ?? '—'}{valor != null && unidade ? ` ${unidade}` : ''}</strong>
    </div>
  );
}

// Histórico do paciente em formato de linha do tempo (o mais recente em cima)
export default function HistoricoPaciente({ registros }) {
  if (!registros.length) {
    return <EstadoVazio icone={ClipboardList} titulo="Nenhum registro" descricao="Selecione um paciente para ver o histórico de atendimentos." />;
  }
  return (
    <div className="linha-tempo">
      {registros.map((r) => (
        <article key={r.id} className="painel registro">
          <header className="registro-cabecalho">
            <strong>{formatarDataHora(r.criado_em)}</strong>
            <span className="texto-suave">{r.profissional_nome}</span>
          </header>
          <div className="sinais">
            <Sinal rotulo="Pressão" valor={r.pressao_arterial || null} />
            <Sinal rotulo="Freq. cardíaca" valor={r.frequencia_cardiaca} unidade="bpm" />
            <Sinal rotulo="Temperatura" valor={r.temperatura} unidade="°C" />
            <Sinal rotulo="SpO₂" valor={r.saturacao_oxigenio} unidade="%" />
          </div>
          {r.medicacao_administrada && <p><span className="registro-rotulo">Medicação</span>{r.medicacao_administrada}</p>}
          {r.intercorrencias && <p><span className="registro-rotulo">Intercorrências</span>{r.intercorrencias}</p>}
          {r.observacoes && <p><span className="registro-rotulo">Observações</span>{r.observacoes}</p>}
        </article>
      ))}
    </div>
  );
}
