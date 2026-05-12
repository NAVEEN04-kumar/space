import { getAltAz, getSiderealTime, getPlanetPosition, projectStar } from '../../src/services/math.js';

describe("StarScope Math Logic", () => {
  it("should calculate correct altitude and azimuth when star is directly overhead", () => {
    const ra = 0;
    const dec = 0;
    const lat = 0;
    const lst = 0;
    
    const result = getAltAz(ra, dec, lat, lst);
    
    expect(Math.round(result.alt)).toBe(90);
  });

  it("should calculate correct values for a star on the horizon", () => {
    const ra = 0;
    const dec = 0;
    const lat = 0;
    const lst = 90;
    
    const result = getAltAz(ra, dec, lat, lst);
    
    expect(Math.round(result.alt)).toBe(0);
    expect(Math.round(result.az)).toBe(270);
  });
});

describe("StarScope Sidereal Time Calculation", () => {
  it("should return a value between 0 and 360", () => {
    const lon = 80.27; // Chennai
    const lst = getSiderealTime(lon);
    
    expect(lst).toBeGreaterThanOrEqual(0);
    expect(lst).toBeLessThan(360);
  });
});

describe("StarScope Planet Position Calculation", () => {
  it("should calculate correct planetary coordinates for Jupiter", () => {
    const pos = getPlanetPosition("Jupiter");
    
    expect(pos.ra).toBeGreaterThanOrEqual(0);
    expect(pos.ra).toBeLessThan(360);
    
    expect(pos.dec).toBeGreaterThanOrEqual(-10);
    expect(pos.dec).toBeLessThanOrEqual(10);
  });
  
  it("should calculate different positions for different planets", () => {
    const marsPos = getPlanetPosition("Mars");
    const venusPos = getPlanetPosition("Venus");
    
    expect(marsPos.ra).not.toBe(venusPos.ra);
  });
});

describe("StarScope Projection", () => {
  it("should project star in front of camera", () => {
    const alt = 45;
    const az = 0;
    const heading = 0;
    const beta = 90;
    const gamma = 0;
    const centerX = 500;
    const centerY = 500;
    const focalLength = 500;

    const result = projectStar(alt, az, heading, beta, gamma, centerX, centerY, focalLength);

    expect(result.inView).toBe(true);
    expect(result.screenX).toBeDefined();
    expect(result.screenY).toBeDefined();
  });
});
