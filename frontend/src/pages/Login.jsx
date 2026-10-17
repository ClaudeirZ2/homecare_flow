import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mensagemDeErro } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/layout/Logo';
import logoIcone from '../assets/logo-icone.png';

const BENEFICIOS = [
  'Escalas e plantões organizados em um só lugar',
  'Ponto digital com GPS ou QR Code da residência',
  'Prontuário padronizado a cada atendimento',
  'Pagamento calculado sobre as horas reais trabalhadas',
];

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
    <div className="login">
      <aside className="login-lateral">
        <div className="marca">
          <img src={logoIcone} alt="" width={40} height={40} />
          <span className="marca-nome">HOME CARE <em>FLOW</em></span>
        </div>
        <div>
          <h2>Gestão do cuidado domiciliar, do plantão ao pagamento.</h2>
          <p>Mais organização para gestores e mais transparência para quem cuida.</p>
          <ul className="login-beneficios">
            {BENEFICIOS.map((b) => <li key={b}><CheckCircle2 size={18} /> {b}</li>)}
          </ul>
        </div>
        <p className="login-rodape">© {new Date().getFullYear()} Home Care Flow</p>
      </aside>

      <main className="login-form-area">
        <form onSubmit={handleSubmit} className="login-form">
          <Logo variante="completa" />
          <h1>Acesse sua conta</h1>
          <p className="texto-suave" style={{ marginBottom: 24 }}>Informe seu e-mail e senha para continuar.</p>

          {erro && <div className="login-erro" role="alert"><AlertCircle size={16} /> {erro}</div>}

          <Input label="E-mail" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@empresa.com" required />
          <Input label="Senha" type="password" name="senha" value={senha} onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••" required />
          <Button type="submit" carregando={entrando} bloco>Entrar</Button>

          {import.meta.env.DEV && (
            <div className="login-demo">
              <strong>Ambiente de demonstração</strong> · senha <code>123456</code><br />
              Gestão: admin@homecareflow.com<br />
              Técnica: juliana@homecareflow.com
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
