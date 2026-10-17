import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatarMoeda } from '../../utils/formatters';

export default function TabelaProfissionais({ profissionais, podeEditar, onEditar, onExcluir }) {
  const colunas = [
    { chave: 'nome', titulo: 'Nome' },
    { chave: 'especialidade', titulo: 'Especialidade', render: (p) => p.especialidade || '—' },
    { chave: 'telefone', titulo: 'Telefone', render: (p) => p.telefone || '—' },
    { chave: 'valor_hora', titulo: 'Valor/hora', render: (p) => formatarMoeda(p.valor_hora) },
    { chave: 'status_disponibilidade', titulo: 'Status', render: (p) => <Badge status={p.status_disponibilidade} /> },
  ];

  if (podeEditar) {
    colunas.push({
      chave: 'acoes', titulo: 'Ações',
      render: (p) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={() => onEditar(p)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => onExcluir(p)}>Excluir</Button>
        </div>
      ),
    });
  }

  return <Table colunas={colunas} dados={profissionais} vazio="Nenhum profissional cadastrado." />;
}
