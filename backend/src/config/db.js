const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexões: mais eficiente que abrir/fechar conexão a cada requisição
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Colunas DATE voltam como texto 'AAAA-MM-DD' (evita o dia "voltar um" por causa do fuso horário)
  dateStrings: ['DATE'],
});

// Testa a conexão ao iniciar o servidor
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
