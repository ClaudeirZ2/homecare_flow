import api from './api';

// Centraliza todas as chamadas de API relacionadas a Escalas (CRUD completo)
export const escalaService = {
  // filtros opcionais: { status, data } — valores vazios são ignorados
  listar: (filtros = {}) => {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v));
    return api.get('/escalas', { params }).then((res) => res.data);
  },
  detalhar: (id) => api.get(`/escalas/${id}`).then((res) => res.data),
  criar: (dados) => api.post('/escalas', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/escalas/${id}`, dados).then((res) => res.data),
  remover: (id) => api.delete(`/escalas/${id}`),
};
