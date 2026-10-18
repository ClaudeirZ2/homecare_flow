import {
  LogIn, PlusCircle, Pencil, Trash2, MapPinCheck, LogOut, FileText, BadgeDollarSign, History,
} from 'lucide-react';

// Ícone de cada tipo de ação registrada na auditoria
const ICONES = {
  login: LogIn, criou: PlusCircle, editou: Pencil, excluiu: Trash2,
  checkin: MapPinCheck, checkout: LogOut, registrou: FileText, pagou: BadgeDollarSign,
};

// "Há 5 min", "há 2 h", "ontem"... fica mais fácil de ler do que a data completa
function tempoRelativo(data) {
  const minutos = Math.round((Date.now() - new Date(data).getTime()) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.round(horas / 24);
  return dias === 1 ? 'ontem' : `há ${dias} dias`;
}

// Últimas ações do sistema, vindas da tabela de auditoria (quem fez o quê e quando)
export default function AtividadeRecente({ atividades, carregando }) {
  return (
    <div className="painel">
      <div className="painel-cabecalho">
        <div>
          <h3 className="painel-titulo">Atividade recente</h3>
          <p className="texto-suave">Registro de auditoria: quem fez o quê e quando</p>
        </div>
      </div>

      {!carregando && atividades.length === 0 && <p className="texto-suave">Nenhuma atividade registrada ainda.</p>}

      <ul className="linha-atividades">
        {atividades.map((a) => {
          const Icone = ICONES[a.acao] || History;
          return (
            <li key={a.id}>
              <span className={`atividade-icone acao-${a.acao}`}><Icone size={14} /></span>
              <div className="atividade-texto">
                <span><strong>{a.usuario_nome || 'Sistema'}</strong> · {a.descricao}</span>
                <small>{tempoRelativo(a.criado_em)}</small>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
