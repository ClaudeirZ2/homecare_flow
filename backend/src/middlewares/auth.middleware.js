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

// Atalhos de perfil que eu uso nas rotas:
// - gestão (admin e gestor): cadastros, escalas e financeiro
// - admin: ações "destrutivas" (excluir/desativar) e auditoria
// - técnico: ações que só quem está no plantão pode fazer (check-in, check-out, prontuário)
const somenteGestao = permitirTipos('admin', 'gestor');
const somenteAdmin = permitirTipos('admin');
const somenteTecnico = permitirTipos('tecnico');

// Diz se quem está logado é técnico (técnico só pode ver os próprios dados)
function ehTecnico(req) {
  return req.usuario?.tipo === 'tecnico';
}

module.exports = { autenticar, permitirTipos, somenteGestao, somenteAdmin, somenteTecnico, ehTecnico };
