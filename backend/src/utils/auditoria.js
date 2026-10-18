const AuditoriaModel = require('../models/auditoria.model');

// Registra uma ação na tabela de auditoria (quem fez, o quê e quando).
// Uso "fire and forget": se o registro falhar, só aviso no terminal,
// porque a ação principal (ex.: criar uma escala) já deu certo e não pode falhar por causa disso.
function registrarAuditoria(req, acao, entidade, entidade_id, descricao) {
  AuditoriaModel.registrar({
    usuario_id: req.usuario?.id,
    acao,
    entidade,
    entidade_id,
    descricao,
  }).catch((err) => console.error('⚠️  Falha ao registrar auditoria:', err.message));
}

module.exports = registrarAuditoria;
