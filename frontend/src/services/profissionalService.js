import api from './api';

// CRUD completo de Profissionais/Cuidadores
export const profissionalService = {
  listar: () => api.get('/profissionais').then((res) => res.data),
  detalhar: (id) => api.get(`/profissionais/${id}`).then((res) => res.data),
  criar: (dados) => api.post('/profissionais', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/profissionais/${id}`, dados).then((res) => res.data),
  remover: (id) => api.delete(`/profissionais/${id}`),
  atualizarStatus: (id, status) =>
    api.put(`/profissionais/${id}/status`, { status_disponibilidade: status }).then((res) => res.data),
};
