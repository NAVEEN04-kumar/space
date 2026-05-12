export let simMode = false;

export async function startCamera(setupCanvasCallback, buildSimStarsCallback) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
    });
    const video = document.getElementById('video');
    if (video) {
      video.srcObject = stream;
      video.style.display = 'block';
    }
    if (setupCanvasCallback) setupCanvasCallback();
  } catch (e) {
    const video = document.getElementById('video');
    const simSky = document.getElementById('sim-sky');
    if (video) video.style.display = 'none';
    if (simSky) simSky.style.display = 'block';
    simMode = true;
    if (buildSimStarsCallback) buildSimStarsCallback();
    if (setupCanvasCallback) setupCanvasCallback();
  }
}
