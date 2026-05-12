export let userLat = null;
export let userLon = null;

export function startLocation() {
  return new Promise(resolve => {
    if (!navigator.geolocation) { resolve(); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      userLat = pos.coords.latitude;
      userLon = pos.coords.longitude;
      const latEl = document.getElementById('val-lat');
      const lonEl = document.getElementById('val-lon');
      const locEl = document.getElementById('hud-loc');
      if (latEl) latEl.textContent = userLat.toFixed(1) + '°';
      if (lonEl) lonEl.textContent = userLon.toFixed(1) + '°';
      if (locEl) locEl.textContent = userLat.toFixed(2) + ', ' + userLon.toFixed(2);
      resolve();
    }, () => {
      userLat = 13.08; userLon = 80.27;
      const locEl = document.getElementById('hud-loc');
      if (locEl) locEl.textContent = 'Chennai (default)';
      resolve();
    }, { timeout: 6000 });
  });
}
