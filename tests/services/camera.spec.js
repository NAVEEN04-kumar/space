import { startCamera } from '../../src/services/camera.js';

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
});
