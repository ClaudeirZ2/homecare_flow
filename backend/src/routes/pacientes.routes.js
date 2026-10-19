const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/paciente.controller');
const { autenticar, somenteGestao, somenteAdmin } = require('../middlewares/auth.middleware');

router.use(autenticar); // daqui para baixo tudo exige login

// CRUD completo de Pacientes
// - consultar: todos (o técnico recebe só os pacientes dele, filtro no controller)
// - cadastrar e editar: admin e gestor
// - remover: só admin
router.get('/', PacienteController.listar);
router.get('/:id', PacienteController.detalhar);
router.post('/', somenteGestao, PacienteController.criar);
router.put('/:id', somenteGestao, PacienteController.atualizar);
router.delete('/:id', somenteAdmin, PacienteController.remover);

module.exports = router;
