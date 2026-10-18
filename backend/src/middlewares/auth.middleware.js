const { verificarToken } = require('../utils/jwt');

// Esse middleware roda antes das rotas protegidas.
// Ele procura o token no cabeçalho Authorization (formato: Bearer <token>) e valida.
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const [tipo, token] = authHeader.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Formato do token inválido.' });
  }

  try {
    const dadosUsuario = verificarToken(token);
    req.usuario = dadosUsuario; // guardo o usuário na requisição para usar nos controllers
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

// Libera a rota só para alguns perfis. Exemplo: permitirTipos('admin', 'gestor')
function permitirTipos(...tiposPermitidos) {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: 'Acesso não autorizado para este perfil.' });
    }
    next();
  };
}

// Atalho que eu uso muito nas rotas: só admin e gestor
const somenteGestao = permitirTipos('admin', 'gestor');

// Diz se quem está logado é técnico (técnico só pode ver os próprios dados)
function ehTecnico(req) {
  return req.usuario?.tipo === 'tecnico';
}

module.exports = { autenticar, permitirTipos, somenteGestao, ehTecnico };
