const { test } = require('node:test');
const assert = require('node:assert');
const { distanciaEmMetros } = require('../src/utils/geo');

test('distância de um ponto para ele mesmo é zero', () => {
  assert.strictEqual(distanciaEmMetros(-16.4708, -54.6356, -16.4708, -54.6356), 0);
});

test('casas vizinhas ficam a poucas centenas de metros', () => {
  // Rua das Flores x Av. Brasil (pacientes do seed)
  const d = distanciaEmMetros(-16.4708, -54.6356, -16.4673, -54.6372);
  assert.ok(d > 300 && d < 500, `esperava entre 300 e 500 m, deu ${d}`);
});

test('Rondonópolis até São Paulo dá mais de 1.000 km', () => {
  const d = distanciaEmMetros(-16.4708, -54.6356, -23.5505, -46.6333);
  assert.ok(d > 1_000_000 && d < 1_300_000, `distância inesperada: ${d}`);
});
