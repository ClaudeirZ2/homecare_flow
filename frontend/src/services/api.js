import axios from 'axios';

// URL da API: configurável via frontend/.env (VITE_API_URL); padrão para desenvolvimento local
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Anexa automaticamente o token JWT salvo no login em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@homecareflow:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o token expirar, limpa a sessão e volta para o login.
// (O próprio /auth/login responde 401 para senha errada — nesse caso não redireciona.)
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

// Extrai a mensagem de erro enviada pela API (campo "erro") ou uma mensagem padrão
export function mensagemDeErro(err, padrao = 'Não foi possível concluir a operação.') {
  if (!err.response) return 'Sem conexão com o servidor. Verifique se a API está rodando.';
  return err.response.data?.erro || padrao;
}

export default api;
