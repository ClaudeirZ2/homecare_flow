const { pool } = require('../config/db');

const ProntuarioModel = {
  async criar({
    plantao_id,
    pressao_arterial,
    frequencia_cardiaca,
    temperatura,
    saturacao_oxigenio,
    medicacao_administrada,
    intercorrencias,
    observacoes,
  }) {
    const [result] = await pool.query(
      `INSERT INTO prontuarios
         (plantao_id, pressao_arterial, frequencia_cardiaca, temperatura, saturacao_oxigenio,
          medicacao_administrada, intercorrencias, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plantao_id,
        pressao_arterial,
        frequencia_cardiaca,
        temperatura,
        saturacao_oxigenio,
        medicacao_administrada,
        intercorrencias,
        observacoes,
      ]
    );
    const [rows] = await pool.query('SELECT * FROM prontuarios WHERE id = ?', [result.insertId]);
    return rows[0];
  },

  // Histórico completo de um paciente, do mais recente para o mais antigo
  async listarPorPaciente(paciente_id) {
    const [rows] = await pool.query(
      `SELECT pr.*, pl.checkin_hora, pl.checkout_hora, u.nome AS profissional_nome
       FROM prontuarios pr
       JOIN plantoes pl ON pl.id = pr.plantao_id
       JOIN profissionais prof ON prof.id = pl.profissional_id
       JOIN usuarios u ON u.id = prof.usuario_id
       WHERE pl.paciente_id = ?
       ORDER BY pr.criado_em DESC`,
      [paciente_id]
    );
    return rows;
  },
};

module.exports = ProntuarioModel;
