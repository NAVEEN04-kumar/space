import { STARS } from '../../src/services/stars.js';

describe("Star Database", () => {
  it("should have stars defined", () => {
    expect(STARS).toBeDefined();
    expect(STARS.length).toBeGreaterThan(0);
  });

  it("should contain Sirius", () => {
    const sirius = STARS.find(s => s.name === 'Sirius');
    expect(sirius).toBeDefined();
    expect(sirius.mag).toBe(-1.46);
  });

  it("should contain planets", () => {
    const jupiter = STARS.find(s => s.name === 'Jupiter');
    expect(jupiter).toBeDefined();
    expect(jupiter.type).toBe('planet');
  });
});
