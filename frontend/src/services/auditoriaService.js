import api from './api';

// Histórico de ações do sistema (só a gestão tem acesso)
export const auditoriaService = {
  recentes: (limite = 8) => api.get('/auditoria', { params: { limite } }).then((res) => res.data),
};
