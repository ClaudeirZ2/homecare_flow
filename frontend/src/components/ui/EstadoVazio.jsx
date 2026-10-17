import { Inbox } from 'lucide-react';

// Mensagem padrão para listas vazias
export default function EstadoVazio({ titulo, descricao, icone: Icone = Inbox }) {
  return (
    <div className="vazio painel">
      <Icone size={28} />
      <strong>{titulo}</strong>
      {descricao && <span>{descricao}</span>}
    </div>
  );
}
