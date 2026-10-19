import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('@homecareflow:usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email, senha) {
    const { usuario, token } = await authService.login(email, senha);
    localStorage.setItem('@homecareflow:token', token);
    localStorage.setItem('@homecareflow:usuario', JSON.stringify(usuario));
    setUsuario(usuario);
    return usuario;
  }

  function logout() {
    localStorage.removeItem('@homecareflow:token');
    localStorage.removeItem('@homecareflow:usuario');
    setUsuario(null);
  }

  // Perfis:
  // - admin: tudo, inclusive excluir/desativar cadastros e ver a auditoria
  // - gestor: operação (cadastros, escalas, financeiro), sem excluir
  // - técnico: só o próprio trabalho (escalas, plantões, prontuários e ganhos dele)
  const ehAdmin = usuario?.tipo === 'admin';
  const ehGestao = ehAdmin || usuario?.tipo === 'gestor';
  const ehTecnico = usuario?.tipo === 'tecnico';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, ehAdmin, ehGestao, ehTecnico }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
