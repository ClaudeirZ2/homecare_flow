const { pool } = require('../config/db');

// SELECT base: escala + nomes do paciente/profissional + plantão vinculado (se houver)
const SELECT_ESCALA = `
  SELECT e.id, e.data_prevista, e.turno, e.status, e.observacoes, e.criado_em, e.atualizado_em,
         pac.id AS paciente_id, pac.nome AS paciente_nome, pac.endereco AS paciente_endereco,
         prof.id AS profissional_id, u.nome AS profissional_nome,
         pl.id AS plantao_id, pl.status AS plantao_status
  FROM escalas e
  JOIN pacientes pac ON pac.id = e.paciente_id
  JOIN profissionais prof ON prof.id = e.profissional_id
  JOIN usuarios u ON u.id = prof.usuario_id
  LEFT JOIN plantoes pl ON pl.escala_id = e.id`;

const EscalaModel = {
  // READ (listar; filtros opcionais por profissional, status e data)
  async listarTodas({ profissional_id, status, data } = {}) {
    const condicoes = [];
    const params = [];
    if (profissional_id) { condicoes.push('e.profissional_id = ?'); params.push(profissional_id); }
    if (status) { condicoes.push('e.status = ?'); params.push(status); }
    if (data) { condicoes.push('e.data_prevista = ?'); params.push(data); }

    const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `${SELECT_ESCALA} ${where} ORDER BY e.data_prevista DESC, e.id DESC`,
      params
    );
    return rows;
  },

  // READ (detalhar uma escala)
  async buscarPorId(id) {
    const [rows] = await pool.query(`${SELECT_ESCALA} WHERE e.id = ?`, [id]);
    return rows[0];
  },

  // CREATE
  async criar({ profissional_id, paciente_id, data_prevista, turno, observacoes }) {
    const [result] = await pool.query(
      `INSERT INTO escalas (profissional_id, paciente_id, data_prevista, turno, observacoes)
       VALUES (?, ?, ?, ?, ?)`,
      [profissional_id, paciente_id, data_prevista, turno, observacoes || null]
    );
    return this.buscarPorId(result.insertId);
  },

  // UPDATE
  async atualizar(id, { profissional_id, paciente_id, data_prevista, turno, status, observacoes }) {
    await pool.query(
      `UPDATE escalas
       SET profissional_id = ?, paciente_id = ?, data_prevista = ?, turno = ?, status = ?, observacoes = ?
       WHERE id = ?`,
      [profissional_id, paciente_id, data_prevista, turno, status, observacoes || null, id]
    );
    return this.buscarPorId(id);
  },

  // DELETE
  async remover(id) {
    await pool.query('DELETE FROM escalas WHERE id = ?', [id]);
  },

  // Evita escalar o mesmo profissional duas vezes no mesmo dia/turno
  async existeConflito({ profissional_id, data_prevista, turno, ignorarId = 0 }) {
    const [rows] = await pool.query(
      `SELECT id FROM escalas
       WHERE profissional_id = ? AND data_prevista = ? AND turno = ? AND status <> 'cancelado' AND id <> ?
       LIMIT 1`,
      [profissional_id, data_prevista, turno, ignorarId]
    );
    return rows.length > 0;
  },
};

module.exports = EscalaModel;
