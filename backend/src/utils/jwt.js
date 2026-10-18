const jwt = require('jsonwebtoken');
require('dotenv').config();

// Coloco no token o id, o perfil e, se for técnico, o id do profissional.
// Assim as rotas sabem quem está chamando sem ir no banco toda vez.
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
