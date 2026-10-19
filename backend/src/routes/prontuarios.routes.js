const express = require('express');
const router = express.Router();
const ProntuarioController = require('../controllers/prontuario.controller');
const { autenticar, somenteTecnico } = require('../middlewares/auth.middleware');

router.use(autenticar);

// Quem registra o prontuário é quem fez o plantão; a gestão só consulta
router.post('/', somenteTecnico, ProntuarioController.criar);
router.get('/paciente/:id', ProntuarioController.listarPorPaciente);

module.exports = router;
