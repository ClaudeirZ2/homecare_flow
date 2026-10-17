import api from './api';

export const pacienteService = {
  listar: () => api.get('/pacientes').then((res) => res.data),
  detalhar: (id) => api.get(`/pacientes/${id}`).then((res) => res.data),
  criar: (dados) => api.post('/pacientes', dados).then((res) => res.data),
  atualizar: (id, dados) => api.put(`/pacientes/${id}`, dados).then((res) => res.data),
  remover: (id) => api.delete(`/pacientes/${id}`),
};
