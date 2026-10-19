const express = require('express');
const router = express.Router();
const AuditoriaModel = require('../models/auditoria.model');
const { autenticar, somenteAdmin } = require('../middlewares/auth.middleware');

// GET /api/auditoria?limite=10 — últimas ações do sistema (só o admin, que responde pela segurança)
router.get('/', autenticar, somenteAdmin, async (req, res, next) => {
  try {
    const limite = Math.min(Math.max(Number(req.query.limite) || 10, 1), 100);
    res.json(await AuditoriaModel.listarRecentes(limite));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
