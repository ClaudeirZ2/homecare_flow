const { test } = require('node:test');
const assert = require('node:assert');

process.env.JWT_SECRET = 'segredo-so-para-teste';
const { gerarToken, verificarToken } = require('../src/utils/jwt');
const { autenticar, permitirTipos } = require('../src/middlewares/auth.middleware');
const { respostaFalsa } = require('./ajudantes');

const tecnica = { id: 3, nome: 'Juliana', tipo: 'tecnico', profissional_id: 1 };

test('o token guarda id, perfil e profissional_id', () => {
  const dados = verificarToken(gerarToken(tecnica));
  assert.strictEqual(dados.id, 3);
  assert.strictEqual(dados.tipo, 'tecnico');
  assert.strictEqual(dados.profissional_id, 1);
});

test('sem token a rota responde 401', () => {
  const res = respostaFalsa();
  autenticar({ headers: {} }, res, () => assert.fail('não deveria passar'));
  assert.strictEqual(res.statusCode, 401);
});

test('token adulterado é recusado', () => {
  const res = respostaFalsa();
  const token = gerarToken(tecnica).slice(0, -3) + 'abc';
  autenticar({ headers: { authorization: `Bearer ${token}` } }, res, () => assert.fail('não deveria passar'));
  assert.strictEqual(res.statusCode, 401);
});

test('token válido libera a rota e coloca o usuário na requisição', () => {
  const req = { headers: { authorization: `Bearer ${gerarToken(tecnica)}` } };
  let passou = false;
  autenticar(req, respostaFalsa(), () => { passou = true; });
  assert.ok(passou);
  assert.strictEqual(req.usuario.nome, 'Juliana');
});

test('técnico não acessa rota só da gestão (403)', () => {
  const res = respostaFalsa();
  permitirTipos('admin', 'gestor')({ usuario: tecnica }, res, () => assert.fail('não deveria passar'));
  assert.strictEqual(res.statusCode, 403);
});

test('gestor acessa rota da gestão', () => {
  let passou = false;
  permitirTipos('admin', 'gestor')({ usuario: { tipo: 'gestor' } }, respostaFalsa(), () => { passou = true; });
  assert.ok(passou);
});
