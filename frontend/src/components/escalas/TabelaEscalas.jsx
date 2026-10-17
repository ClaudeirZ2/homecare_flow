import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatarData, rotulo } from '../../utils/formatters';

// Tabela de escalas; as ações de editar/excluir só aparecem para a gestão
export default function TabelaEscalas({ escalas, podeEditar, onEditar, onExcluir }) {
  const colunas = [
    { chave: 'data_prevista', titulo: 'Data', render: (e) => formatarData(e.data_prevista) },
    { chave: 'paciente_nome', titulo: 'Paciente' },
    { chave: 'profissional_nome', titulo: 'Profissional' },
    { chave: 'turno', titulo: 'Turno', render: (e) => rotulo(e.turno) },
    { chave: 'status', titulo: 'Status', render: (e) => <Badge status={e.status} /> },
  ];

  if (podeEditar) {
    colunas.push({
      chave: 'acoes', titulo: 'Ações',
      render: (e) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={() => onEditar(e)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => onExcluir(e)}>Excluir</Button>
        </div>
      ),
    });
  }

  return <Table colunas={colunas} dados={escalas} vazio="Nenhuma escala encontrada." />;
}
