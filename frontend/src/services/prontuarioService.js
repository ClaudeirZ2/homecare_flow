import api from './api';

export const prontuarioService = {
  criar: (dados) => api.post('/prontuarios', dados).then((res) => res.data),
  listarPorPaciente: (id) => api.get(`/prontuarios/paciente/${id}`).then((res) => res.data),
};
