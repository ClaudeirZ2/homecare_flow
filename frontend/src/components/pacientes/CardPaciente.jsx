import { MapPin, Phone, QrCode, Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const iniciais = (nome = '') => nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

// Card de cada paciente com endereço, contato, código do QR e os botões de editar/excluir
export default function CardPaciente({ paciente, podeEditar, onEditar, onExcluir }) {
  return (
    <article className="card paciente-card">
      <div className="paciente-topo">
        <span className="paciente-avatar">{iniciais(paciente.nome)}</span>
        <div>
          <h3 className="paciente-nome">{paciente.nome}</h3>
          <span className="texto-suave">{paciente.idade ? `${paciente.idade} anos` : 'Idade não informada'}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <p className="info-linha"><MapPin size={14} /> {paciente.endereco || 'Endereço não informado'}</p>
        <p className="info-linha"><Phone size={14} /> {paciente.responsavel_contato || 'Sem responsável cadastrado'}</p>
      </div>

      <div className="card-rodape">
        <span className="info-linha" title="Código do QR Code fixado na residência">
          <QrCode size={14} /> <code>{paciente.qr_code_id}</code>
        </span>
        {podeEditar && (
          <div className="acoes">
            <Button size="sm" variant="ghost" icone={Pencil} titulo="Editar" onClick={() => onEditar(paciente)} />
            <Button size="sm" variant="ghost-danger" icone={Trash2} titulo="Excluir" onClick={() => onExcluir(paciente)} />
          </div>
        )}
      </div>
    </article>
  );
}
