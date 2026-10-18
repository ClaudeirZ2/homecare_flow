const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { autenticar, permitirTipos } = require('../middlewares/auth.middleware');

router.post('/login', AuthController.login);
router.get('/me', autenticar, AuthController.me);
router.put('/senha', autenticar, AuthController.alterarSenha);
router.post('/cadastro', autenticar, permitirTipos('admin'), AuthController.cadastrar);

module.exports = router;
