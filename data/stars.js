export let STARS = [
  { name: 'Sirius', type: 'star', constellation: 'Canis Major', icon: '★', ra: 101.29, dec: -16.72, mag: -1.46, dist: '8.6 ly', temp: '9,940 K', color: 'Blue-white', exoplanets: 0, fact: 'Brightest star in the night sky' },
  { name: 'Canopus', type: 'star', constellation: 'Carina', icon: '★', ra: 95.99, dec: -52.70, mag: -0.74, dist: '310 ly', temp: '7,350 K', color: 'White-yellow', exoplanets: 0, fact: 'Second brightest star' },
  { name: 'Arcturus', type: 'star', constellation: 'Boötes', icon: '★', ra: 213.92, dec: 19.18, mag: -0.05, dist: '37 ly', temp: '4,286 K', color: 'Orange', exoplanets: 0, fact: 'Brightest star in northern hemisphere' },
  { name: 'Vega', type: 'star', constellation: 'Lyra', icon: '✦', ra: 279.23, dec: 38.78, mag: 0.03, dist: '25 ly', temp: '9,602 K', color: 'Blue-white', exoplanets: 0, fact: 'Will be North Star in ~13,727 years' },
  { name: 'Capella', type: 'star', constellation: 'Auriga', icon: '★', ra: 79.17, dec: 45.99, mag: 0.08, dist: '43 ly', temp: '4,940 K', color: 'Yellow', exoplanets: 0, fact: 'Actually a quadruple star system' },
  { name: 'Rigel', type: 'star', constellation: 'Orion', icon: '★', ra: 78.63, dec: -8.20, mag: 0.13, dist: '860 ly', temp: '12,100 K', color: 'Blue supergiant', exoplanets: 0, fact: 'One of the most luminous stars known' },
  { name: 'Procyon', type: 'star', constellation: 'Canis Minor', icon: '★', ra: 114.83, dec: 5.22, mag: 0.34, dist: '11.5 ly', temp: '6,530 K', color: 'Yellow-white', exoplanets: 0, fact: 'Has a white dwarf companion' },
  { name: 'Betelgeuse', type: 'star', constellation: 'Orion', icon: '✦', ra: 88.79, dec: 7.41, mag: 0.42, dist: '700 ly', temp: '3,500 K', color: 'Red supergiant', exoplanets: 0, fact: 'Will explode as supernova someday' },
  { name: 'Altair', type: 'star', constellation: 'Aquila', icon: '★', ra: 297.70, dec: 8.87, mag: 0.76, dist: '17 ly', temp: '7,670 K', color: 'White', exoplanets: 0, fact: 'Rotates so fast it bulges at equator' },
  { name: 'Aldebaran', type: 'star', constellation: 'Taurus', icon: '★', ra: 68.98, dec: 16.51, mag: 0.86, dist: '65 ly', temp: '3,910 K', color: 'Red giant', exoplanets: 1, fact: 'Has one confirmed exoplanet' },
  { name: 'Spica', type: 'star', constellation: 'Virgo', icon: '★', ra: 201.30, dec: -11.16, mag: 0.97, dist: '250 ly', temp: '25,300 K', color: 'Blue-white', exoplanets: 0, fact: 'A binary star system' },
  { name: 'Antares', type: 'star', constellation: 'Scorpius', icon: '✦', ra: 247.35, dec: -26.43, mag: 1.06, dist: '550 ly', temp: '3,400 K', color: 'Red supergiant', exoplanets: 0, fact: 'Rival of Mars — reddish like the planet' },
  { name: 'Pollux', type: 'star', constellation: 'Gemini', icon: '★', ra: 116.33, dec: 28.03, mag: 1.16, dist: '34 ly', temp: '4,586 K', color: 'Orange giant', exoplanets: 1, fact: 'Confirmed exoplanet: Pollux b' },
  { name: 'Fomalhaut', type: 'star', constellation: 'Piscis Austrinus', icon: '★', ra: 344.41, dec: -29.62, mag: 1.17, dist: '25 ly', temp: '8,590 K', color: 'White', exoplanets: 1, fact: 'Has a debris disk and exoplanet candidate' },
  { name: 'Deneb', type: 'star', constellation: 'Cygnus', icon: '✦', ra: 310.36, dec: 45.28, mag: 1.25, dist: '2,600 ly', temp: '8,525 K', color: 'Blue-white supergiant', exoplanets: 0, fact: 'One of the most luminous stars in the galaxy' },
  { name: 'Mimosa', type: 'star', constellation: 'Crux', icon: '★', ra: 191.93, dec: -59.69, mag: 1.30, dist: '280 ly', temp: '30,000 K', color: 'Blue giant', exoplanets: 0, fact: 'Part of the Southern Cross' },
  { name: 'Regulus', type: 'star', constellation: 'Leo', icon: '★', ra: 152.09, dec: 11.97, mag: 1.35, dist: '79 ly', temp: '12,460 K', color: 'Blue-white', exoplanets: 0, fact: 'Heart of the Lion constellation' },
  { name: 'Tau Ceti', type: 'star', constellation: 'Cetus', icon: '✦', ra: 26.02, dec: -15.94, mag: 3.50, dist: '11.9 ly', temp: '5,344 K', color: 'Yellow', exoplanets: 4, fact: '4 exoplanets, some in habitable zone!' },
  { name: 'Kepler-442', type: 'star', constellation: 'Lyra', icon: '✦', ra: 280.1, dec: 39.3, mag: 14.0, dist: '1,200 ly', temp: '4,402 K', color: 'Orange dwarf', exoplanets: 1, fact: 'Has a super-Earth in habitable zone' },
  { name: 'Jupiter', type: 'planet', constellation: 'Current position', icon: '⬤', ra: 0, dec: 0, mag: -2.5, dist: '~5 AU', temp: '-110°C', color: 'Gas giant', exoplanets: 0, fact: 'Largest planet, 79 known moons', isDynamic: true },
  { name: 'Saturn', type: 'planet', constellation: 'Current position', icon: '⬤', ra: 0, dec: 0, mag: 0.5, dist: '~9.5 AU', temp: '-140°C', color: 'Gas giant', exoplanets: 0, fact: 'Ring system visible with binoculars', isDynamic: true },
  { name: 'Mars', type: 'planet', constellation: 'Current position', icon: '⬤', ra: 0, dec: 0, mag: 0.8, dist: '~1.5 AU', temp: '-65°C avg', color: 'Red planet', exoplanets: 0, fact: 'Humans plan to visit in the 2030s', isDynamic: true },
  { name: 'Venus', type: 'planet', constellation: 'Current position', icon: '⬤', ra: 0, dec: 0, mag: -4.5, dist: '~0.7 AU', temp: '462°C surface', color: 'Yellow-white', exoplanets: 0, fact: 'Brightest planet, hottest surface', isDynamic: true },
];

// ── NASA Exoplanet API ──
try {
  // Load the 1000 bright stars from our local NASA database snapshot
  const url = './data/catalog.json';
  const response = await fetch(url);
  const apiStars = await response.json();
  
  // Track existing to avoid duplicates
  const existingNames = new Set(STARS.map(s => s.name.toLowerCase()));
  
  // Filter unique and map to our format
  const formattedStars = apiStars
    .filter(star => !existingNames.has(star.hostname.toLowerCase()))
    .map(star => ({
      name: star.hostname,
      type: 'star',
      constellation: 'Deep Space',
      icon: '✦',
      ra: star.ra,
      dec: star.dec,
      mag: star.sy_vmag,
      dist: 'Unknown',
      temp: 'Unknown',
      color: 'White-yellow',
      exoplanets: 1,
      fact: 'Confirmed exoplanet host (NASA Archive)'
    }));
    
  STARS = [...STARS, ...formattedStars];
} catch (error) {
  console.warn("Could not load NASA exoplanet data. Working in offline mode with default stars.");
}
