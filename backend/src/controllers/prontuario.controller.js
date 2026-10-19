const ProntuarioModel = require('../models/prontuario.model');
const PlantaoModel = require('../models/plantao.model');
const PacienteModel = require('../models/paciente.model');
const { ehTecnico } = require('../middlewares/auth.middleware');
const registrarAuditoria = require('../utils/auditoria');

// Campo numérico opcional: vazio vira null, e valor fora da faixa vira NaN (para eu recusar depois)
function numeroOpcional(valor, min, max) {
  if (valor === undefined || valor === null || valor === '') return null;
  const n = Number(valor);
  return n >= min && n <= max ? n : NaN;
}

const ProntuarioController = {
  // POST /api/prontuarios
  async criar(req, res, next) {
    try {
      const { plantao_id } = req.body;
      if (!plantao_id) return res.status(400).json({ erro: 'Selecione o plantão.' });

      const plantao = await PlantaoModel.buscarPorId(plantao_id);
      if (!plantao) return res.status(404).json({ erro: 'Plantão não encontrado.' });
      if (ehTecnico(req) && plantao.profissional_id !== req.usuario.profissional_id) {
        return res.status(403).json({ erro: 'Você só pode registrar prontuários dos seus plantões.' });
      }

      const dados = {
        plantao_id,
        pressao_arterial: req.body.pressao_arterial?.trim() || null,
        frequencia_cardiaca: numeroOpcional(req.body.frequencia_cardiaca, 20, 250),
        temperatura: numeroOpcional(req.body.temperatura, 30, 45),
        saturacao_oxigenio: numeroOpcional(req.body.saturacao_oxigenio, 50, 100),
        medicacao_administrada: req.body.medicacao_administrada?.trim() || null,
        intercorrencias: req.body.intercorrencias?.trim() || null,
        observacoes: req.body.observacoes?.trim() || null,
      };

      if ([dados.frequencia_cardiaca, dados.temperatura, dados.saturacao_oxigenio].some(Number.isNaN)) {
        return res.status(400).json({
          erro: 'Sinais vitais fora da faixa válida (FC 20–250, Temp. 30–45 °C, SpO₂ 50–100%).',
        });
      }

      const prontuario = await ProntuarioModel.criar(dados);
      registrarAuditoria(req, 'registrou', 'prontuario', prontuario.id, `Prontuário do plantão de ${plantao.paciente_nome}`);
      res.status(201).json(prontuario);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/prontuarios/paciente/:id
  // Prontuário é dado sensível (LGPD): o técnico só lê o histórico dos pacientes que atende.
  async listarPorPaciente(req, res, next) {
    try {
      if (ehTecnico(req) && !(await PacienteModel.atendidoPor(req.params.id, req.usuario.profissional_id))) {
        return res.status(403).json({ erro: 'Você só pode ver o histórico dos pacientes que atende.' });
      }
      const historico = await ProntuarioModel.listarPorPaciente(req.params.id);
      res.json(historico);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = ProntuarioController;
