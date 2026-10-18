const mysql = require('mysql2/promise');
const { opcoesConexao, FUSO_MYSQL } = require('./opcoesConexao');

// Uso um pool de conexões: ele reaproveita as conexões abertas
// em vez de abrir e fechar uma nova a cada requisição (fica bem mais rápido).
const pool = mysql.createPool({
  ...opcoesConexao,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Toda conexão nova do pool já começa no horário de Brasília
pool.pool.on('connection', (conexao) => {
  conexao.query(`SET time_zone = '${FUSO_MYSQL}'`);
});

// Chamo essa função quando o servidor sobe, só para ver no terminal se o banco respondeu
async function testarConexao() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso.');
    conn.release();
  } catch (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
  }
}

module.exports = { pool, testarConexao };
