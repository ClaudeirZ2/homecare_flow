const jwt = require('jsonwebtoken');
require('dotenv').config();

// O token carrega o perfil e, para técnicos, o id do profissional vinculado
function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo,
      nome: usuario.nome,
      profissional_id: usuario.profissional_id || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { gerarToken, verificarToken };
