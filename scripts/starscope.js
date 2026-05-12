const DEG = Math.PI / 180;

// ── Star / Planet Database ──
import { STARS } from '../data/stars.js';

let userLat = null, userLon = null;
let compassHeading = 0, deviceAlt = 45, deviceBeta = 90, deviceGamma = 0;
let scanResults = [];
let simMode = false;
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
  await Promise.all([startCamera(), startLocation()]);
  startSensors();
}

function launchSimMode() {
  simMode = true;
  document.getElementById('perm-screen').style.display = 'none';
  document.getElementById('camera-view').style.display = 'block';
  document.getElementById('sim-sky').style.display = 'block';
  buildSimStars();
  userLat = 13.08; userLon = 80.27; // Chennai default
  document.getElementById('val-lat').textContent = '13.1°';
  document.getElementById('val-lon').textContent = '80.3°';
  document.getElementById('hud-loc').textContent = 'Chennai, IN';
  startSensors();
  setupCanvas();
}

// ── Camera ──
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
    });
    const video = document.getElementById('video');
    video.srcObject = stream;
    video.style.display = 'block';
    setupCanvas();
  } catch (e) {
    document.getElementById('video').style.display = 'none';
    document.getElementById('sim-sky').style.display = 'block';
    simMode = true;
    buildSimStars();
    setupCanvas();
  }
}

// ── Location ──
function startLocation() {
  return new Promise(resolve => {
    if (!navigator.geolocation) { resolve(); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      userLat = pos.coords.latitude;
      userLon = pos.coords.longitude;
      document.getElementById('val-lat').textContent = userLat.toFixed(1) + '°';
      document.getElementById('val-lon').textContent = userLon.toFixed(1) + '°';
      document.getElementById('hud-loc').textContent = userLat.toFixed(2) + ', ' + userLon.toFixed(2);
      resolve();
    }, () => {
      userLat = 13.08; userLon = 80.27;
      document.getElementById('hud-loc').textContent = 'Chennai (default)';
      resolve();
    }, { timeout: 6000 });
  });
}

function startRenderLoop() {
  function loop() {
    computeVisible();
    requestAnimationFrame(loop);
  }
  loop();
}

// ── Sensors ──
function startSensors() {
  if (window.DeviceOrientationEvent) {
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation);
    } else if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
      });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }
  startRenderLoop();
}

function handleOrientation(e) {
  if (e.alpha !== null) {
    compassHeading = e.alpha || 0;
    document.getElementById('val-az').textContent = Math.round(compassHeading) + '°';
  }
  if (e.beta !== null) {
    deviceBeta = e.beta;
    deviceAlt = Math.min(90, Math.max(0, 90 - Math.abs(e.beta)));
    document.getElementById('val-alt').textContent = Math.round(deviceAlt) + '°';
  }
  if (e.gamma !== null) {
    deviceGamma = e.gamma;
  }
}

// ── Canvas ──
function setupCanvas() {
  const canvas = document.getElementById('overlay-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', setupCanvas);

// ── Sim Stars ──
function buildSimStars() {
  const sky = document.getElementById('sim-sky');
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

// ── Star Visibility Calculation ──
export function getSiderealTime(lon) {
  const now = new Date();
  const jd = 2440587.5 + now.getTime() / 86400000;
  const T = (jd - 2451545.0) / 36525;
  let gst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T;
  gst = ((gst % 360) + 360) % 360;
  return (gst + lon) % 360;
}

export function getAltAz(ra, dec, lat, lst) {
  const ha = ((lst - ra) % 360 + 360) % 360;
  const haR = ha * DEG, decR = dec * DEG, latR = lat * DEG;
  const sinAlt = Math.sin(decR) * Math.sin(latR) + Math.cos(decR) * Math.cos(latR) * Math.cos(haR);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) / DEG;
  const cosAz = (Math.sin(decR) - sinAlt * Math.sin(latR)) / (Math.cos(Math.asin(sinAlt)) * Math.cos(latR));
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) / DEG;
  if (Math.sin(haR) > 0) az = 360 - az;
  return { alt, az };
}

export function getPlanetPosition(name) {
  const now = new Date();
  const d = (now.getTime() - new Date('2000-01-01').getTime()) / 86400000;
  const offsets = { Venus: 0, Mars: 120, Jupiter: 240, Saturn: 300 };
  const speeds = { Venus: 1.6, Mars: 0.52, Jupiter: 0.083, Saturn: 0.033 };
  const off = offsets[name] || 0;
  const spd = speeds[name] || 0.1;
  const ra = ((off + d * spd) % 360 + 360) % 360;
  const dec = 10 * Math.sin((d * spd * DEG) + off * DEG);
  return { ra, dec };
}

// ── Main Scan ──
function scanSky() {
  const scanLine = document.getElementById('scan-line');
  scanLine.style.display = 'block';
  scanLine.style.animation = 'none';
  void scanLine.offsetWidth;
  scanLine.style.animation = 'scan 2s ease-in-out';

  setTimeout(() => {
    scanLine.style.display = 'none';
    computeVisible();
    showPanel();
  }, 2000);
}

function computeVisible() {
  const lat = userLat || 13.08;
  const lon = userLon || 80.27;
  const lst = getSiderealTime(lon);
  const heading = compassHeading;
  
  const A = heading * DEG;
  const B = deviceBeta * DEG;
  const G = deviceGamma * DEG;

  // Rotation matrix from device to world (Z-X'-Y'')
  // Transpose elements to go from world to device:
  const r00 = Math.cos(A)*Math.cos(G) - Math.sin(A)*Math.sin(B)*Math.sin(G);
  const r01 = Math.sin(A)*Math.cos(G) + Math.cos(A)*Math.sin(B)*Math.sin(G);
  const r02 = -Math.cos(B)*Math.sin(G);

  const r10 = -Math.sin(A)*Math.cos(B);
  const r11 = Math.cos(A)*Math.cos(B);
  const r12 = Math.sin(B);

  const r20 = Math.cos(A)*Math.sin(G) + Math.sin(A)*Math.sin(B)*Math.cos(G);
  const r21 = Math.sin(A)*Math.sin(G) - Math.cos(A)*Math.sin(B)*Math.cos(G);
  const r22 = Math.cos(B)*Math.cos(G);

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

    const altR = pos.alt * DEG;
    const azR = pos.az * DEG;
    
    // World vector (X=East, Y=North, Z=Up)
    const Wx = Math.cos(altR) * Math.sin(azR);
    const Wy = Math.cos(altR) * Math.cos(azR);
    const Wz = Math.sin(altR);

    // Device vector
    const Dx = r00 * Wx + r01 * Wy + r02 * Wz;
    const Dy = r10 * Wx + r11 * Wy + r12 * Wz;
    const Dz = r20 * Wx + r21 * Wy + r22 * Wz;

    let screenX = centerX;
    let screenY = centerY;
    let inView = false;

    if (Dz < 0) { // Star is in front of camera
      screenX = centerX + (Dx / -Dz) * focalLength;
      screenY = centerY - (Dy / -Dz) * focalLength;
      
      inView = screenX >= 0 && screenX <= window.innerWidth && screenY >= 0 && screenY <= window.innerHeight;
    }

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
      // Only target if it's within a reasonable distance (e.g., 100 pixels)
      if (dist < minDistance && dist < 100) {
        minDistance = dist;
        targetStar = star;
      }
    }
  }

  drawOverlay();
}

// ── Draw Overlay ──
function drawOverlay() {
  const canvas = document.getElementById('overlay-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Drawing disabled for "plain cam" mode as requested by user.
}

// ── Panel ──
function showPanel() {
  const panel = document.getElementById('star-panel');
  const list = document.getElementById('star-list');
  list.innerHTML = '';

  if (scanResults.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.3);font-size:12px;padding:1rem">Point at the sky and try again</div>';
  } else {
    for (const star of scanResults.slice(0, 10)) {
      const div = document.createElement('div');
      div.className = 'star-item';
      div.onclick = () => showDetail(star);

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

function closePanel() {
  document.getElementById('star-panel').style.display = 'none';
  const canvas = document.getElementById('overlay-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ── Detail ──
function showDetail(star) {
  document.getElementById('modal-icon').textContent = star.type === 'planet' ? '⬤' : star.mag < 1 ? '✦' : '★';
  document.getElementById('modal-name').textContent = star.name;
  document.getElementById('modal-type').textContent =
    star.type === 'planet' ? `Planet · Solar System` : `Star · ${star.constellation}`;

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

  document.getElementById('modal-facts').innerHTML = facts.map(([label, val, hi]) =>
    `<div class="fact-row">
      <span class="fact-label">${label}</span>
      <span class="fact-val${hi ? ' highlight' : ''}" style="max-width:55%;text-align:right">${val}</span>
    </div>`
  ).join('');

  document.getElementById('detail-modal').style.display = 'flex';
}

function closeDetail() {
  document.getElementById('detail-modal').style.display = 'none';
}

// ── Event Listeners ──
if (document.querySelector('.start-btn')) {
  document.querySelector('.start-btn').addEventListener('click', startApp);
  document.querySelector('.perm-btn').addEventListener('click', requestPermissions);
  document.querySelector('.perm-skip').addEventListener('click', launchSimMode);
  document.querySelector('.panel-close').addEventListener('click', closePanel);
  document.querySelector('.modal-close').addEventListener('click', closeDetail);
  
  // Canvas click listener for targeted star
  const canvas = document.getElementById('overlay-canvas');
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
}
