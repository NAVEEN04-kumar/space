import { STARS } from '../services/stars.js';
import { DEG, getSiderealTime, getAltAz, getPlanetPosition, projectStar } from '../services/math.js';
import { startSensors, compassHeading, deviceBeta, deviceGamma } from '../services/sensors.js';
import { startLocation, userLat, userLon } from '../services/location.js';
import { startCamera, simMode } from '../services/camera.js';
import { showPanel, closePanel } from '../components/StarPanel.js';
import { showDetail, closeDetail } from '../components/DetailModal.js';

let scanResults = [];
let targetStar = null;

// ── Time ──
function updateTime() {
  const timeEl = document.getElementById('hud-time');
  if (!timeEl) return;
  const now = new Date();
  timeEl.textContent =
    now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
setInterval(updateTime, 1000);
updateTime();

// ── Splash ──
function startApp() {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('perm-screen').style.display = 'flex';
}

// ── Permissions ──
async function requestPermissions() {
  document.getElementById('perm-screen').style.display = 'none';
  document.getElementById('camera-view').style.display = 'block';
  await Promise.all([
    startCamera(setupCanvas, buildSimStars),
    startLocation()
  ]);
  startSensors(startRenderLoop);
}

function launchSimMode() {
  document.getElementById('perm-screen').style.display = 'none';
  document.getElementById('camera-view').style.display = 'block';
  document.getElementById('sim-sky').style.display = 'block';
  buildSimStars();
  
  // Set default location if not available
  const latEl = document.getElementById('val-lat');
  const lonEl = document.getElementById('val-lon');
  const locEl = document.getElementById('hud-loc');
  if (latEl) latEl.textContent = '13.1°';
  if (lonEl) lonEl.textContent = '80.3°';
  if (locEl) locEl.textContent = 'Chennai, IN';
  
  startSensors(startRenderLoop);
  setupCanvas();
}

// ── Canvas ──
function setupCanvas() {
  const canvas = document.getElementById('overlay-canvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', setupCanvas);

// ── Sim Stars ──
function buildSimStars() {
  const sky = document.getElementById('sim-sky');
  if (!sky) return;
  const count = 120;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'sim-star';
    const size = Math.random() < 0.1 ? 3 : Math.random() < 0.3 ? 2 : 1;
    const op = 0.3 + Math.random() * 0.7;
    const tw = 2 + Math.random() * 4;
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      --op: ${op}; --tw: ${tw}s;
      animation-delay: ${Math.random() * 4}s;
    `;
    sky.appendChild(s);
  }
}

// ── Main Scan ──
function scanSky() {
  const scanLine = document.querySelector('.scan-line');
  if (scanLine) scanLine.style.display = 'block';
  setTimeout(() => {
    if (scanLine) scanLine.style.display = 'none';
    computeVisible();
    showPanel(scanResults, showDetail);
  }, 2000);
}

function startRenderLoop() {
  function loop() {
    computeVisible();
    requestAnimationFrame(loop);
  }
  loop();
}

function computeVisible() {
  const lat = userLat || 13.08;
  const lon = userLon || 80.27;
  const lst = getSiderealTime(lon);
  const heading = compassHeading;
  
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const focalLength = (window.innerWidth / 2) / Math.tan(30 * DEG); // 60 deg FOV

  const visible = [];

  for (const star of STARS) {
    let ra = star.ra, dec = star.dec;

    if (star.isDynamic) {
      const pos = getPlanetPosition(star.name);
      ra = pos.ra; dec = pos.dec;
    }

    const pos = getAltAz(ra, dec, lat, lst);

    if (pos.alt < 5) continue;

    const { screenX, screenY, inView } = projectStar(pos.alt, pos.az, heading, deviceBeta, deviceGamma, centerX, centerY, focalLength);

    visible.push({
      ...star,
      alt: pos.alt,
      az: pos.az,
      inView,
      screenX,
      screenY,
    });
  }

  visible.sort((a, b) => a.mag - b.mag);
  scanResults = visible.slice(0, 14);

  // Find star closest to center of screen
  let minDistance = Infinity;
  targetStar = null;

  for (const star of scanResults) {
    if (star.inView) {
      const dist = Math.sqrt(Math.pow(star.screenX - centerX, 2) + Math.pow(star.screenY - centerY, 2));
      if (dist < minDistance && dist < 100) {
        minDistance = dist;
        targetStar = star;
      }
    }
  }

  drawOverlay();
}

function drawOverlay() {
  const canvas = document.getElementById('overlay-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Drawing disabled for "plain cam" mode as requested by user.
}

// ── Event Listeners ──
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector('.start-btn');
  const permBtn = document.querySelector('.perm-btn');
  const permSkip = document.querySelector('.perm-skip');
  const panelClose = document.querySelector('.panel-close');
  const modalClose = document.querySelector('.modal-close');
  const canvas = document.getElementById('overlay-canvas');

  if (startBtn) startBtn.addEventListener('click', startApp);
  if (permBtn) permBtn.addEventListener('click', requestPermissions);
  if (permSkip) permSkip.addEventListener('click', launchSimMode);
  if (panelClose) panelClose.addEventListener('click', closePanel);
  if (modalClose) modalClose.addEventListener('click', closeDetail);
  
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      let closestStar = null;
      let minDistance = Infinity;
      
      for (const star of scanResults) {
        if (star.inView) {
          const dist = Math.sqrt(Math.pow(star.screenX - clickX, 2) + Math.pow(star.screenY - clickY, 2));
          if (dist < minDistance && dist < 50) { // 50px threshold
            minDistance = dist;
            closestStar = star;
          }
        }
      }
      
      if (closestStar) {
        showDetail(closestStar);
      }
    });
  }
});
