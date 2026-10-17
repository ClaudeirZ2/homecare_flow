import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatarData } from '../../utils/formatters';

const VAZIO = {
  plantao_id: '', pressao_arterial: '', frequencia_cardiaca: '', temperatura: '',
  saturacao_oxigenio: '', medicacao_administrada: '', intercorrencias: '', observacoes: '',
};

// Registro padronizado do plantão. onSalvar deve retornar true quando gravar com sucesso.
export default function FormularioProntuario({ plantoes, salvando, onSalvar }) {
  const [form, setForm] = useState(VAZIO);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    if (await onSalvar(form)) setForm(VAZIO);
  }

  return (
    <form onSubmit={handleSubmit} className="painel">
      <Input label="Plantão" name="plantao_id" value={form.plantao_id} onChange={handleChange} required
        options={plantoes.map((p) => ({
          value: p.id,
          label: `${formatarData(p.data_prevista)} — ${p.paciente_nome}${p.status === 'em_andamento' ? ' (em andamento)' : ''}`,
        }))} />
      <div className="form-grid form-grid-4">
        <Input label="Pressão arterial" name="pressao_arterial" value={form.pressao_arterial} onChange={handleChange} placeholder="12/8" />
        <Input label="Freq. cardíaca (bpm)" name="frequencia_cardiaca" type="number" min={20} max={250} value={form.frequencia_cardiaca} onChange={handleChange} />
        <Input label="Temperatura (°C)" name="temperatura" type="number" step="0.1" min={30} max={45} value={form.temperatura} onChange={handleChange} />
        <Input label="Saturação O₂ (%)" name="saturacao_oxigenio" type="number" min={50} max={100} value={form.saturacao_oxigenio} onChange={handleChange} />
      </div>
      <Input label="Medicação administrada" name="medicacao_administrada" type="textarea" value={form.medicacao_administrada} onChange={handleChange} />
      <Input label="Intercorrências" name="intercorrencias" type="textarea" value={form.intercorrencias} onChange={handleChange} />
      <Input label="Observações" name="observacoes" type="textarea" value={form.observacoes} onChange={handleChange} />
      <Button type="submit" carregando={salvando}>Registrar prontuário</Button>
    </form>
  );
}
