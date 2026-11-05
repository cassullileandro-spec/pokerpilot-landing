function calculatePricing(players) {
  if (!Number.isSafeInteger(players) || players < 1 || players > 100000) return null;
  const tiers = [[4, 0], [15, 350], [60, 275], [150, 235], [300, 215]];
  const tier = tiers.findIndex(([limit]) => players <= limit);
  if (tier === -1) return { players, tier: 5, totalCents: null };
  let totalCents = 2500;
  // The base includes four players; only additional seats accumulate by band.
  for (let index = 1; index <= tier; index++) {
    const [limit, rateCents] = tiers[index];
    totalCents += (Math.min(players, limit) - tiers[index - 1][0]) * rateCents;
  }
  return { players, tier, totalCents };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = calculatePricing;
} else {
  (() => {
    const number = document.querySelector('#pricing-players');
    const slider = document.querySelector('#pricing-slider');
    const total = document.querySelector('#pricing-total');
    const rate = document.querySelector('#pricing-rate');
    const period = document.querySelector('#pricing-period');
    const error = document.querySelector('#pricing-error');
    const rows = [...document.querySelectorAll('.price-table tbody tr')];
    const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' });
    const money = cents => currency.format(cents / 100);

    function update() {
      const result = calculatePricing(number.valueAsNumber);
      number.setAttribute('aria-invalid', String(!result));
      error.hidden = Boolean(result);
      rows.forEach((row, index) => row.classList.toggle('selected-tier', result?.tier === index));
      if (!result) {
        total.textContent = '—';
        period.hidden = true;
        rate.textContent = 'Informe uma quantidade válida para calcular.';
        return;
      }
      slider.value = Math.min(result.players, 301);
      slider.setAttribute('aria-valuetext', result.players > 300 ? '301 ou mais jogadores' : `${result.players} jogadores`);
      const consultation = result.totalCents === null;
      total.textContent = consultation ? 'Sob consulta' : money(result.totalCents);
      period.hidden = consultation;
      rate.textContent = consultation
        ? 'Para times com 301 ou mais jogadores, fale com nossa equipe.'
        : `Para um time de ${result.players} ${result.players === 1 ? 'jogador ativo' : 'jogadores ativos'}.`;
    }
    number.disabled = false;
    slider.disabled = false;
    number.addEventListener('input', update);
    slider.addEventListener('input', () => { number.value = slider.value; update(); });
    update();
  })();
}
