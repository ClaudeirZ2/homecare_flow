import api from './api';

export const plantaoService = {
  // Gestão recebe todos os plantões; técnico recebe apenas os próprios
  listar: () => api.get('/plantoes').then((res) => res.data),
  checkin: (dados) => api.post('/plantoes/checkin', dados).then((res) => res.data),
  checkout: (id, coords) => api.put(`/plantoes/${id}/checkout`, coords).then((res) => res.data),
  listarPorProfissional: (id) => api.get(`/plantoes/profissional/${id}`).then((res) => res.data),
};
