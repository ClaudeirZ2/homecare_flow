import Card from '../ui/Card';
import Button from '../ui/Button';

// Card com os dados principais do paciente e ações de edição/exclusão
export default function CardPaciente({ paciente, podeEditar, onEditar, onExcluir }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{ color: 'var(--color-primary-dark)' }}>{paciente.nome}</h3>
        <span className="texto-suave">{paciente.idade ? `${paciente.idade} anos` : '—'}</span>
      </div>
      <p className="texto-suave" style={{ marginTop: 6 }}>📍 {paciente.endereco || 'Endereço não informado'}</p>
      <p className="texto-suave">📞 {paciente.responsavel_contato || 'Sem responsável cadastrado'}</p>
      <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 6 }}>
        QR Code da residência: <code>{paciente.qr_code_id}</code>
      </p>

      {podeEditar && (
        <div style={{ display: 'flex', gap: 8, marginTop: 'var(--space-md)' }}>
          <Button size="sm" variant="outline" onClick={() => onEditar(paciente)}>Editar</Button>
          <Button size="sm" variant="danger" onClick={() => onExcluir(paciente)}>Excluir</Button>
        </div>
      )}
    </Card>
  );
}
