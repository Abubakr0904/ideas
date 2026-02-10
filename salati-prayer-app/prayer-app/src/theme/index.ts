/**
 * App Theme - Islamic-inspired color palette with light/dark mode
 */

export const Colors = {
  light: {
    primary: '#1B6B4A',        // Deep emerald green
    primaryLight: '#2D9B6A',   // Lighter green
    primaryDark: '#0D4A32',    // Darker green
    accent: '#C8A951',         // Gold accent
    accentLight: '#E5D090',    // Light gold
    background: '#F8F6F0',     // Warm off-white
    surface: '#FFFFFF',
    surfaceAlt: '#F0EDE4',     // Slightly darker surface
    text: '#1A1A2E',           // Near black
    textSecondary: '#6B7280',  // Gray
    textMuted: '#9CA3AF',      // Light gray
    border: '#E5E2DA',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    card: '#FFFFFF',
    cardShadow: 'rgba(0,0,0,0.08)',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E2DA',
    activeTab: '#1B6B4A',
    inactiveTab: '#9CA3AF',
    prayerHighlight: 'rgba(27, 107, 74, 0.08)',
    nextPrayerBg: '#1B6B4A',
    nextPrayerText: '#FFFFFF',
    progressBg: '#E5E2DA',
    progressFill: '#1B6B4A',
    overlay: 'rgba(0,0,0,0.3)',
  },
  dark: {
    primary: '#2D9B6A',
    primaryLight: '#3DBF82',
    primaryDark: '#1B6B4A',
    accent: '#C8A951',
    accentLight: '#E5D090',
    background: '#0F1118',
    surface: '#1A1D2E',
    surfaceAlt: '#232740',
    text: '#F0EDE4',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    border: '#2D3148',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    card: '#1A1D2E',
    cardShadow: 'rgba(0,0,0,0.3)',
    tabBar: '#1A1D2E',
    tabBarBorder: '#2D3148',
    activeTab: '#2D9B6A',
    inactiveTab: '#6B7280',
    prayerHighlight: 'rgba(45, 155, 106, 0.12)',
    nextPrayerBg: '#2D9B6A',
    nextPrayerText: '#FFFFFF',
    progressBg: '#2D3148',
    progressFill: '#2D9B6A',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

export type ThemeColors = typeof Colors.light;

export const Typography = {
  // Arabic text
  arabicLarge: {
    fontSize: 28,
    lineHeight: 48,
    fontFamily: undefined as string | undefined, // Will use system Arabic font
  },
  arabicMedium: {
    fontSize: 22,
    lineHeight: 38,
    fontFamily: undefined as string | undefined,
  },

  // English text
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, letterSpacing: 0.5 },
  prayerTime: { fontSize: 20, fontWeight: '600' as const },
  countdown: { fontSize: 36, fontWeight: '700' as const, letterSpacing: -1 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
