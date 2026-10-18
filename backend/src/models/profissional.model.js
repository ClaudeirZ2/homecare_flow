const { pool } = require('../config/db');
const UsuarioModel = require('./usuario.model');

const CAMPOS = `p.id, p.usuario_id, p.especialidade, p.valor_hora, p.status_disponibilidade, p.criado_em,
                u.nome, u.email, u.telefone`;

const ProfissionalModel = {
  async listarTodos() {
    const [rows] = await pool.query(
      `SELECT ${CAMPOS}
       FROM profissionais p
       JOIN usuarios u ON u.id = p.usuario_id
       WHERE p.ativo = TRUE
       ORDER BY u.nome ASC`
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT ${CAMPOS}
       FROM profissionais p
       JOIN usuarios u ON u.id = p.usuario_id
       WHERE p.id = ? AND p.ativo = TRUE`,
      [id]
    );
    return rows[0];
  },

  // Cadastro do profissional em duas tabelas: primeiro o usuário (login) e depois o profissional.
  // Uso transação para não sobrar um usuário sem profissional se der erro no meio.
  async criarComUsuario({ nome, email, senha_hash, telefone, especialidade, valor_hora }) {
    const conn = await pool.getConnection();
    let profissionalId;
    try {
      await conn.beginTransaction();
      const usuario_id = await UsuarioModel.criar(
        { nome, email, senha_hash, tipo: 'tecnico', telefone },
        conn
      );
      const [result] = await conn.query(
        'INSERT INTO profissionais (usuario_id, especialidade, valor_hora) VALUES (?, ?, ?)',
        [usuario_id, especialidade, valor_hora]
      );
      profissionalId = result.insertId;
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    return this.buscarPorId(profissionalId);
  },

  async atualizar(id, { nome, email, telefone, especialidade, valor_hora, status_disponibilidade }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        `UPDATE usuarios u JOIN profissionais p ON p.usuario_id = u.id
         SET u.nome = ?, u.email = ?, u.telefone = ?
         WHERE p.id = ?`,
        [nome, email, telefone, id]
      );
      await conn.query(
        `UPDATE profissionais SET especialidade = ?, valor_hora = ?, status_disponibilidade = ?
         WHERE id = ?`,
        [especialidade, valor_hora, status_disponibilidade, id]
      );
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    return this.buscarPorId(id);
  },

  async atualizarStatus(id, status_disponibilidade) {
    await pool.query(
      'UPDATE profissionais SET status_disponibilidade = ? WHERE id = ?',
      [status_disponibilidade, id]
    );
    return this.buscarPorId(id);
  },

  // "Excluir" aqui é desativar: os plantões e pagamentos antigos continuam no histórico,
  // o login fica bloqueado e as escalas futuras são canceladas.
  async remover(id) {
    await pool.query('UPDATE profissionais SET ativo = FALSE WHERE id = ?', [id]);
    await pool.query(
      'UPDATE usuarios u JOIN profissionais p ON p.usuario_id = u.id SET u.ativo = FALSE WHERE p.id = ?',
      [id]
    );
    await pool.query(
      "UPDATE escalas SET status = 'cancelado' WHERE profissional_id = ? AND status = 'agendado'",
      [id]
    );
  },
};

module.exports = ProfissionalModel;
