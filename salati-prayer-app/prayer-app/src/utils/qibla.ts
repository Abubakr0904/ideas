/**
 * Qibla Direction Calculator
 * Calculates the direction to the Kaaba in Makkah from any point on Earth
 */

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

/**
 * Calculate Qibla direction from a given location
 * @returns Bearing in degrees from North (0-360, clockwise)
 */
export function calculateQiblaDirection(latitude: number, longitude: number): number {
  const lat1 = latitude * DEG;
  const lng1 = longitude * DEG;
  const lat2 = KAABA_LAT * DEG;
  const lng2 = KAABA_LNG * DEG;

  const dLng = lng2 - lng1;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = Math.atan2(y, x) * RAD;

  // Normalize to 0-360
  bearing = ((bearing % 360) + 360) % 360;

  return bearing;
}

/**
 * Calculate the distance to the Kaaba using the Haversine formula
 * @returns Distance in kilometers
 */
export function distanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (KAABA_LAT - latitude) * DEG;
  const dLng = (KAABA_LNG - longitude) * DEG;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latitude * DEG) * Math.cos(KAABA_LAT * DEG) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Get compass direction label from bearing
 */
export function bearingToCardinal(bearing: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
}
