import { startCamera, simMode } from '../../src/services/camera.js';

describe("Camera Service", () => {
  it("should be defined", () => {
    expect(startCamera).toBeDefined();
  });

  it("should call getUserMedia if supported", async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const spy = spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve({}));
      await startCamera();
      expect(spy).toHaveBeenCalled();
    }
  });

  it("should fallback to simulation mode when camera fails", async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const spy = spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.reject(new Error("Permission denied")));
      
      const video = document.createElement('video');
      video.id = 'video';
      const simSky = document.createElement('div');
      simSky.id = 'sim-sky';
      document.body.appendChild(video);
      document.body.appendChild(simSky);

      await startCamera();

      expect(spy).toHaveBeenCalled();
      expect(simMode).toBe(true);
      
      video.remove();
      simSky.remove();
    }
  });
});
