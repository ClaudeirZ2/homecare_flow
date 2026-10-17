const express = require('express');
const router = express.Router();
const PlantaoController = require('../controllers/plantao.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.use(autenticar);

router.get('/', PlantaoController.listar);
router.post('/checkin', PlantaoController.checkin);
router.put('/:id/checkout', PlantaoController.checkout);
router.get('/profissional/:id', PlantaoController.listarPorProfissional);
router.get('/:id', PlantaoController.detalhar);

module.exports = router;
