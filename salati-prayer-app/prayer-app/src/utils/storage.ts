/**
 * Local Storage Manager
 * Handles all app settings and data persistence using AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTimesConfig, DEFAULT_CONFIG, CalculationMethodKey, AsrMethodKey } from './prayerTimes';

const KEYS = {
  SETTINGS: '@salati_settings',
  NOTIFICATION_PREFS: '@salati_notifications',
  ATHKAR_PROGRESS: '@salati_athkar_progress',
  FIRST_LAUNCH: '@salati_first_launch',
  THEME: '@salati_theme',
};

// ============================================================
// APP SETTINGS
// ============================================================
export interface AppSettings {
  prayerConfig: PrayerTimesConfig;
  use24Hour: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  lastKnownLat: number | null;
  lastKnownLng: number | null;
  lastKnownCity: string | null;
  lastKnownTimezone: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  prayerConfig: DEFAULT_CONFIG,
  use24Hour: false,
  theme: 'auto',
  language: 'en',
  lastKnownLat: null,
  lastKnownLng: null,
  lastKnownCity: null,
  lastKnownTimezone: 0,
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const json = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (json) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// ============================================================
// NOTIFICATION PREFERENCES
// ============================================================
export interface NotificationPrefs {
  fajr: boolean;
  sunrise: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  minutesBefore: number;
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  fajr: true,
  sunrise: false,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
  soundEnabled: true,
  vibrationEnabled: true,
  minutesBefore: 0,
};

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  try {
    const json = await AsyncStorage.getItem(KEYS.NOTIFICATION_PREFS);
    if (json) {
      return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(json) };
    }
    return DEFAULT_NOTIFICATION_PREFS;
  } catch {
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

export async function saveNotificationPrefs(prefs: Partial<NotificationPrefs>): Promise<void> {
  try {
    const current = await getNotificationPrefs();
    const updated = { ...current, ...prefs };
    await AsyncStorage.setItem(KEYS.NOTIFICATION_PREFS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save notification prefs:', e);
  }
}

// ============================================================
// ATHKAR PROGRESS
// ============================================================
export async function getAthkarProgress(date: string): Promise<Record<string, number>> {
  try {
    const json = await AsyncStorage.getItem(`${KEYS.ATHKAR_PROGRESS}_${date}`);
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

export async function saveAthkarProgress(date: string, progress: Record<string, number>): Promise<void> {
  try {
    await AsyncStorage.setItem(`${KEYS.ATHKAR_PROGRESS}_${date}`, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save athkar progress:', e);
  }
}

// ============================================================
// FIRST LAUNCH
// ============================================================
export async function isFirstLaunch(): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH);
    if (val === null) {
      await AsyncStorage.setItem(KEYS.FIRST_LAUNCH, 'false');
      return true;
    }
    return false;
  } catch {
    return true;
  }
}
