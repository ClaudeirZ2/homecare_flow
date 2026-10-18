// Script para criar o banco do zero: roda o database/schema.sql e depois o database/seed.sql.
// Uso (dentro da pasta backend):  npm run db:setup
// Fiz esse script para não depender do cliente de linha de comando do MySQL
// e para conseguir criar o banco também na nuvem com o mesmo comando.
const fs = require('fs');
const path = require('path');

// Com "--env .env.nuvem" eu uso outro arquivo de configuração (o do banco na nuvem).
// Precisa carregar ANTES do opcoesConexao, porque ele lê as variáveis ao ser importado.
const indiceEnv = process.argv.indexOf('--env');
if (indiceEnv > -1) {
  const arquivo = process.argv[indiceEnv + 1];
  if (!fs.existsSync(arquivo)) {
    console.error(`❌ Arquivo ${arquivo} não encontrado (copie o .env.example e preencha).`);
    process.exit(1);
  }
  require('dotenv').config({ path: arquivo });
  console.log(`ℹ️  Usando as configurações de ${arquivo}`);
}

const mysql = require('mysql2/promise');
const { opcoesConexao, FUSO_MYSQL } = require('../config/opcoesConexao');

const PASTA_DB = path.join(__dirname, '..', '..', '..', 'database');

async function executarArquivo(conn, arquivo) {
  const sql = fs.readFileSync(path.join(PASTA_DB, arquivo), 'utf8');
  await conn.query(sql);
  console.log(`✅ ${arquivo} executado.`);
}

async function main() {
  const conn = await mysql.createConnection({
    ...opcoesConexao,
    multipleStatements: true, // precisa disso para rodar o arquivo .sql inteiro de uma vez
  });

  try {
    // Mesmo fuso da API, para o CURDATE() do seed bater com o dia de hoje no Brasil
    await conn.query(`SET time_zone = '${FUSO_MYSQL}'`);
    await executarArquivo(conn, 'schema.sql');
    await executarArquivo(conn, 'seed.sql');
    console.log('🎉 Banco pronto! Login de teste: admin@homecareflow.com / 123456');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('❌ Falha ao configurar o banco:', err.message);
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('👉 Usuário/senha do MySQL recusados. Confira DB_USER e DB_PASSWORD em backend/.env');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('👉 MySQL não respondeu. Verifique se o serviço MySQL80 está iniciado e a porta DB_PORT.');
  }
  process.exit(1);
});
