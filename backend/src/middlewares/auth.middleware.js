const { verificarToken } = require('../utils/jwt');

// Verifica se existe um token válido no header Authorization: Bearer <token>
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
    req.usuario = dadosUsuario; // disponibiliza o usuário logado nas próximas camadas
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

// Restringe uma rota a determinados tipos de usuário (ex: apenas admin/gestor)
function permitirTipos(...tiposPermitidos) {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: 'Acesso não autorizado para este perfil.' });
    }
    next();
  };
}

// Atalho: perfis que administram o sistema
const somenteGestao = permitirTipos('admin', 'gestor');

// true quando o usuário logado é um técnico (vê apenas os próprios dados)
function ehTecnico(req) {
  return req.usuario?.tipo === 'tecnico';
}

module.exports = { autenticar, permitirTipos, somenteGestao, ehTecnico };
