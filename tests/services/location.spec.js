import { startLocation, userLat, userLon } from '../../src/services/location.js';

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

  it("should fallback to default location when geolocation fails", async () => {
    if (navigator.geolocation) {
      const spy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success, error) => {
        error(new Error("Permission denied"));
      });
      await startLocation();
      expect(spy).toHaveBeenCalled();
      expect(userLat).toBe(13.08);
      expect(userLon).toBe(80.27);
    }
  });
});
