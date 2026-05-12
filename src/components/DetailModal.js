export function showDetail(star) {
  const iconEl = document.getElementById('modal-icon');
  const nameEl = document.getElementById('modal-name');
  const typeEl = document.getElementById('modal-type');
  const factsEl = document.getElementById('modal-facts');
  const modalEl = document.getElementById('detail-modal');

  if (!iconEl || !nameEl || !typeEl || !factsEl || !modalEl) return;

  iconEl.textContent = star.type === 'planet' ? '⬤' : star.mag < 1 ? '✦' : '★';
  nameEl.textContent = star.name;
  typeEl.textContent = star.type === 'planet' ? `Planet · Solar System` : `Star · ${star.constellation}`;

  const facts = [
    ['Distance', star.dist],
    ['Magnitude', star.mag],
    ['Temperature', star.temp],
    ['Color / Type', star.color],
    ['Altitude now', Math.round(star.alt) + '°'],
    ['Azimuth now', Math.round(star.az) + '°'],
    star.exoplanets > 0 ? ['Exoplanets', `${star.exoplanets} confirmed`, true] : null,
    ['Fun fact', star.fact],
  ].filter(Boolean);

  factsEl.innerHTML = facts.map(([label, val, hi]) =>
    `<div class="fact-row">
      <span class="fact-label">${label}</span>
      <span class="fact-val${hi ? ' highlight' : ''}" style="max-width:55%;text-align:right">${val}</span>
    </div>`
  ).join('');

  modalEl.style.display = 'flex';
}

export function closeDetail() {
  const modalEl = document.getElementById('detail-modal');
  if (modalEl) modalEl.style.display = 'none';
}
