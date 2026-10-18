const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const errorHandler = require('../src/middlewares/errorHandler');
const httpError = require('../src/utils/httpError');
const { respostaFalsa } = require('./ajudantes');

// O errorHandler escreve no console; silencio durante os testes
let consoleOriginal;
beforeEach(() => { consoleOriginal = console.error; console.error = () => {}; });
afterEach(() => { console.error = consoleOriginal; });

test('registro duplicado no MySQL vira 409 com mensagem amigável', () => {
  const res = respostaFalsa();
  errorHandler({ code: 'ER_DUP_ENTRY', message: "Duplicate entry 'x' for key 'email'" }, {}, res);
  assert.strictEqual(res.statusCode, 409);
  assert.match(res.corpo.erro, /duplicado/);
});

test('erro 500 não expõe detalhes internos', () => {
  const res = respostaFalsa();
  errorHandler(new Error('senha do banco: 123 / tabela xyz'), {}, res);
  assert.strictEqual(res.statusCode, 500);
  assert.strictEqual(res.corpo.erro, 'Erro interno no servidor.');
});

test('erro com status 4xx mostra a mensagem', () => {
  const res = respostaFalsa();
  errorHandler(httpError(404, 'Escala não encontrada.'), {}, res);
  assert.strictEqual(res.statusCode, 404);
  assert.strictEqual(res.corpo.erro, 'Escala não encontrada.');
});
