import axios from 'axios';

// Endereço da API. Na Vercel eu configuro VITE_API_URL; no meu PC usa o localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Antes de cada requisição, coloco o token do login no cabeçalho (assim não repito isso em todo lugar)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@homecareflow:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se a API responder 401 (token vencido), limpo a sessão e volto para o login.
// Só não faço isso no próprio /auth/login, senão a mensagem de senha errada some.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const ehLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !ehLogin) {
      localStorage.removeItem('@homecareflow:token');
      localStorage.removeItem('@homecareflow:usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Pega a mensagem de erro que a API mandou (campo "erro"). Se não tiver, usa a padrão.
export function mensagemDeErro(err, padrao = 'Não foi possível concluir a operação.') {
  if (!err.response) return 'Sem conexão com o servidor. Verifique se a API está rodando.';
  return err.response.data?.erro || padrao;
}

export default api;
