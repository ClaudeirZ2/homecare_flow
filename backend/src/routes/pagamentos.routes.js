const express = require('express');
const router = express.Router();
const PagamentoController = require('../controllers/pagamento.controller');
const { autenticar, permitirTipos, somenteTecnico } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.get('/relatorio/:mes', permitirTipos('admin', 'gestor'), PagamentoController.gerarRelatorioMensal);
router.get('/meus', somenteTecnico, PagamentoController.meusGanhos);
router.get('/profissional/:id', PagamentoController.listarPorProfissional);
router.put('/:id/pagar', permitirTipos('admin', 'gestor'), PagamentoController.marcarComoPago);

module.exports = router;
