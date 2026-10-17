import { Pencil, Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatarData, rotulo } from '../../utils/formatters';

// Tabela de escalas; as ações de editar/excluir só aparecem para a gestão
export default function TabelaEscalas({ escalas, carregando, podeEditar, onEditar, onExcluir }) {
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
    { chave: 'profissional_nome', titulo: 'Profissional' },
    { chave: 'turno', titulo: 'Turno', render: (e) => rotulo(e.turno) },
    { chave: 'status', titulo: 'Status', render: (e) => <Badge status={e.status} /> },
  ];

  if (podeEditar) {
    colunas.push({
      chave: 'acoes', titulo: 'Ações', alinhar: 'right',
      render: (e) => (
        <div className="acoes" style={{ justifyContent: 'flex-end' }}>
          <Button size="sm" variant="ghost" icone={Pencil} titulo="Editar" onClick={() => onEditar(e)} />
          <Button size="sm" variant="ghost-danger" icone={Trash2} titulo="Excluir" onClick={() => onExcluir(e)} />
        </div>
      ),
    });
  }

  return <Table colunas={colunas} dados={escalas} carregando={carregando} vazio="Nenhuma escala encontrada." />;
}
