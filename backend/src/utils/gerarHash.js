// Uso: node src/utils/gerarHash.js minhaSenha
// Gera o hash bcrypt de uma senha. Usei para criar as senhas do seed.sql.
const bcrypt = require('bcryptjs');
const senha = process.argv[2] || '123456';
console.log(bcrypt.hashSync(senha, 10));
