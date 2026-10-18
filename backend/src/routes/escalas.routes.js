const express = require('express');
const router = express.Router();
const EscalaController = require('../controllers/escala.controller');
const { autenticar, somenteGestao } = require('../middlewares/auth.middleware');

router.use(autenticar);

// CRUD completo de Escalas (requisito do projeto)
// Todo mundo logado pode consultar; criar, editar e excluir é só para admin/gestor.
router.get('/', EscalaController.listar);
router.get('/:id', EscalaController.detalhar);
router.post('/', somenteGestao, EscalaController.criar);
router.put('/:id', somenteGestao, EscalaController.atualizar);
router.delete('/:id', somenteGestao, EscalaController.remover);

module.exports = router;
