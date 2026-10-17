import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

// Notificações rápidas de sucesso/erro, disponíveis em qualquer tela via useToast()
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remover = useCallback((id) => {
    setToasts((lista) => lista.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback((mensagem, tipo) => {
    const id = Date.now() + Math.random();
    setToasts((lista) => [...lista, { id, mensagem, tipo }].slice(-3)); // no máximo 3 avisos na tela
    setTimeout(() => remover(id), 4000);
  }, [remover]);

  const toast = useMemo(() => ({
    sucesso: (msg) => mostrar(msg, 'sucesso'),
    erro: (msg) => mostrar(msg, 'erro'),
  }), [mostrar]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-area">
        {toasts.map((t) => (
          <Toast key={t.id} tipo={t.tipo} mensagem={t.mensagem} onFechar={() => remover(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
