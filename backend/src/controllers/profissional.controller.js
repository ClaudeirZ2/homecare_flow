const bcrypt = require('bcryptjs');
const ProfissionalModel = require('../models/profissional.model');

const STATUS_VALIDOS = ['disponivel', 'em_plantao', 'indisponivel'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarProfissional(body) {
  const nome = body.nome?.trim();
  const email = body.email?.trim().toLowerCase();
  if (!nome || !email) return { erro: 'Nome e email são obrigatórios.' };
  if (!EMAIL_REGEX.test(email)) return { erro: 'Email inválido.' };

  const valor_hora = Number(body.valor_hora || 0);
  if (Number.isNaN(valor_hora) || valor_hora < 0) {
    return { erro: 'Valor/hora deve ser um número maior ou igual a zero.' };
  }

  return {
    dados: {
      nome,
      email,
      telefone: body.telefone?.trim() || null,
      especialidade: body.especialidade?.trim() || null,
      valor_hora,
    },
  };
}

const ProfissionalController = {
  async listar(req, res, next) {
    try {
      res.json(await ProfissionalModel.listarTodos());
    } catch (err) {
      next(err);
    }
  },

  async detalhar(req, res, next) {
    try {
      const profissional = await ProfissionalModel.buscarPorId(req.params.id);
      if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado.' });
      res.json(profissional);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/profissionais — já cria o login do técnico junto com o cadastro (uma ação só para o gestor)
  async criar(req, res, next) {
    try {
      const { erro, dados } = validarProfissional(req.body);
      if (erro) return res.status(400).json({ erro });

      const { senha } = req.body;
      if (!senha || senha.length < 6) {
        return res.status(400).json({ erro: 'Informe uma senha inicial com pelo menos 6 caracteres.' });
      }

      const senha_hash = await bcrypt.hash(senha, 10);
      const profissional = await ProfissionalModel.criarComUsuario({ ...dados, senha_hash });
      res.status(201).json(profissional);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/profissionais/:id
  async atualizar(req, res, next) {
    try {
      const existente = await ProfissionalModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Profissional não encontrado.' });

      const { erro, dados } = validarProfissional(req.body);
      if (erro) return res.status(400).json({ erro });

      const status_disponibilidade = req.body.status_disponibilidade || existente.status_disponibilidade;
      if (!STATUS_VALIDOS.includes(status_disponibilidade)) {
        return res.status(400).json({ erro: 'Status de disponibilidade inválido.' });
      }

      res.json(await ProfissionalModel.atualizar(req.params.id, { ...dados, status_disponibilidade }));
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/profissionais/:id/status
  async atualizarStatus(req, res, next) {
    try {
      const { status_disponibilidade } = req.body;
      if (!STATUS_VALIDOS.includes(status_disponibilidade)) {
        return res.status(400).json({ erro: 'Status de disponibilidade inválido.' });
      }
      const profissional = await ProfissionalModel.atualizarStatus(req.params.id, status_disponibilidade);
      if (!profissional) return res.status(404).json({ erro: 'Profissional não encontrado.' });
      res.json(profissional);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/profissionais/:id
  async remover(req, res, next) {
    try {
      const existente = await ProfissionalModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Profissional não encontrado.' });

      await ProfissionalModel.remover(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ProfissionalController;
