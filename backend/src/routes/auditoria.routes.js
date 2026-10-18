const express = require('express');
const router = express.Router();
const AuditoriaModel = require('../models/auditoria.model');
const { autenticar, somenteGestao } = require('../middlewares/auth.middleware');

// GET /api/auditoria?limite=10 — últimas ações do sistema (só admin/gestor)
router.get('/', autenticar, somenteGestao, async (req, res, next) => {
  try {
    const limite = Math.min(Math.max(Number(req.query.limite) || 10, 1), 100);
    res.json(await AuditoriaModel.listarRecentes(limite));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
