import { Pencil, Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatarMoeda } from '../../utils/formatters';

export default function TabelaProfissionais({ profissionais, carregando, podeEditar, podeExcluir, onEditar, onExcluir }) {
  const colunas = [
    {
      chave: 'nome', titulo: 'Profissional',
      render: (p) => (
        <>
          <span className="celula-principal">{p.nome}</span>
          <span className="celula-sub">{p.email}</span>
        </>
      ),
    },
    { chave: 'especialidade', titulo: 'Especialidade', render: (p) => p.especialidade || '—' },
    { chave: 'telefone', titulo: 'Telefone', render: (p) => p.telefone || '—' },
    { chave: 'valor_hora', titulo: 'Valor/hora', alinhar: 'right', render: (p) => <span className="numero">{formatarMoeda(p.valor_hora)}</span> },
    { chave: 'status_disponibilidade', titulo: 'Disponibilidade', render: (p) => <Badge status={p.status_disponibilidade} /> },
  ];

  if (podeEditar) {
    colunas.push({
      chave: 'acoes', titulo: 'Ações', alinhar: 'right',
      render: (p) => (
        <div className="acoes" style={{ justifyContent: 'flex-end' }}>
          <Button size="sm" variant="ghost" icone={Pencil} titulo="Editar" onClick={() => onEditar(p)} />
          {podeExcluir && (
            <Button size="sm" variant="ghost-danger" icone={Trash2} titulo="Excluir" onClick={() => onExcluir(p)} />
          )}
        </div>
      ),
    });
  }

  return <Table colunas={colunas} dados={profissionais} carregando={carregando} vazio="Nenhum profissional cadastrado." />;
}
