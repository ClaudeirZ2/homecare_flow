import { useState } from 'react';
import { KeyRound, Mail, Phone, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/authService';
import { mensagemDeErro } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { rotulo } from '../utils/formatters';

const VAZIO = { senhaAtual: '', novaSenha: '', confirmacao: '' };
const iniciais = (nome = '') => nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

// Dados de quem está logado e troca de senha
export default function MeuPerfil() {
  const { usuario } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(VAZIO);
  const [salvando, setSalvando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function trocarSenha(e) {
    e.preventDefault();
    if (form.novaSenha !== form.confirmacao) {
      toast.erro('A confirmação não é igual à nova senha.');
      return;
    }
    setSalvando(true);
    try {
      await authService.alterarSenha(form.senhaAtual, form.novaSenha);
      toast.sucesso('Senha alterada com sucesso.');
      setForm(VAZIO);
    } catch (err) {
      toast.erro(mensagemDeErro(err, 'Não foi possível alterar a senha.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <PageHeader titulo="Meu perfil" subtitulo="Seus dados de acesso e segurança da conta." />

      <div className="grid-2">
        <div className="painel perfil-cartao">
          <span className="avatar avatar-grande">{iniciais(usuario?.nome)}</span>
          <h2>{usuario?.nome}</h2>
          <span className="badge badge-azul">{rotulo(usuario?.tipo)}</span>
          <div className="perfil-dados">
            <p className="info-linha"><Mail size={14} /> {usuario?.email}</p>
            <p className="info-linha"><Phone size={14} /> {usuario?.telefone || 'Telefone não informado'}</p>
            <p className="info-linha"><ShieldCheck size={14} /> Senha guardada com criptografia (bcrypt)</p>
          </div>
        </div>

        <form className="painel" onSubmit={trocarSenha}>
          <div className="painel-cabecalho">
            <h3 className="painel-titulo">Trocar senha</h3>
          </div>
          <Input label="Senha atual" name="senhaAtual" type="password" value={form.senhaAtual} onChange={handleChange} required />
          <Input label="Nova senha" name="novaSenha" type="password" value={form.novaSenha} onChange={handleChange} required
            ajuda="Mínimo de 6 caracteres." />
          <Input label="Confirme a nova senha" name="confirmacao" type="password" value={form.confirmacao} onChange={handleChange} required />
          <div className="form-acoes">
            <Button type="submit" icone={KeyRound} carregando={salvando}>Salvar nova senha</Button>
          </div>
        </form>
      </div>
    </>
  );
}
