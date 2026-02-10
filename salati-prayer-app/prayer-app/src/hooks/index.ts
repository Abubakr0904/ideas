/**
 * Custom Hooks
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useColorScheme, AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';
import { Colors, ThemeColors } from '../theme';
import {
  PrayerTimes,
  PrayerTimesConfig,
  DEFAULT_CONFIG,
  calculatePrayerTimes,
  getNextPrayer,
  PrayerName,
} from '../utils/prayerTimes';
import { getSettings, saveSettings, AppSettings } from '../utils/storage';

// ============================================================
// useTheme - Returns current theme colors based on user preference
// ============================================================
export function useTheme(themePreference: 'light' | 'dark' | 'auto' = 'auto'): {
  colors: ThemeColors;
  isDark: boolean;
} {
  const systemScheme = useColorScheme();
  const isDark =
    themePreference === 'auto'
      ? systemScheme === 'dark'
      : themePreference === 'dark';

  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
}

// ============================================================
// useLocation - Gets and watches user location
// ============================================================
export interface LocationData {
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  timezone: number;
}

export function useLocation(): {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Try to load last known from settings
        const settings = await getSettings();
        if (settings.lastKnownLat && settings.lastKnownLng) {
          setLocation({
            latitude: settings.lastKnownLat,
            longitude: settings.lastKnownLng,
            city: settings.lastKnownCity,
            country: null,
            timezone: settings.lastKnownTimezone,
          });
        } else {
          setError('Location permission denied. Please enable it in settings.');
        }
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get city name
      let city: string | null = null;
      let country: string | null = null;
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geo) {
          city = geo.city || geo.subregion || geo.region || null;
          country = geo.country || null;
        }
      } catch {
        // Geocoding failed, continue without city name
      }

      const timezone = new Date().getTimezoneOffset() / -60;

      const locationData: LocationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        city,
        country,
        timezone,
      };

      setLocation(locationData);

      // Save as last known location
      await saveSettings({
        lastKnownLat: locationData.latitude,
        lastKnownLng: locationData.longitude,
        lastKnownCity: locationData.city,
        lastKnownTimezone: locationData.timezone,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to get location');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, loading, error, refresh: fetchLocation };
}

// ============================================================
// usePrayerTimes - Calculates prayer times based on location
// ============================================================
export function usePrayerTimes(
  location: LocationData | null,
  config: PrayerTimesConfig = DEFAULT_CONFIG,
  date: Date = new Date()
): {
  prayerTimes: PrayerTimes | null;
  nextPrayer: PrayerName | null;
  currentPrayer: PrayerName | null;
  timeUntilNext: number;
} {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState(0);

  // Calculate prayer times when location or date changes
  useEffect(() => {
    if (!location) return;

    const times = calculatePrayerTimes(
      date,
      location.latitude,
      location.longitude,
      location.timezone,
      config
    );
    setPrayerTimes(times);
  }, [location, config, date.toDateString()]);

  // Update next prayer countdown every second
  useEffect(() => {
    if (!prayerTimes) return;

    const updateNext = () => {
      const { current, next, timeUntilNext: timeLeft } = getNextPrayer(prayerTimes);
      setCurrentPrayer(current);
      setNextPrayer(next);
      setTimeUntilNext(timeLeft);
    };

    updateNext();
    const interval = setInterval(updateNext, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return { prayerTimes, nextPrayer, currentPrayer, timeUntilNext };
}

// ============================================================
// useSettings - App settings management
// ============================================================
export function useSettings(): {
  settings: AppSettings | null;
  loading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
} {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    await saveSettings(updates);
    setSettings((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return { settings, loading, updateSettings };
}

// ============================================================
// useCountdown - Formats milliseconds into readable countdown
// ============================================================
export function useCountdown(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

// ============================================================
// useAppState - Tracks app foreground/background state
// ============================================================
export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub.remove();
  }, []);

  return appState;
}
