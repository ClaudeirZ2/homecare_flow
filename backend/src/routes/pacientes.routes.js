const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/paciente.controller');
const { autenticar, somenteGestao } = require('../middlewares/auth.middleware');

router.use(autenticar); // daqui para baixo tudo exige login

// CRUD completo de Pacientes (só admin/gestor podem alterar)
router.get('/', PacienteController.listar);
router.get('/:id', PacienteController.detalhar);
router.post('/', somenteGestao, PacienteController.criar);
router.put('/:id', somenteGestao, PacienteController.atualizar);
router.delete('/:id', somenteGestao, PacienteController.remover);

module.exports = router;
