import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

// Página 404: quando a pessoa digita um endereço que não existe no sistema
export default function NaoEncontrada() {
  return (
    <div className="pagina-404">
      <Compass size={44} />
      <h1>Página não encontrada</h1>
      <p className="texto-suave">O endereço que você tentou abrir não existe ou foi movido.</p>
      <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> Voltar para o início</Link>
    </div>
  );
}
