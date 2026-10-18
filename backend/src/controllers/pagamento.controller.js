const PagamentoModel = require('../models/pagamento.model');
const { ehTecnico } = require('../middlewares/auth.middleware');
const registrarAuditoria = require('../utils/auditoria');

const MES_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const PagamentoController = {
  // GET /api/pagamentos/relatorio/:mes  (ex: /api/pagamentos/relatorio/2026-10)
  // Calcula o fechamento do mês de todos os profissionais e já grava na tabela de pagamentos
  async gerarRelatorioMensal(req, res, next) {
    try {
      const { mes } = req.params;
      if (!MES_REGEX.test(mes)) {
        return res.status(400).json({ erro: 'Mês inválido (use o formato AAAA-MM).' });
      }

      const calculado = await PagamentoModel.calcularMes(mes);
      for (const item of calculado) {
        await PagamentoModel.salvarFechamento({ ...item, mes_referencia: mes });
      }

      res.json(await PagamentoModel.listarPorMes(mes));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/pagamentos/meus?mes=2026-10 — "Meus ganhos" do técnico logado:
  // resumo do mês (calculado na hora) + histórico de fechamentos e se já foram pagos
  async meusGanhos(req, res, next) {
    try {
      const profissional_id = req.usuario.profissional_id;
      if (!profissional_id) {
        return res.status(400).json({ erro: 'Seu usuário não está ligado a um profissional.' });
      }
      const hoje = new Date();
      const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
      const mes = MES_REGEX.test(req.query.mes || '') ? req.query.mes : mesAtual;

      const [resumo, historico] = await Promise.all([
        PagamentoModel.resumoDoMes(profissional_id, mes),
        PagamentoModel.listarPorProfissional(profissional_id),
      ]);
      res.json({ mes, resumo, historico });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/pagamentos/profissional/:id
  async listarPorProfissional(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (ehTecnico(req) && id !== req.usuario.profissional_id) {
        return res.status(403).json({ erro: 'Você só pode visualizar os seus pagamentos.' });
      }
      res.json(await PagamentoModel.listarPorProfissional(id));
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/pagamentos/:id/pagar
  async marcarComoPago(req, res, next) {
    try {
      const pagamento = await PagamentoModel.buscarPorId(req.params.id);
      if (!pagamento) return res.status(404).json({ erro: 'Pagamento não encontrado.' });
      if (pagamento.status === 'pago') {
        return res.status(409).json({ erro: 'Este pagamento já foi registrado como pago.' });
      }

      await PagamentoModel.marcarComoPago(req.params.id);
      registrarAuditoria(req, 'pagou', 'pagamento', pagamento.id,
        `Pagamento de ${pagamento.mes_referencia} (R$ ${Number(pagamento.valor_total).toFixed(2)})`);
      res.json(await PagamentoModel.buscarPorId(req.params.id));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = PagamentoController;
