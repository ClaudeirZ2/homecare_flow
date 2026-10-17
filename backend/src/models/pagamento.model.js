const { pool } = require('../config/db');

const PagamentoModel = {
  // Calcula automaticamente quantos plantões um profissional concluiu em um mês,
  // quantas horas trabalhou e qual o valor total a receber (horas × valor/hora).
  async calcularMes(mes_referencia) {
    const [rows] = await pool.query(
      `SELECT
         prof.id AS profissional_id,
         COUNT(pl.id) AS qtd_plantoes,
         ROUND(SUM(TIMESTAMPDIFF(MINUTE, pl.checkin_hora, pl.checkout_hora) / 60 * prof.valor_hora), 2) AS valor_total
       FROM plantoes pl
       JOIN profissionais prof ON prof.id = pl.profissional_id
       WHERE pl.status = 'finalizado'
         AND DATE_FORMAT(pl.checkin_hora, '%Y-%m') = ?
       GROUP BY prof.id`,
      [mes_referencia]
    );
    return rows;
  },

  // Grava/atualiza o fechamento. Fechamentos já pagos não são recalculados.
  async salvarFechamento({ profissional_id, mes_referencia, qtd_plantoes, valor_total }) {
    await pool.query(
      `INSERT INTO pagamentos (profissional_id, mes_referencia, qtd_plantoes, valor_total)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         qtd_plantoes = IF(status = 'pago', qtd_plantoes, VALUES(qtd_plantoes)),
         valor_total  = IF(status = 'pago', valor_total,  VALUES(valor_total))`,
      [profissional_id, mes_referencia, qtd_plantoes, valor_total]
    );
  },

  // Fechamentos de um mês com dados do profissional e horas trabalhadas
  async listarPorMes(mes_referencia) {
    const [rows] = await pool.query(
      `SELECT pg.*, u.nome AS profissional_nome, prof.valor_hora,
              (SELECT ROUND(SUM(TIMESTAMPDIFF(MINUTE, pl.checkin_hora, pl.checkout_hora)) / 60, 2)
                 FROM plantoes pl
                WHERE pl.profissional_id = pg.profissional_id AND pl.status = 'finalizado'
                  AND DATE_FORMAT(pl.checkin_hora, '%Y-%m') = pg.mes_referencia) AS horas_trabalhadas
       FROM pagamentos pg
       JOIN profissionais prof ON prof.id = pg.profissional_id
       JOIN usuarios u ON u.id = prof.usuario_id
       WHERE pg.mes_referencia = ?
       ORDER BY u.nome ASC`,
      [mes_referencia]
    );
    return rows;
  },

  async listarPorProfissional(profissional_id) {
    const [rows] = await pool.query(
      'SELECT * FROM pagamentos WHERE profissional_id = ? ORDER BY mes_referencia DESC',
      [profissional_id]
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM pagamentos WHERE id = ?', [id]);
    return rows[0];
  },

  async marcarComoPago(id) {
    await pool.query("UPDATE pagamentos SET status = 'pago', pago_em = NOW() WHERE id = ?", [id]);
  },
};

module.exports = PagamentoModel;
