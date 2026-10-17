const express = require('express');
const router = express.Router();
const ProfissionalController = require('../controllers/profissional.controller');
const { autenticar, somenteGestao } = require('../middlewares/auth.middleware');

router.use(autenticar);

// CRUD completo de Profissionais/Cuidadores (escrita restrita a admin/gestor)
router.get('/', ProfissionalController.listar);
router.get('/:id', ProfissionalController.detalhar);
router.post('/', somenteGestao, ProfissionalController.criar);
router.put('/:id', somenteGestao, ProfissionalController.atualizar);
router.put('/:id/status', somenteGestao, ProfissionalController.atualizarStatus);
router.delete('/:id', somenteGestao, ProfissionalController.remover);

module.exports = router;
