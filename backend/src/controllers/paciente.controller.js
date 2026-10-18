const crypto = require('crypto');
const PacienteModel = require('../models/paciente.model');
const registrarAuditoria = require('../utils/auditoria');

// Confiro os campos do formulário e já limpo os espaços extras
function validarPaciente(body) {
  const nome = body.nome?.trim();
  if (!nome) return { erro: 'Nome é obrigatório.' };

  let idade = null;
  if (body.idade !== undefined && body.idade !== null && body.idade !== '') {
    idade = Number(body.idade);
    // O edital não permite projeto voltado para menores de 18 anos, então barro aqui também
    if (!Number.isInteger(idade) || idade < 18 || idade > 130) {
      return { erro: 'A idade deve ser um número inteiro entre 18 e 130.' };
    }
  }

  // Localização da casa: opcional, mas se vier tem que vir completa e válida
  const temLat = body.latitude !== undefined && body.latitude !== null && body.latitude !== '';
  const temLng = body.longitude !== undefined && body.longitude !== null && body.longitude !== '';
  if (temLat !== temLng) return { erro: 'Informe latitude e longitude juntas (ou deixe as duas vazias).' };
  const latitude = temLat ? Number(body.latitude) : null;
  const longitude = temLng ? Number(body.longitude) : null;
  if (temLat && (Number.isNaN(latitude) || Math.abs(latitude) > 90 || Number.isNaN(longitude) || Math.abs(longitude) > 180)) {
    return { erro: 'Localização inválida (latitude entre -90 e 90, longitude entre -180 e 180).' };
  }

  return {
    dados: {
      nome,
      idade,
      latitude,
      longitude,
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

      // Gero um código único para o QR Code que fica colado na casa do paciente
      const qr_code_id = `QR-PAC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      const paciente = await PacienteModel.criar({ ...dados, qr_code_id });
      registrarAuditoria(req, 'criou', 'paciente', paciente.id, `Cadastrou o paciente ${paciente.nome}`);
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

      const atualizado = await PacienteModel.atualizar(req.params.id, dados);
      registrarAuditoria(req, 'editou', 'paciente', atualizado.id, `Editou o paciente ${atualizado.nome}`);
      res.json(atualizado);
    } catch (err) {
      next(err);
    }
  },

  async remover(req, res, next) {
    try {
      const existente = await PacienteModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Paciente não encontrado.' });

      await PacienteModel.remover(req.params.id);
      registrarAuditoria(req, 'excluiu', 'paciente', existente.id, `Removeu o paciente ${existente.nome}`);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = PacienteController;
