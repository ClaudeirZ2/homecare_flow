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

  async criar({ nome, idade, endereco, qr_code_id, responsavel_contato, observacoes_gerais }) {
    const [result] = await pool.query(
      `INSERT INTO pacientes (nome, idade, endereco, qr_code_id, responsavel_contato, observacoes_gerais)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, idade, endereco, qr_code_id, responsavel_contato, observacoes_gerais]
    );
    return this.buscarPorId(result.insertId);
  },

  async atualizar(id, { nome, idade, endereco, responsavel_contato, observacoes_gerais }) {
    await pool.query(
      `UPDATE pacientes SET nome = ?, idade = ?, endereco = ?, responsavel_contato = ?, observacoes_gerais = ?
       WHERE id = ?`,
      [nome, idade, endereco, responsavel_contato, observacoes_gerais, id]
    );
    return this.buscarPorId(id);
  },

  async remover(id) {
    // Soft delete: mantém o histórico de atendimentos intacto
    await pool.query('UPDATE pacientes SET ativo = FALSE WHERE id = ?', [id]);
    // Escalas futuras deste paciente deixam de fazer sentido
    await pool.query(
      "UPDATE escalas SET status = 'cancelado' WHERE paciente_id = ? AND status = 'agendado'",
      [id]
    );
  },
};

module.exports = PacienteModel;
