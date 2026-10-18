import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { opcoes } from '../../utils/formatters';

const TURNOS = opcoes('manha', 'tarde', 'noite', '12x36');
const STATUS = opcoes('agendado', 'em_andamento', 'concluido', 'cancelado');

const VAZIO = { profissional_id: '', paciente_id: '', data_prevista: '', turno: '', status: 'agendado', observacoes: '' };

// O mesmo formulário serve para criar e para editar:
// se receber uma escala, preenche os campos; se vier null, começa vazio.
export default function FormularioEscala({ escala, pacientes, profissionais, salvando, onSalvar, onCancelar }) {
  const [form, setForm] = useState(VAZIO);

  useEffect(() => {
    if (escala) {
      setForm({
        profissional_id: escala.profissional_id,
        paciente_id: escala.paciente_id,
        data_prevista: escala.data_prevista?.slice(0, 10) || '',
        turno: escala.turno,
        status: escala.status,
        observacoes: escala.observacoes || '',
      });
    } else {
      setForm(VAZIO);
    }
  }, [escala]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSalvar(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Paciente" name="paciente_id" value={form.paciente_id} onChange={handleChange} required
        options={pacientes.map((p) => ({ value: p.id, label: p.nome }))} />
      <Input label="Profissional" name="profissional_id" value={form.profissional_id} onChange={handleChange} required
        options={profissionais.map((p) => ({ value: p.id, label: `${p.nome} — ${p.especialidade || 'sem especialidade'}` }))} />
      <div className="form-grid">
        <Input label="Data" name="data_prevista" type="date" value={form.data_prevista} onChange={handleChange} required />
        <Input label="Turno" name="turno" value={form.turno} onChange={handleChange} required options={TURNOS} />
      </div>
      {escala && <Input label="Status" name="status" value={form.status} onChange={handleChange} options={STATUS} />}
      <Input label="Observações" name="observacoes" type="textarea" value={form.observacoes} onChange={handleChange}
        placeholder="Ex.: levar material de curativo, paciente com restrição alimentar..." />

      <div className="form-acoes">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" carregando={salvando}>{escala ? 'Salvar alterações' : 'Criar escala'}</Button>
      </div>
    </form>
  );
}
