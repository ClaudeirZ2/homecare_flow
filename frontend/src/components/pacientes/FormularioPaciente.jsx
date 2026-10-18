import { useEffect, useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const VAZIO = { nome: '', idade: '', endereco: '', responsavel_contato: '', observacoes_gerais: '' };

// Formulário para cadastrar ou editar um paciente
export default function FormularioPaciente({ paciente, salvando, onSalvar, onCancelar }) {
  const [form, setForm] = useState(VAZIO);

  useEffect(() => {
    setForm(paciente
      ? {
          nome: paciente.nome,
          idade: paciente.idade ?? '',
          endereco: paciente.endereco || '',
          responsavel_contato: paciente.responsavel_contato || '',
          observacoes_gerais: paciente.observacoes_gerais || '',
        }
      : VAZIO);
  }, [paciente]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    onSalvar(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nome completo" name="nome" value={form.nome} onChange={handleChange} required />
      <div className="form-grid">
        <Input label="Idade" name="idade" type="number" min={18} max={130} value={form.idade} onChange={handleChange}
          ajuda="Atendimento voltado ao público adulto (18+)." />
        <Input label="Contato do responsável" name="responsavel_contato" value={form.responsavel_contato}
          onChange={handleChange} placeholder="Nome - (00) 00000-0000" />
      </div>
      <Input label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />
      <Input label="Observações gerais" name="observacoes_gerais" type="textarea" value={form.observacoes_gerais}
        onChange={handleChange} placeholder="Rotina, restrições, cuidados especiais..." />

      <div className="form-acoes">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" carregando={salvando}>{paciente ? 'Salvar alterações' : 'Cadastrar paciente'}</Button>
      </div>
    </form>
  );
}
