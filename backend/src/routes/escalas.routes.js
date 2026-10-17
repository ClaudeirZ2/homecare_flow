const express = require('express');
const router = express.Router();
const EscalaController = require('../controllers/escala.controller');
const { autenticar, somenteGestao } = require('../middlewares/auth.middleware');

router.use(autenticar);

// CRUD completo de Escalas (requisito obrigatório do projeto)
// Leitura: todos os perfis (técnico vê só as próprias). Escrita: admin/gestor.
router.get('/', EscalaController.listar);
router.get('/:id', EscalaController.detalhar);
router.post('/', somenteGestao, EscalaController.criar);
router.put('/:id', somenteGestao, EscalaController.atualizar);
router.delete('/:id', somenteGestao, EscalaController.remover);

module.exports = router;
