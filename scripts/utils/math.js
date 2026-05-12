export const DEG = Math.PI / 180;

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

export function projectStar(alt, az, heading, beta, gamma, centerX, centerY, focalLength) {
  const A = heading * DEG;
  const B = beta * DEG;
  const G = gamma * DEG;

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

  const altR = alt * DEG;
  const azR = az * DEG;
  
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

  return { screenX, screenY, inView };
}
