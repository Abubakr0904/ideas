/**
 * Home Screen
 * Shows all prayer times, next prayer countdown, and Hijri date
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLocation, usePrayerTimes, useCountdown, useSettings } from '../hooks';
import { formatPrayerTime, PrayerName } from '../utils/prayerTimes';
import { gregorianToHijri } from '../utils/hijriCalendar';
import { ThemeColors, Typography, Spacing, BorderRadius } from '../theme';

const PRAYER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Fajr: 'sunny-outline',
  Sunrise: 'sunny',
  Dhuhr: 'sunny',
  Asr: 'partly-sunny-outline',
  Maghrib: 'cloudy-night-outline',
  Isha: 'moon-outline',
};

export default function HomeScreen() {
  const { settings } = useSettings();
  const { colors, isDark } = useTheme(settings?.theme);
  const { location, loading: locationLoading, error: locationError, refresh } = useLocation();
  const { prayerTimes, nextPrayer, currentPrayer, timeUntilNext } = usePrayerTimes(
    location,
    settings?.prayerConfig
  );
  const countdown = useCountdown(timeUntilNext);

  const today = new Date();
  const hijriDate = useMemo(() => gregorianToHijri(today), [today.toDateString()]);
  const gregorianFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prayerList: { name: PrayerName; key: keyof NonNullable<typeof prayerTimes> }[] = [
    { name: 'Fajr', key: 'fajr' },
    { name: 'Sunrise', key: 'sunrise' },
    { name: 'Dhuhr', key: 'dhuhr' },
    { name: 'Asr', key: 'asr' },
    { name: 'Maghrib', key: 'maghrib' },
    { name: 'Isha', key: 'isha' },
  ];

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={locationLoading} onRefresh={refresh} tintColor={colors.primary} />
        }
      >
        {/* Header with location */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationText}>
              <Ionicons name="location-outline" size={16} color={colors.primary} />{' '}
              {location?.city || 'Loading...'}
              {location?.country ? `, ${location.country}` : ''}
            </Text>
            <Text style={styles.hijriDate}>{hijriDate.formatted}</Text>
            <Text style={styles.gregorianDate}>{gregorianFormatted}</Text>
          </View>
        </View>

        {/* Next Prayer Card */}
        {nextPrayer && (
          <View style={styles.nextPrayerCard}>
            <View style={styles.nextPrayerTop}>
              <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
              <View style={styles.nextPrayerNameRow}>
                <Ionicons
                  name={PRAYER_ICONS[nextPrayer] || 'time-outline'}
                  size={28}
                  color={colors.nextPrayerText}
                />
                <Text style={styles.nextPrayerName}>{nextPrayer}</Text>
              </View>
              {prayerTimes && (
                <Text style={styles.nextPrayerTime}>
                  {formatPrayerTime(
                    prayerTimes[nextPrayer.toLowerCase() as keyof typeof prayerTimes],
                    settings?.use24Hour
                  )}
                </Text>
              )}
            </View>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.countdownLabel}>remaining</Text>
            </View>
          </View>
        )}

        {/* Error state */}
        {locationError && (
          <View style={styles.errorCard}>
            <Ionicons name="warning-outline" size={24} color={colors.error} />
            <Text style={styles.errorText}>{locationError}</Text>
            <TouchableOpacity onPress={refresh} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Prayer Times List */}
        <View style={styles.prayerListCard}>
          <Text style={styles.sectionTitle}>Prayer Times</Text>
          {prayerList.map((prayer) => {
            const isNext = nextPrayer === prayer.name;
            const isCurrent = currentPrayer === prayer.name;
            const time = prayerTimes?.[prayer.key];

            return (
              <View
                key={prayer.name}
                style={[
                  styles.prayerRow,
                  isNext && styles.prayerRowHighlight,
                ]}
              >
                <View style={styles.prayerRowLeft}>
                  <View
                    style={[
                      styles.prayerIconContainer,
                      isNext && styles.prayerIconHighlight,
                    ]}
                  >
                    <Ionicons
                      name={PRAYER_ICONS[prayer.name]}
                      size={20}
                      color={isNext ? colors.nextPrayerText : colors.textSecondary}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.prayerName,
                        isNext && styles.prayerNameHighlight,
                      ]}
                    >
                      {prayer.name}
                    </Text>
                    {isCurrent && (
                      <Text style={styles.currentLabel}>Current</Text>
                    )}
                  </View>
                </View>
                <Text
                  style={[
                    styles.prayerTime,
                    isNext && styles.prayerTimeHighlight,
                  ]}
                >
                  {time ? formatPrayerTime(time, settings?.use24Hour) : '--:--'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    header: {
      marginBottom: Spacing.lg,
    },
    locationText: {
      ...Typography.body,
      color: colors.primary,
      fontWeight: '600',
      marginBottom: Spacing.xs,
    },
    hijriDate: {
      ...Typography.h2,
      color: colors.text,
      marginBottom: 2,
    },
    gregorianDate: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
    },

    // Next Prayer Card
    nextPrayerCard: {
      backgroundColor: colors.nextPrayerBg,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    nextPrayerTop: {
      marginBottom: Spacing.md,
    },
    nextPrayerLabel: {
      ...Typography.caption,
      color: 'rgba(255,255,255,0.7)',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: Spacing.sm,
    },
    nextPrayerNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    nextPrayerName: {
      ...Typography.h1,
      color: colors.nextPrayerText,
    },
    nextPrayerTime: {
      ...Typography.prayerTime,
      color: 'rgba(255,255,255,0.85)',
      marginTop: Spacing.xs,
      marginLeft: 36,
    },
    countdownContainer: {
      alignItems: 'center',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.15)',
    },
    countdownText: {
      ...Typography.countdown,
      color: colors.nextPrayerText,
    },
    countdownLabel: {
      ...Typography.caption,
      color: 'rgba(255,255,255,0.6)',
      marginTop: 2,
    },

    // Error
    errorCard: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    errorText: {
      ...Typography.bodySmall,
      color: colors.error,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
    },
    retryText: {
      ...Typography.label,
      color: '#FFFFFF',
    },

    // Prayer List
    prayerListCard: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      ...Typography.h3,
      color: colors.text,
      marginBottom: Spacing.md,
      paddingHorizontal: Spacing.sm,
    },
    prayerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    prayerRowHighlight: {
      backgroundColor: colors.prayerHighlight,
    },
    prayerRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    prayerIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },
    prayerIconHighlight: {
      backgroundColor: colors.primary,
    },
    prayerName: {
      ...Typography.body,
      color: colors.text,
      fontWeight: '500',
    },
    prayerNameHighlight: {
      color: colors.primary,
      fontWeight: '700',
    },
    currentLabel: {
      ...Typography.caption,
      color: colors.accent,
      fontWeight: '600',
    },
    prayerTime: {
      ...Typography.prayerTime,
      color: colors.text,
    },
    prayerTimeHighlight: {
      color: colors.primary,
    },
  });
