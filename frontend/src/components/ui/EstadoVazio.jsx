import { Inbox } from 'lucide-react';

// O que aparece quando uma lista não tem nada
export default function EstadoVazio({ titulo, descricao, icone: Icone = Inbox }) {
  return (
    <div className="vazio painel">
      <Icone size={28} />
      <strong>{titulo}</strong>
      {descricao && <span>{descricao}</span>}
    </div>
  );
}
