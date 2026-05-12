export let compassHeading = 0;
export let deviceAlt = 45;
export let deviceBeta = 90;
export let deviceGamma = 0;

export function startSensors(renderLoopCallback) {
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
  if (renderLoopCallback) renderLoopCallback();
}

function handleOrientation(e) {
  if (e.alpha !== null) {
    compassHeading = e.alpha || 0;
    const el = document.getElementById('val-az');
    if (el) el.textContent = Math.round(compassHeading) + '°';
  }
  if (e.beta !== null) {
    deviceBeta = e.beta;
    deviceAlt = Math.min(90, Math.max(0, 90 - Math.abs(e.beta)));
    const el = document.getElementById('val-alt');
    if (el) el.textContent = Math.round(deviceAlt) + '°';
  }
  if (e.gamma !== null) {
    deviceGamma = e.gamma;
  }
}
