import api from './api';

export const authService = {
  login: (email, senha) => api.post('/auth/login', { email, senha }).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  cadastrar: (dados) => api.post('/auth/cadastro', dados).then((res) => res.data),
  alterarSenha: (senhaAtual, novaSenha) => api.put('/auth/senha', { senhaAtual, novaSenha }).then((res) => res.data),
};
