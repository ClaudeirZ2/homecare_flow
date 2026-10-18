const { pool } = require('../config/db');

const PacienteModel = {
  async listarTodos() {
    const [rows] = await pool.query(
      'SELECT * FROM pacientes WHERE ativo = TRUE ORDER BY nome ASC'
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ? AND ativo = TRUE', [id]);
    return rows[0];
  },

  async criar({ nome, idade, endereco, qr_code_id, responsavel_contato, latitude, longitude, observacoes_gerais }) {
    const [result] = await pool.query(
      `INSERT INTO pacientes (nome, idade, endereco, qr_code_id, responsavel_contato, latitude, longitude, observacoes_gerais)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, idade, endereco, qr_code_id, responsavel_contato, latitude, longitude, observacoes_gerais]
    );
    return this.buscarPorId(result.insertId);
  },

  async atualizar(id, { nome, idade, endereco, responsavel_contato, latitude, longitude, observacoes_gerais }) {
    await pool.query(
      `UPDATE pacientes SET nome = ?, idade = ?, endereco = ?, responsavel_contato = ?,
              latitude = ?, longitude = ?, observacoes_gerais = ?
       WHERE id = ?`,
      [nome, idade, endereco, responsavel_contato, latitude, longitude, observacoes_gerais, id]
    );
    return this.buscarPorId(id);
  },

  async remover(id) {
    // Não apago de verdade (soft delete): só marco como inativo para não perder o histórico
    await pool.query('UPDATE pacientes SET ativo = FALSE WHERE id = ?', [id]);
    // E cancelo as escalas que ainda iam acontecer para esse paciente
    await pool.query(
      "UPDATE escalas SET status = 'cancelado' WHERE paciente_id = ? AND status = 'agendado'",
      [id]
    );
  },
};

module.exports = PacienteModel;
