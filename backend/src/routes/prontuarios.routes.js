const express = require('express');
const router = express.Router();
const ProntuarioController = require('../controllers/prontuario.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.post('/', ProntuarioController.criar);
router.get('/paciente/:id', ProntuarioController.listarPorPaciente);

module.exports = router;
