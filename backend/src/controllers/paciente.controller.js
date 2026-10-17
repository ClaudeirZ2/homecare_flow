const crypto = require('crypto');
const PacienteModel = require('../models/paciente.model');

// Valida e normaliza os campos enviados pelo formulário
function validarPaciente(body) {
  const nome = body.nome?.trim();
  if (!nome) return { erro: 'Nome é obrigatório.' };

  let idade = null;
  if (body.idade !== undefined && body.idade !== null && body.idade !== '') {
    idade = Number(body.idade);
    // O projeto não atende menores de 18 anos (restrição do edital)
    if (!Number.isInteger(idade) || idade < 18 || idade > 130) {
      return { erro: 'A idade deve ser um número inteiro entre 18 e 130.' };
    }
  }

  return {
    dados: {
      nome,
      idade,
      endereco: body.endereco?.trim() || null,
      responsavel_contato: body.responsavel_contato?.trim() || null,
      observacoes_gerais: body.observacoes_gerais?.trim() || null,
    },
  };
}

const PacienteController = {
  async listar(req, res, next) {
    try {
      res.json(await PacienteModel.listarTodos());
    } catch (err) {
      next(err);
    }
  },

  async detalhar(req, res, next) {
    try {
      const paciente = await PacienteModel.buscarPorId(req.params.id);
      if (!paciente) return res.status(404).json({ erro: 'Paciente não encontrado.' });
      res.json(paciente);
    } catch (err) {
      next(err);
    }
  },

  async criar(req, res, next) {
    try {
      const { erro, dados } = validarPaciente(req.body);
      if (erro) return res.status(400).json({ erro });

      // Identificador único do QR Code fixado na residência do paciente
      const qr_code_id = `QR-PAC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      const paciente = await PacienteModel.criar({ ...dados, qr_code_id });
      res.status(201).json(paciente);
    } catch (err) {
      next(err);
    }
  },

  async atualizar(req, res, next) {
    try {
      const existente = await PacienteModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Paciente não encontrado.' });

      const { erro, dados } = validarPaciente(req.body);
      if (erro) return res.status(400).json({ erro });

      res.json(await PacienteModel.atualizar(req.params.id, dados));
    } catch (err) {
      next(err);
    }
  },

  async remover(req, res, next) {
    try {
      const existente = await PacienteModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Paciente não encontrado.' });

      await PacienteModel.remover(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = PacienteController;
