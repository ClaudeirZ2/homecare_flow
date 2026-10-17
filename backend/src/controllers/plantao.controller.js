const PlantaoModel = require('../models/plantao.model');
const EscalaModel = require('../models/escala.model');
const PacienteModel = require('../models/paciente.model');
const { ehTecnico } = require('../middlewares/auth.middleware');

// Coordenadas GPS válidas (latitude -90..90, longitude -180..180)
function coordenadasValidas(lat, lng) {
  return (
    lat !== undefined && lng !== undefined && lat !== null && lng !== null &&
    Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180
  );
}

// Técnico só pode operar plantões/escalas que são dele
function pertenceAoUsuario(req, profissional_id) {
  return !ehTecnico(req) || profissional_id === req.usuario.profissional_id;
}

const PlantaoController = {
  // GET /api/plantoes — gestão vê todos; técnico vê os próprios
  async listar(req, res, next) {
    try {
      const filtro = ehTecnico(req) ? { profissional_id: req.usuario.profissional_id || -1 } : {};
      res.json(await PlantaoModel.listar(filtro));
    } catch (err) {
      next(err);
    }
  },

  // POST /api/plantoes/checkin  { escala_id, metodo: 'gps'|'qrcode', lat?, lng?, codigo? }
  // Profissional e paciente vêm da própria escala (não confiamos no que o cliente envia).
  async checkin(req, res, next) {
    try {
      const { escala_id, metodo, lat, lng, codigo } = req.body;

      if (!escala_id || !['gps', 'qrcode'].includes(metodo)) {
        return res.status(400).json({ erro: 'escala_id e metodo (gps ou qrcode) são obrigatórios.' });
      }

      const escala = await EscalaModel.buscarPorId(escala_id);
      if (!escala) return res.status(404).json({ erro: 'Escala não encontrada.' });
      if (!pertenceAoUsuario(req, escala.profissional_id)) {
        return res.status(403).json({ erro: 'Esta escala pertence a outro profissional.' });
      }
      if (escala.plantao_id || escala.status !== 'agendado') {
        return res.status(409).json({ erro: 'Esta escala já teve check-in ou não está mais agendada.' });
      }

      if (metodo === 'gps' && !coordenadasValidas(lat, lng)) {
        return res.status(400).json({ erro: 'Localização GPS inválida ou não informada.' });
      }
      if (metodo === 'qrcode') {
        // O código lido precisa ser o QR Code fixado na casa DESTE paciente
        const paciente = await PacienteModel.buscarPorId(escala.paciente_id);
        if (!paciente || codigo?.trim().toUpperCase() !== paciente.qr_code_id.toUpperCase()) {
          return res.status(400).json({ erro: 'QR Code não corresponde à residência deste paciente.' });
        }
      }

      const plantao = await PlantaoModel.checkin({ escala, lat, lng, metodo });
      res.status(201).json(plantao);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/plantoes/:id/checkout  { lat?, lng? }
  async checkout(req, res, next) {
    try {
      const plantao = await PlantaoModel.buscarPorId(req.params.id);
      if (!plantao) return res.status(404).json({ erro: 'Plantão não encontrado.' });
      if (!pertenceAoUsuario(req, plantao.profissional_id)) {
        return res.status(403).json({ erro: 'Este plantão pertence a outro profissional.' });
      }
      if (plantao.status === 'finalizado') {
        return res.status(409).json({ erro: 'Este plantão já foi finalizado.' });
      }

      const { lat, lng } = req.body;
      const coords = coordenadasValidas(lat, lng) ? { lat, lng } : {};
      res.json(await PlantaoModel.checkout(plantao, coords));
    } catch (err) {
      next(err);
    }
  },

  // GET /api/plantoes/:id
  async detalhar(req, res, next) {
    try {
      const plantao = await PlantaoModel.buscarPorId(req.params.id);
      if (!plantao) return res.status(404).json({ erro: 'Plantão não encontrado.' });
      if (!pertenceAoUsuario(req, plantao.profissional_id)) {
        return res.status(403).json({ erro: 'Este plantão pertence a outro profissional.' });
      }
      res.json(plantao);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/plantoes/profissional/:id
  async listarPorProfissional(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (!pertenceAoUsuario(req, id)) {
        return res.status(403).json({ erro: 'Você só pode visualizar os seus plantões.' });
      }
      res.json(await PlantaoModel.listarPorProfissional(id));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = PlantaoController;
