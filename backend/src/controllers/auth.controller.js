const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuario.model');
const { gerarToken } = require('../utils/jwt');
const registrarAuditoria = require('../utils/auditoria');

const TIPOS_VALIDOS = ['admin', 'gestor', 'tecnico'];

const AuthController = {
  // POST /api/auth/cadastro
  // Deixei só para o admin: se fosse aberto, qualquer pessoa poderia se cadastrar como administrador.
  async cadastrar(req, res, next) {
    try {
      const { nome, email, senha, tipo, telefone } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
      }
      if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
      }
      if (senha.length < 6) {
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
      }

      const existente = await UsuarioModel.buscarPorEmail(email);
      if (existente) {
        return res.status(409).json({ erro: 'Já existe um usuário com este email.' });
      }

      const senha_hash = await bcrypt.hash(senha, 10);
      const id = await UsuarioModel.criar({ nome, email, senha_hash, tipo, telefone });
      const usuario = await UsuarioModel.buscarPorId(id);

      return res.status(201).json({ usuario });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe email e senha.' });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);

      // Uso a mesma mensagem para email ou senha errados, assim ninguém descobre quais emails existem no sistema
      if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
        return res.status(401).json({ erro: 'Email ou senha inválidos.' });
      }
      if (!usuario.ativo) {
        return res.status(403).json({ erro: 'Usuário desativado. Procure o administrador.' });
      }

      const token = gerarToken(usuario);
      delete usuario.senha_hash;
      registrarAuditoria({ usuario }, 'login', 'usuario', usuario.id, `${usuario.nome} entrou no sistema`);

      return res.json({ usuario, token });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/senha — a própria pessoa troca a senha (precisa informar a senha atual)
  async alterarSenha(req, res, next) {
    try {
      const { senhaAtual, novaSenha } = req.body;
      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ erro: 'Informe a senha atual e a nova senha.' });
      }
      if (novaSenha.length < 6) {
        return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres.' });
      }
      if (novaSenha === senhaAtual) {
        return res.status(400).json({ erro: 'A nova senha precisa ser diferente da atual.' });
      }

      const hashAtual = await UsuarioModel.buscarHashSenha(req.usuario.id);
      if (!hashAtual || !(await bcrypt.compare(senhaAtual, hashAtual))) {
        return res.status(400).json({ erro: 'A senha atual está incorreta.' });
      }

      await UsuarioModel.atualizarSenha(req.usuario.id, await bcrypt.hash(novaSenha, 10));
      registrarAuditoria(req, 'editou', 'usuario', req.usuario.id, 'Alterou a própria senha');
      res.json({ mensagem: 'Senha alterada com sucesso.' });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/me — devolve os dados de quem está logado (pego o id de dentro do token)
  async me(req, res, next) {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.usuario.id);
      if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
