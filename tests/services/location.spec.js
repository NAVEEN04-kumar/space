import { startLocation } from '../../src/services/location.js';

describe("Location Service", () => {
  it("should be defined", () => {
    expect(startLocation).toBeDefined();
  });

  it("should call getCurrentPosition if geolocation exists", async () => {
    if (navigator.geolocation) {
      const spy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success) => {
        success({ coords: { latitude: 10, longitude: 20 } });
      });
      await startLocation();
      expect(spy).toHaveBeenCalled();
    }
  });
});
