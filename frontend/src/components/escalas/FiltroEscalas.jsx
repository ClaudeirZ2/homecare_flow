import Input from '../ui/Input';
import { opcoes } from '../../utils/formatters';

// Filtros da tela de escalas: status e data
export default function FiltroEscalas({ filtros, onChange }) {
  function handleChange(e) {
    onChange({ ...filtros, [e.target.name]: e.target.value });
  }

  return (
    <div className="barra-filtros">
      <Input label="Status" name="status" value={filtros.status} onChange={handleChange} textoVazio="Todos"
        options={opcoes('agendado', 'em_andamento', 'concluido', 'cancelado')} />
      <Input label="Data" name="data" type="date" value={filtros.data} onChange={handleChange} />
    </div>
  );
}
