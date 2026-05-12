export function showPanel(scanResults, showDetailCallback) {
  const panel = document.getElementById('star-panel');
  const list = document.getElementById('star-list');
  if (!panel || !list) return;
  list.innerHTML = '';

  if (scanResults.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.3);font-size:12px;padding:1rem">Point at the sky and try again</div>';
  } else {
    for (const star of scanResults.slice(0, 10)) {
      const div = document.createElement('div');
      div.className = 'star-item';
      div.onclick = () => {
        if (showDetailCallback) showDetailCallback(star);
      };

      const dotClass = star.type === 'planet' ? 'planet' : star.mag < 1 ? 'bright' : 'constellation';
      const badgeClass = star.exoplanets > 0 ? 'badge-exo' : star.type === 'planet' ? 'badge-planet' : 'badge-star';
      const badgeText = star.exoplanets > 0 ? `${star.exoplanets} exoplanet${star.exoplanets>1?'s':''}` : star.type === 'planet' ? 'Planet' : `Mag ${star.mag}`;

      div.innerHTML = `
        <div class="star-dot ${dotClass}">${star.icon}</div>
        <div class="star-info">
          <div class="star-name">${star.name}</div>
          <div class="star-meta">${star.constellation} · Alt ${Math.round(star.alt)}° · Az ${Math.round(star.az)}°</div>
          <div class="star-meta">${star.fact}</div>
        </div>
        <div class="star-badge ${badgeClass}">${badgeText}</div>
      `;
      list.appendChild(div);
    }
  }

  panel.style.display = 'block';
}

export function closePanel() {
  const panel = document.getElementById('star-panel');
  if (panel) panel.style.display = 'none';
}
