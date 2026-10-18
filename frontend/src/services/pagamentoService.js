import api from './api';

export const pagamentoService = {
  gerarRelatorioMensal: (mes) => api.get(`/pagamentos/relatorio/${mes}`).then((res) => res.data),
  listarPorProfissional: (id) => api.get(`/pagamentos/profissional/${id}`).then((res) => res.data),
  marcarComoPago: (id) => api.put(`/pagamentos/${id}/pagar`),
  // "Meus ganhos" do técnico logado: { mes, resumo, historico }
  meusGanhos: (mes) => api.get('/pagamentos/meus', { params: mes ? { mes } : {} }).then((res) => res.data),
};
