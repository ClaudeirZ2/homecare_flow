const express = require('express');
const router = express.Router();
const ProfissionalController = require('../controllers/profissional.controller');
const { autenticar, somenteGestao, somenteAdmin } = require('../middlewares/auth.middleware');

// Dados da equipe (e-mail, telefone, valor da hora) são só da gestão: o técnico não acessa
router.use(autenticar, somenteGestao);

// CRUD completo de Profissionais/Cuidadores (desativar é só para o admin)
router.get('/', ProfissionalController.listar);
router.get('/:id', ProfissionalController.detalhar);
router.post('/', ProfissionalController.criar);
router.put('/:id', ProfissionalController.atualizar);
router.put('/:id/status', ProfissionalController.atualizarStatus);
router.delete('/:id', somenteAdmin, ProfissionalController.remover);

module.exports = router;
