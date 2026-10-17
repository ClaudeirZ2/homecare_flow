const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/paciente.controller');
const { autenticar, somenteGestao } = require('../middlewares/auth.middleware');

router.use(autenticar); // todas as rotas abaixo exigem login

// CRUD completo de Pacientes (escrita restrita a admin/gestor)
router.get('/', PacienteController.listar);
router.get('/:id', PacienteController.detalhar);
router.post('/', somenteGestao, PacienteController.criar);
router.put('/:id', somenteGestao, PacienteController.atualizar);
router.delete('/:id', somenteGestao, PacienteController.remover);

module.exports = router;
