const { pool } = require('../config/db');

const AuditoriaModel = {
  async registrar({ usuario_id, acao, entidade, entidade_id, descricao }) {
    await pool.query(
      `INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, descricao)
       VALUES (?, ?, ?, ?, ?)`,
      [usuario_id || null, acao, entidade, entidade_id || null, descricao ? String(descricao).slice(0, 255) : null]
    );
  },

  // Últimas ações com o nome de quem fez (para o painel da gestão)
  async listarRecentes(limite = 10) {
    const [rows] = await pool.query(
      `SELECT a.id, a.acao, a.entidade, a.entidade_id, a.descricao, a.criado_em,
              u.nome AS usuario_nome, u.tipo AS usuario_tipo
       FROM auditoria a
       LEFT JOIN usuarios u ON u.id = a.usuario_id
       ORDER BY a.criado_em DESC, a.id DESC
       LIMIT ?`,
      [limite]
    );
    return rows;
  },
};

module.exports = AuditoriaModel;
