const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const calculate = require('./dist/pricing.js');

// Cover both sides of every commercial boundary, including consultation.
for (const [players, tier, total] of [
  [1, 0, 2500], [4, 0, 2500], [5, 1, 2850], [15, 1, 6350],
  [16, 2, 6625], [30, 2, 10475], [60, 2, 18725], [61, 3, 18960],
  [150, 3, 39875], [151, 4, 40090], [300, 4, 72125],
  [301, 5, null], [100000, 5, null],
]) {
  const result = calculate(players);
  assert.equal(result.tier, tier, `tier for ${players}`);
  assert.equal(result.totalCents, total, `total for ${players}`);
}
// Crossing a band must never discount seats already counted.
for (let players = 2; players <= 300; players++) {
  const increment = players <= 4 ? 0 : players <= 15 ? 350 : players <= 60 ? 275 : players <= 150 ? 235 : 215;
  assert.equal(calculate(players).totalCents - calculate(players - 1).totalCents, increment, `additional seat ${players}`);
}
for (const invalid of [NaN, Infinity, -1, 0, 1.5, '11', null, 100001]) assert.equal(calculate(invalid), null);

for (const route of ['index', 'light', 'dark']) {
  const html = readFileSync(`${__dirname}/dist/${route}.html`, 'utf8');
  const table = html.match(/<table class="price-table">[\s\S]*?<\/table>/)[0];
  for (const text of ['Até 4', '25 fixos', '5 a 15', '3,50', '16 a 60', '2,75', '61 a 150', '2,35', '151 a 300', '2,15', '301 ou mais', 'Sob consulta']) assert.ok(table.includes(text), `${route}: ${text}`);
  assert.ok(html.includes('pricing.js?v=20261105'));
  assert.ok(html.includes('<details class="pricing-details">'));
  assert.ok(html.includes('US$ 104,75'));
  assert.equal((html.match(/id="pricing-players"/g) || []).length, 1);
  assert.ok(!/10,69|5,89|176,70|Multiplicamos a quantidade|a todos os jogadores ativos/.test(html));
}
console.log('Pricing: progressive boundaries, every additional seat, invalid inputs and three routes passed.');
