// Uso: npm run db:setup  (dentro da pasta backend)
// Cria o banco do zero executando database/schema.sql e database/seed.sql,
// sem precisar do cliente de linha de comando do MySQL.
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const PASTA_DB = path.join(__dirname, '..', '..', '..', 'database');

async function executarArquivo(conn, arquivo) {
  const sql = fs.readFileSync(path.join(PASTA_DB, arquivo), 'utf8');
  await conn.query(sql);
  console.log(`✅ ${arquivo} executado.`);
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true, // necessário para rodar o arquivo .sql inteiro
  });

  try {
    await executarArquivo(conn, 'schema.sql');
    await executarArquivo(conn, 'seed.sql');
    console.log('🎉 Banco pronto! Login de teste: admin@homecareflow.com / 123456');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('❌ Falha ao configurar o banco:', err.message);
  process.exit(1);
});
