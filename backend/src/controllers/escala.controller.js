const EscalaModel = require('../models/escala.model');
const PacienteModel = require('../models/paciente.model');
const ProfissionalModel = require('../models/profissional.model');
const { ehTecnico } = require('../middlewares/auth.middleware');

const TURNOS = ['manha', 'tarde', 'noite', '12x36'];
const STATUS = ['agendado', 'em_andamento', 'concluido', 'cancelado'];
const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Valida os dados da escala e confere se paciente/profissional existem e estão ativos
async function validarEscala(dados) {
  const { profissional_id, paciente_id, data_prevista, turno, status } = dados;

  if (!profissional_id || !paciente_id || !data_prevista || !turno) {
    return 'Paciente, profissional, data e turno são obrigatórios.';
  }
  if (!DATA_REGEX.test(data_prevista) || Number.isNaN(Date.parse(data_prevista))) {
    return 'Data inválida (use o formato AAAA-MM-DD).';
  }
  if (!TURNOS.includes(turno)) return 'Turno inválido.';
  if (status && !STATUS.includes(status)) return 'Status inválido.';

  const [paciente, profissional] = await Promise.all([
    PacienteModel.buscarPorId(paciente_id),
    ProfissionalModel.buscarPorId(profissional_id),
  ]);
  if (!paciente) return 'Paciente não encontrado ou inativo.';
  if (!profissional) return 'Profissional não encontrado ou inativo.';

  return null;
}

const EscalaController = {
  // GET /api/escalas?status=agendado&data=2026-10-16
  // Técnicos enxergam apenas as próprias escalas.
  async listar(req, res, next) {
    try {
      const filtros = { status: req.query.status, data: req.query.data };
      if (ehTecnico(req)) filtros.profissional_id = req.usuario.profissional_id || -1;
      res.json(await EscalaModel.listarTodas(filtros));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/escalas/:id
  async detalhar(req, res, next) {
    try {
      const escala = await EscalaModel.buscarPorId(req.params.id);
      if (!escala) return res.status(404).json({ erro: 'Escala não encontrada.' });
      if (ehTecnico(req) && escala.profissional_id !== req.usuario.profissional_id) {
        return res.status(403).json({ erro: 'Você só pode visualizar as suas escalas.' });
      }
      res.json(escala);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/escalas
  async criar(req, res, next) {
    try {
      const dados = {
        profissional_id: req.body.profissional_id,
        paciente_id: req.body.paciente_id,
        data_prevista: req.body.data_prevista,
        turno: req.body.turno,
        observacoes: req.body.observacoes?.trim(),
      };

      const erro = await validarEscala(dados);
      if (erro) return res.status(400).json({ erro });

      if (await EscalaModel.existeConflito(dados)) {
        return res.status(409).json({ erro: 'Este profissional já possui escala nesta data e turno.' });
      }

      res.status(201).json(await EscalaModel.criar(dados));
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/escalas/:id — campos não enviados mantêm o valor atual
  async atualizar(req, res, next) {
    try {
      const existente = await EscalaModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Escala não encontrada.' });

      const dados = {
        profissional_id: req.body.profissional_id ?? existente.profissional_id,
        paciente_id: req.body.paciente_id ?? existente.paciente_id,
        data_prevista: req.body.data_prevista ?? existente.data_prevista,
        turno: req.body.turno ?? existente.turno,
        status: req.body.status ?? existente.status,
        observacoes: (req.body.observacoes ?? existente.observacoes)?.trim(),
      };

      const erro = await validarEscala(dados);
      if (erro) return res.status(400).json({ erro });

      if (await EscalaModel.existeConflito({ ...dados, ignorarId: existente.id })) {
        return res.status(409).json({ erro: 'Este profissional já possui escala nesta data e turno.' });
      }

      res.json(await EscalaModel.atualizar(req.params.id, dados));
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/escalas/:id
  async remover(req, res, next) {
    try {
      const existente = await EscalaModel.buscarPorId(req.params.id);
      if (!existente) return res.status(404).json({ erro: 'Escala não encontrada.' });

      // Escalas já executadas guardam plantão e prontuário: não podem ser apagadas
      if (existente.plantao_id) {
        return res.status(409).json({
          erro: 'Esta escala já possui plantão registrado. Use o status "cancelado" em vez de excluir.',
        });
      }

      await EscalaModel.remover(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = EscalaController;
