const { pool } = require('../config/db');

const UsuarioModel = {
  // Já trago o profissional_id junto (se o usuário for técnico), porque preciso dele no token
  async buscarPorEmail(email) {
    const [rows] = await pool.query(
      `SELECT u.*, p.id AS profissional_id
       FROM usuarios u
       LEFT JOIN profissionais p ON p.usuario_id = u.id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  },

  async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.nome, u.email, u.tipo, u.telefone, u.criado_em, p.id AS profissional_id
       FROM usuarios u
       LEFT JOIN profissionais p ON p.usuario_id = u.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  },

  // O parâmetro conn é para conseguir usar esse método dentro de uma transação
  async criar({ nome, email, senha_hash, tipo, telefone }, conn = pool) {
    const [result] = await conn.query(
      'INSERT INTO usuarios (nome, email, senha_hash, tipo, telefone) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senha_hash, tipo || 'tecnico', telefone || null]
    );
    return result.insertId;
  },
};

module.exports = UsuarioModel;
