import PageHeader from '../components/ui/PageHeader';
import PainelGestao from '../components/dashboard/PainelGestao';
import PainelTecnico from '../components/dashboard/PainelTecnico';
import { useAuth } from '../context/AuthContext';

// Data por extenso no cabeçalho, tipo "sexta-feira, 16 de outubro"
const dataExtenso = () => new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

// Cada perfil tem o seu painel: a gestão vê a operação inteira;
// o técnico vê o dia dele, as próximas escalas e quanto tem a receber.
export default function Dashboard() {
  const { usuario, ehGestao } = useAuth();
  const primeiroNome = usuario?.nome?.split(' ')[0];

  return (
    <>
      <PageHeader
        titulo={ehGestao ? 'Visão Geral' : 'Meu dia'}
        subtitulo={`Olá, ${primeiroNome}. Hoje é ${dataExtenso()}.`}
      />
      {ehGestao ? <PainelGestao /> : <PainelTecnico />}
    </>
  );
}
