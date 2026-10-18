// Opções de conexão com o MySQL que eu uso em dois lugares:
// na API (config/db.js) e no script que cria o banco (utils/setupDb.js).
// Deixei tudo aqui para não repetir código.
require('dotenv').config();

// Na nuvem (Aiven) a conexão precisa ser criptografada (SSL).
// No meu computador não precisa, então só ativo quando DB_SSL=true.
function opcoesSsl() {
  if (process.env.DB_SSL !== 'true') return undefined;

  // O Aiven fornece um certificado (CA). Coloquei ele na variável DB_CA_CERT.
  if (process.env.DB_CA_CERT) {
    return { ca: process.env.DB_CA_CERT.replace(/\\n/g, '\n'), rejectUnauthorized: true };
  }

  // Sem o certificado a conexão continua criptografada, mas sem validar o servidor
  console.warn('⚠️  DB_SSL ativo sem DB_CA_CERT: o certificado do servidor não será validado.');
  return { rejectUnauthorized: false };
}

const opcoesConexao = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: opcoesSsl(),
  // Datas do tipo DATE voltam como texto 'AAAA-MM-DD'.
  // Antes eu tinha problema com o fuso: o dia aparecia "um a menos" na tela.
  dateStrings: ['DATE'],
};

// Fuso de Brasília. Os servidores na nuvem usam UTC, e sem isso
// o NOW() do MySQL gravaria o check-in 3 horas adiantado.
const FUSO_MYSQL = process.env.DB_TIMEZONE || '-03:00';

module.exports = { opcoesConexao, FUSO_MYSQL };
