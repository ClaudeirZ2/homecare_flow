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

  // Admin e gestor cuidam dos cadastros, escalas e financeiro. O técnico faz os plantões.
  const ehGestao = usuario?.tipo === 'admin' || usuario?.tipo === 'gestor';

  return (
    <AuthContext.Provider value={{ usuario, login, logout, ehGestao }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
