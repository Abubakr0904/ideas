/**
 * Prayer Time Calculation Engine
 * Based on astronomical algorithms used by major Islamic organizations
 * Supports multiple calculation methods (ISNA, MWL, Egypt, Umm Al-Qura, etc.)
 */

// ============================================================
// CALCULATION METHODS
// ============================================================
export const CalculationMethods = {
  MWL: {
    name: 'Muslim World League',
    params: { fajrAngle: 18, ishaAngle: 17 },
  },
  ISNA: {
    name: 'Islamic Society of North America',
    params: { fajrAngle: 15, ishaAngle: 15 },
  },
  EGYPT: {
    name: 'Egyptian General Authority of Survey',
    params: { fajrAngle: 19.5, ishaAngle: 17.5 },
  },
  MAKKAH: {
    name: 'Umm Al-Qura University, Makkah',
    params: { fajrAngle: 18.5, ishaMinutes: 90 },
  },
  KARACHI: {
    name: 'University of Islamic Sciences, Karachi',
    params: { fajrAngle: 18, ishaAngle: 18 },
  },
  TEHRAN: {
    name: 'Institute of Geophysics, University of Tehran',
    params: { fajrAngle: 17.7, ishaAngle: 14, maghribAngle: 4.5 },
  },
  JAFARI: {
    name: 'Shia Ithna-Ashari, Leva Institute, Qum',
    params: { fajrAngle: 16, ishaAngle: 14, maghribAngle: 4 },
  },
};

export type CalculationMethodKey = keyof typeof CalculationMethods;

// ============================================================
// JURISTIC METHODS FOR ASR
// ============================================================
export const AsrMethods = {
  STANDARD: { name: 'Standard (Shafi, Maliki, Hanbali)', factor: 1 },
  HANAFI: { name: 'Hanafi', factor: 2 },
};

export type AsrMethodKey = keyof typeof AsrMethods;

// ============================================================
// HIGHER LATITUDE ADJUSTMENT
// ============================================================
export const HighLatMethods = {
  NONE: 'None',
  MIDNIGHT: 'Middle of the Night',
  ONE_SEVENTH: 'One Seventh',
  ANGLE_BASED: 'Angle Based',
};

export type HighLatMethodKey = keyof typeof HighLatMethods;

// ============================================================
// PRAYER NAMES
// ============================================================
export const PrayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PrayerNames)[number];

export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface PrayerTimesConfig {
  calculationMethod: CalculationMethodKey;
  asrMethod: AsrMethodKey;
  highLatMethod: HighLatMethodKey;
  adjustments: Partial<Record<Lowercase<PrayerName>, number>>; // minutes offset
}

export const DEFAULT_CONFIG: PrayerTimesConfig = {
  calculationMethod: 'MWL',
  asrMethod: 'STANDARD',
  highLatMethod: 'ANGLE_BASED',
  adjustments: {},
};

// ============================================================
// MATH HELPERS
// ============================================================
const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

const sin = (d: number) => Math.sin(d * DEG);
const cos = (d: number) => Math.cos(d * DEG);
const tan = (d: number) => Math.tan(d * DEG);
const arcsin = (x: number) => Math.asin(x) * RAD;
const arccos = (x: number) => Math.acos(x) * RAD;
const arctan2 = (y: number, x: number) => Math.atan2(y, x) * RAD;
const arccot = (x: number) => Math.atan(1 / x) * RAD;

function fixAngle(a: number): number {
  return a - 360 * Math.floor(a / 360);
}

function fixHour(h: number): number {
  return h - 24 * Math.floor(h / 24);
}

// ============================================================
// ASTRONOMICAL CALCULATIONS
// ============================================================

/** Julian Date from a JS Date */
function julianDate(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/** Sun position: declination and equation of time */
function sunPosition(jd: number): { declination: number; equation: number } {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));

  const e = 23.439 - 0.00000036 * D;
  const RA = arctan2(cos(e) * sin(L), cos(L)) / 15;
  const declination = arcsin(sin(e) * sin(L));
  const equation = q / 15 - fixHour(RA);

  return { declination, equation };
}

/** Mid-day (Dhuhr) time */
function midDay(jd: number, timezone: number): number {
  const { equation } = sunPosition(jd + 0.5);
  return fixHour(12 - equation - timezone / 15);
}

/** Sun angle time — hours from mid-day for a given angle */
function sunAngleTime(
  jd: number,
  angle: number,
  latitude: number,
  timezone: number,
  direction: 'CW' | 'CCW' = 'CW'
): number {
  const { declination } = sunPosition(jd + 0.5);
  const mid = midDay(jd, timezone);

  const numerator = -sin(angle) - sin(declination) * sin(latitude);
  const denominator = cos(declination) * cos(latitude);
  const ratio = numerator / denominator;

  // Handle extreme latitudes
  if (ratio > 1 || ratio < -1) {
    return NaN;
  }

  const t = arccos(ratio) / 15;
  return mid + (direction === 'CCW' ? -t : t);
}

/** Asr time based on shadow factor */
function asrTime(
  jd: number,
  factor: number,
  latitude: number,
  timezone: number
): number {
  const { declination } = sunPosition(jd + 0.5);
  const angle = -arccot(factor + tan(Math.abs(latitude - declination)));
  return sunAngleTime(jd, angle, latitude, timezone);
}

// ============================================================
// MAIN CALCULATION
// ============================================================
export function calculatePrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: number, // hours offset from UTC (e.g., +3 for Riyadh)
  config: PrayerTimesConfig = DEFAULT_CONFIG
): PrayerTimes {
  const jd = julianDate(date);
  const method = CalculationMethods[config.calculationMethod];
  const asrFactor = AsrMethods[config.asrMethod].factor;
  const adjustments = config.adjustments;

  // Longitude correction: difference between timezone center and actual longitude
  const lngCorrection = (timezone * 15 - longitude) / 15;

  // Raw times (in hours)
  const fajrRaw = sunAngleTime(jd, method.params.fajrAngle, latitude, timezone, 'CCW') + lngCorrection;
  const sunriseRaw = sunAngleTime(jd, 0.833, latitude, timezone, 'CCW') + lngCorrection; // 0.833 accounts for refraction + sun radius
  const dhuhrRaw = midDay(jd, timezone) + lngCorrection + 1 / 60; // 1 min after midday as precaution
  const asrRaw = asrTime(jd, asrFactor, latitude, timezone) + lngCorrection;
  const maghribRaw = sunAngleTime(jd, 0.833, latitude, timezone) + lngCorrection;

  let ishaRaw: number;
  if ('ishaMinutes' in method.params) {
    ishaRaw = maghribRaw + (method.params as any).ishaMinutes / 60;
  } else {
    ishaRaw = sunAngleTime(jd, (method.params as any).ishaAngle, latitude, timezone) + lngCorrection;
  }

  // Apply higher latitude adjustments if needed
  const times = applyHighLatAdjustment(
    { fajr: fajrRaw, sunrise: sunriseRaw, dhuhr: dhuhrRaw, asr: asrRaw, maghrib: maghribRaw, isha: ishaRaw },
    method,
    config.highLatMethod,
    latitude
  );

  // Apply manual adjustments (minutes)
  times.fajr += (adjustments.fajr || 0) / 60;
  times.sunrise += (adjustments.sunrise || 0) / 60;
  times.dhuhr += (adjustments.dhuhr || 0) / 60;
  times.asr += (adjustments.asr || 0) / 60;
  times.maghrib += (adjustments.maghrib || 0) / 60;
  times.isha += (adjustments.isha || 0) / 60;

  // Convert hours to Date objects
  return {
    fajr: hoursToDate(date, times.fajr),
    sunrise: hoursToDate(date, times.sunrise),
    dhuhr: hoursToDate(date, times.dhuhr),
    asr: hoursToDate(date, times.asr),
    maghrib: hoursToDate(date, times.maghrib),
    isha: hoursToDate(date, times.isha),
  };
}

// ============================================================
// HIGH LATITUDE ADJUSTMENT
// ============================================================
interface RawTimes {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

function applyHighLatAdjustment(
  times: RawTimes,
  method: (typeof CalculationMethods)[CalculationMethodKey],
  highLatMethod: HighLatMethodKey,
  _latitude: number
): RawTimes {
  if (highLatMethod === 'NONE') return times;

  const nightTime = times.sunrise + 24 - times.maghrib; // night duration

  if (highLatMethod === 'MIDNIGHT') {
    const halfNight = nightTime / 2;
    if (isNaN(times.fajr) || times.sunrise - times.fajr > halfNight) {
      times.fajr = times.sunrise - halfNight;
    }
    if (isNaN(times.isha) || times.isha - times.maghrib > halfNight) {
      times.isha = times.maghrib + halfNight;
    }
  } else if (highLatMethod === 'ONE_SEVENTH') {
    const seventh = nightTime / 7;
    if (isNaN(times.fajr) || times.sunrise - times.fajr > seventh) {
      times.fajr = times.sunrise - seventh;
    }
    if (isNaN(times.isha) || times.isha - times.maghrib > seventh) {
      times.isha = times.maghrib + seventh;
    }
  } else if (highLatMethod === 'ANGLE_BASED') {
    const fajrAngle = method.params.fajrAngle;
    const ishaAngle = 'ishaAngle' in method.params ? (method.params as any).ishaAngle : 18;
    const fajrPortion = (nightTime * fajrAngle) / 60;
    const ishaPortion = (nightTime * ishaAngle) / 60;

    if (isNaN(times.fajr) || times.sunrise - times.fajr > fajrPortion) {
      times.fajr = times.sunrise - fajrPortion;
    }
    if (isNaN(times.isha) || times.isha - times.maghrib > ishaPortion) {
      times.isha = times.maghrib + ishaPortion;
    }
  }

  return times;
}

// ============================================================
// HELPERS
// ============================================================
function hoursToDate(date: Date, hours: number): Date {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);

  const result = new Date(date);
  result.setHours(h, m, s, 0);
  return result;
}

/** Get the current/next prayer */
export function getNextPrayer(prayerTimes: PrayerTimes): {
  current: PrayerName | null;
  next: PrayerName;
  timeUntilNext: number; // milliseconds
} {
  const now = new Date();
  const entries: [PrayerName, Date][] = [
    ['Fajr', prayerTimes.fajr],
    ['Sunrise', prayerTimes.sunrise],
    ['Dhuhr', prayerTimes.dhuhr],
    ['Asr', prayerTimes.asr],
    ['Maghrib', prayerTimes.maghrib],
    ['Isha', prayerTimes.isha],
  ];

  for (let i = 0; i < entries.length; i++) {
    if (now < entries[i][1]) {
      return {
        current: i > 0 ? entries[i - 1][0] : null,
        next: entries[i][0],
        timeUntilNext: entries[i][1].getTime() - now.getTime(),
      };
    }
  }

  // After Isha — next prayer is tomorrow's Fajr
  return {
    current: 'Isha',
    next: 'Fajr',
    timeUntilNext: 0, // Will need tomorrow's fajr time
  };
}

/** Format time as 12-hour string */
export function formatPrayerTime(date: Date, use24Hour: boolean = false): string {
  if (use24Hour) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}
