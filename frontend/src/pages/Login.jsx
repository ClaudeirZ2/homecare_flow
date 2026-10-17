import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mensagemDeErro } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/layout/Logo';

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  // Já logado? Vai direto para o painel
  if (usuario) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEntrando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro(mensagemDeErro(err, 'Falha ao entrar.'));
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="login-fundo">
      <form onSubmit={handleSubmit} className="login-card">
        <Logo tamanho={40} escuro />
        <p className="texto-suave" style={{ margin: '6px 0 24px' }}>Tecnologia e cuidado em harmonia</p>
        <Input label="E-mail" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Senha" type="password" name="senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        {erro && <p style={{ color: 'var(--color-danger)', marginBottom: 12 }}>{erro}</p>}
        <Button type="submit" carregando={entrando} style={{ width: '100%' }}>Entrar</Button>
        {import.meta.env.DEV && (
          <p className="texto-suave" style={{ marginTop: 16 }}>
            Demo: admin@homecareflow.com (gestão) ou juliana@homecareflow.com (técnica) · senha 123456
          </p>
        )}
      </form>
    </div>
  );
}
