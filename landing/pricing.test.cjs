const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const calculate = require('./dist/pricing.js');

// Cover both sides of every commercial boundary, including consultation.
for (const [players, rate, total] of [
  [1, 1069, 1069], [10, 1069, 10690], [11, 589, 6479], [30, 589, 17670],
  [31, 389, 12059], [100, 389, 38900], [101, 289, 29189], [200, 289, 57800],
  [201, 249, 50049], [300, 249, 74700], [301, null, null], [100000, null, null],
]) {
  const result = calculate(players);
  assert.equal(result.rateCents, rate, `rate for ${players}`);
  assert.equal(result.totalCents, total, `total for ${players}`);
}
for (const invalid of [NaN, Infinity, -1, 0, 1.5, '11', null, 100001]) assert.equal(calculate(invalid), null);

for (const route of ['index', 'light', 'dark']) {
  const html = readFileSync(`${__dirname}/dist/${route}.html`, 'utf8');
  const table = html.match(/<table class="price-table">[\s\S]*?<\/table>/)[0];
  for (const text of ['1 a 10', '10,69', '11 a 30', '5,89', '31 a 100', '3,89', '101 a 200', '2,89', '201 a 300', '2,49', '301 ou mais', 'Sob consulta']) assert.ok(table.includes(text), `${route}: ${text}`);
  assert.ok(html.includes('pricing.js?v=20261030'));
  assert.equal((html.match(/id="pricing-players"/g) || []).length, 1);
}
console.log('Pricing: all tier boundaries, invalid inputs and three routes passed.');
