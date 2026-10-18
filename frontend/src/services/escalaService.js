import api from './api';

// Todas as chamadas da API de Escalas ficam aqui (as telas não usam o axios direto)
export const escalaService = {
  // filtros: { status, data }. Se o filtro estiver vazio eu nem mando.
  listar: (filtros = {}) => {
    const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v));
    return api.get('/escalas', { params }).then((res) => res.data);
  },
  detalhar: (id) => api.get(`/escalas/${id}`).then((res) => res.data),
  criar: (dados) => api.post('/escalas', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/escalas/${id}`, dados).then((res) => res.data),
  remover: (id) => api.delete(`/escalas/${id}`),
};
