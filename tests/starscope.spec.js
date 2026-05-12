import { getAltAz, getSiderealTime, getPlanetPosition } from '../scripts/starscope.js';

describe("StarScope Math Logic", () => {
  it("should calculate correct altitude and azimuth when star is directly overhead", () => {
    // If you are on the equator (lat = 0)
    // and the star is on the celestial equator (dec = 0)
    // and the local sidereal time matches the star's right ascension (lst = 0, ra = 0)
    // the star should be directly overhead (Altitude = 90)
    
    const ra = 0;
    const dec = 0;
    const lat = 0;
    const lst = 0;
    
    const result = getAltAz(ra, dec, lat, lst);
    
    // Altitude should be 90 degrees (zenith)
    expect(Math.round(result.alt)).toBe(90);
  });

  it("should calculate correct values for a star on the horizon", () => {
    // If you are on the equator (lat = 0)
    // and the star is on the celestial equator (dec = 0)
    // but the star is 90 degrees away in HA (ra = 0, lst = 90)
    // it should be on the western horizon (Altitude = 0, Azimuth = 270)
    
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
    
    // Check boundaries
    expect(pos.ra).toBeGreaterThanOrEqual(0);
    expect(pos.ra).toBeLessThan(360);
    
    // Declination for this simplistic model is bounded between -10 and 10
    expect(pos.dec).toBeGreaterThanOrEqual(-10);
    expect(pos.dec).toBeLessThanOrEqual(10);
  });
  
  it("should calculate different positions for different planets", () => {
    const marsPos = getPlanetPosition("Mars");
    const venusPos = getPlanetPosition("Venus");
    
    // They shouldn't be identical
    expect(marsPos.ra).not.toBe(venusPos.ra);
  });
});
