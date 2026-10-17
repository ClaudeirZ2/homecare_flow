import { useEffect, useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { opcoes } from '../../utils/formatters';

const VAZIO = {
  nome: '', email: '', telefone: '', senha: '', especialidade: '', valor_hora: '', status_disponibilidade: 'disponivel',
};

// Criação: gera também o login do profissional (email + senha inicial).
// Edição: senha não é alterada por aqui.
export default function FormularioProfissional({ profissional, salvando, onSalvar, onCancelar }) {
  const [form, setForm] = useState(VAZIO);

  useEffect(() => {
    setForm(profissional
      ? {
          ...VAZIO,
          nome: profissional.nome,
          email: profissional.email,
          telefone: profissional.telefone || '',
          especialidade: profissional.especialidade || '',
          valor_hora: profissional.valor_hora ?? '',
          status_disponibilidade: profissional.status_disponibilidade,
        }
      : VAZIO);
  }, [profissional]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    const { senha, ...resto } = form;
    onSalvar(profissional ? resto : form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Nome completo" name="nome" value={form.nome} onChange={handleChange} required />
      <div className="form-grid">
        <Input label="E-mail (login)" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
      </div>
      {!profissional && (
        <Input label="Senha inicial" name="senha" type="password" value={form.senha} onChange={handleChange} required
          ajuda="Mínimo de 6 caracteres. O profissional usará para entrar no sistema." />
      )}
      <div className="form-grid">
        <Input label="Especialidade" name="especialidade" value={form.especialidade} onChange={handleChange}
          placeholder="Técnico(a) de enfermagem, cuidador(a)..." />
        <Input label="Valor/hora (R$)" name="valor_hora" type="number" min={0} step="0.01" value={form.valor_hora}
          onChange={handleChange} required />
      </div>
      {profissional && (
        <Input label="Disponibilidade" name="status_disponibilidade" value={form.status_disponibilidade}
          onChange={handleChange} options={opcoes('disponivel', 'em_plantao', 'indisponivel')} />
      )}

      <div className="form-acoes">
        <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" carregando={salvando}>{profissional ? 'Salvar alterações' : 'Cadastrar profissional'}</Button>
      </div>
    </form>
  );
}
