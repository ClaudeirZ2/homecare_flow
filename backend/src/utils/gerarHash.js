// Uso: node src/utils/gerarHash.js minhaSenha
// Gera um hash bcrypt para colar no seed.sql
const bcrypt = require('bcryptjs');
const senha = process.argv[2] || '123456';
console.log(bcrypt.hashSync(senha, 10));
