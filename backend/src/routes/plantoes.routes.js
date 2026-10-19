const express = require('express');
const router = express.Router();
const PlantaoController = require('../controllers/plantao.controller');
const { autenticar, somenteTecnico } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.get('/', PlantaoController.listar);
// Check-in e check-out são a "prova de presença": só o próprio técnico faz, nos plantões dele.
// A gestão acompanha (consulta), mas não registra presença no lugar de ninguém.
router.post('/checkin', somenteTecnico, PlantaoController.checkin);
router.put('/:id/checkout', somenteTecnico, PlantaoController.checkout);
router.get('/profissional/:id', PlantaoController.listarPorProfissional);
router.get('/:id', PlantaoController.detalhar);

module.exports = router;
