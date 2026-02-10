/**
 * Hijri (Islamic) Calendar Conversion
 * Uses the Umm al-Qura calendar approximation algorithm
 */

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
];

const HIJRI_MONTHS_SHORT = [
  'Muh', 'Saf', 'Rab I', 'Rab II',
  'Jum I', 'Jum II', 'Raj', 'Sha',
  'Ram', 'Shaw', 'Dhul Q', 'Dhul H',
];

export interface HijriDate {
  day: number;
  month: number;       // 1-based
  year: number;
  monthName: string;
  monthNameShort: string;
  formatted: string;   // "15 Ramadan 1446"
}

/**
 * Convert Gregorian date to Hijri date (approximate)
 * Based on the Kuwaiti algorithm
 */
export function gregorianToHijri(date: Date): HijriDate {
  let day = date.getDate();
  let month = date.getMonth(); // 0-based
  let year = date.getFullYear();

  // Adjust for months
  if (month < 2) {
    year -= 1;
    month += 12;
  }

  // Julian Day Number
  const jd = Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day - 1524.5;

  // Gregorian calendar correction
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jdGregorian = jd + B;

  // Islamic calendar epoch
  const l = Math.floor(jdGregorian - 1948439.5) + 10632;
  const n = Math.floor((l - 1) / 10631);
  const lRem = l - 10631 * n + 354;
  const j = Math.floor((10985 - lRem) / 5316) *
    Math.floor((50 * lRem) / 17719) +
    Math.floor(lRem / 5670) *
    Math.floor((43 * lRem) / 15238);
  const lFinal = lRem - Math.floor((30 - j) / 15) *
    Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) *
    Math.floor((15238 * j) / 43) + 29;

  const hijriMonth = Math.floor((24 * lFinal) / 709);
  const hijriDay = lFinal - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthName: HIJRI_MONTHS[hijriMonth - 1] || '',
    monthNameShort: HIJRI_MONTHS_SHORT[hijriMonth - 1] || '',
    formatted: `${hijriDay} ${HIJRI_MONTHS[hijriMonth - 1] || ''} ${hijriYear}`,
  };
}

export { HIJRI_MONTHS, HIJRI_MONTHS_SHORT };
