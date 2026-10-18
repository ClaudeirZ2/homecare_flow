const { pool } = require('../config/db');

const SELECT_PLANTAO = `
  SELECT pl.*, pac.nome AS paciente_nome, u.nome AS profissional_nome,
         e.data_prevista, e.turno,
         ROUND(TIMESTAMPDIFF(MINUTE, pl.checkin_hora, pl.checkout_hora) / 60, 2) AS horas_trabalhadas,
         (SELECT COUNT(*) FROM prontuarios pr WHERE pr.plantao_id = pl.id) AS qtd_prontuarios
  FROM plantoes pl
  JOIN escalas e ON e.id = pl.escala_id
  JOIN pacientes pac ON pac.id = pl.paciente_id
  JOIN profissionais prof ON prof.id = pl.profissional_id
  JOIN usuarios u ON u.id = prof.usuario_id`;

// Transação: o check-in mexe em 3 tabelas (plantoes, escalas e profissionais).
// Se uma das queries falhar, desfaço tudo (rollback) para o banco não ficar pela metade.
async function emTransacao(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const resultado = await fn(conn);
    await conn.commit();
    return resultado;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

const PlantaoModel = {
  async buscarPorId(id) {
    const [rows] = await pool.query(`${SELECT_PLANTAO} WHERE pl.id = ?`, [id]);
    return rows[0];
  },

  // Sem filtro traz todos (visão da gestão); com profissional_id traz só os dele
  async listar({ profissional_id } = {}) {
    const where = profissional_id ? 'WHERE pl.profissional_id = ?' : '';
    const [rows] = await pool.query(
      `${SELECT_PLANTAO} ${where} ORDER BY pl.checkin_hora DESC`,
      profissional_id ? [profissional_id] : []
    );
    return rows;
  },

  async listarPorProfissional(profissional_id) {
    return this.listar({ profissional_id });
  },

  // Check-in: cria o plantão com a hora atual e a localização
  async checkin({ escala, lat, lng, metodo, distancia = null }) {
    const id = await emTransacao(async (conn) => {
      const [result] = await conn.query(
        `INSERT INTO plantoes
           (escala_id, profissional_id, paciente_id, checkin_hora, checkin_lat, checkin_lng, checkin_metodo,
            checkin_distancia_m, status)
         VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, 'em_andamento')`,
        [escala.id, escala.profissional_id, escala.paciente_id, lat ?? null, lng ?? null, metodo, distancia]
      );

      // A escala passa para "em andamento" e o profissional fica "em plantão"
      await conn.query("UPDATE escalas SET status = 'em_andamento' WHERE id = ?", [escala.id]);
      await conn.query(
        "UPDATE profissionais SET status_disponibilidade = 'em_plantao' WHERE id = ?",
        [escala.profissional_id]
      );
      return result.insertId;
    });

    return this.buscarPorId(id);
  },

  // Check-out: fecha o plantão e libera o profissional
  async checkout(plantao, { lat, lng }) {
    await emTransacao(async (conn) => {
      await conn.query(
        `UPDATE plantoes
         SET checkout_hora = NOW(), checkout_lat = ?, checkout_lng = ?, status = 'finalizado'
         WHERE id = ?`,
        [lat ?? null, lng ?? null, plantao.id]
      );
      await conn.query("UPDATE escalas SET status = 'concluido' WHERE id = ?", [plantao.escala_id]);
      await conn.query(
        "UPDATE profissionais SET status_disponibilidade = 'disponivel' WHERE id = ?",
        [plantao.profissional_id]
      );
    });

    return this.buscarPorId(plantao.id);
  },
};

module.exports = PlantaoModel;
