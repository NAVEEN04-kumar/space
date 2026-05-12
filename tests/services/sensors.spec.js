import { startSensors, compassHeading } from '../../src/services/sensors.js';

describe("Sensors Service", () => {
  it("should be defined", () => {
    expect(startSensors).toBeDefined();
  });

  it("should attempt to add event listener", () => {
    const spy = spyOn(window, 'addEventListener').and.callThrough();
    startSensors();
    expect(spy).toHaveBeenCalled();
  });
});
