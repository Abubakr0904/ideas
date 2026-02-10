/**
 * Qibla Compass Screen
 * Shows direction to Kaaba using device magnetometer
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLocation, useSettings } from '../hooks';
import { calculateQiblaDirection, distanceToKaaba, bearingToCardinal } from '../utils/qibla';
import { ThemeColors, Typography, Spacing, BorderRadius } from '../theme';

export default function QiblaScreen() {
  const { settings } = useSettings();
  const { colors } = useTheme(settings?.theme);
  const { location } = useLocation();
  
  const [heading, setHeading] = useState(0);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [subscription, setSubscription] = useState<any>(null);
  const [sensorAvailable, setSensorAvailable] = useState(true);

  const qiblaDirection = location
    ? calculateQiblaDirection(location.latitude, location.longitude)
    : 0;
  const distance = location
    ? distanceToKaaba(location.latitude, location.longitude)
    : 0;
  const cardinal = bearingToCardinal(qiblaDirection);

  // Calculate the angle the compass needle should point
  const needleAngle = qiblaDirection - heading;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: needleAngle,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [needleAngle]);

  const subscribe = useCallback(() => {
    Magnetometer.isAvailableAsync().then((available) => {
      if (!available) {
        setSensorAvailable(false);
        return;
      }

      Magnetometer.setUpdateInterval(100);
      const sub = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = ((angle + 360) % 360);
        // On Android, the magnetometer gives heading directly
        // On iOS, we need to adjust
        if (Platform.OS === 'ios') {
          angle = (360 - angle) % 360;
        }
        setHeading(angle);
      });
      setSubscription(sub);
    });
  }, []);

  useEffect(() => {
    subscribe();
    return () => {
      subscription?.remove();
    };
  }, [subscribe]);

  const spin = rotateAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const styles = makeStyles(colors);

  return (
    <View style={styles.container}>
      {/* Info Header */}
      <View style={styles.infoSection}>
        <Text style={styles.title}>Qibla Direction</Text>
        <Text style={styles.subtitle}>
          {location?.city ? `From ${location.city}` : 'Getting location...'}
        </Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Direction</Text>
            <Text style={styles.infoValue}>{qiblaDirection.toFixed(1)}° {cardinal}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>
              {distance > 1000
                ? `${(distance / 1000).toFixed(0)}k km`
                : `${distance.toFixed(0)} km`}
            </Text>
          </View>
        </View>
      </View>

      {/* Compass */}
      <View style={styles.compassContainer}>
        {!sensorAvailable ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color={colors.error} />
            <Text style={styles.errorText}>
              Magnetometer not available on this device.
              {'\n'}The Qibla direction is {qiblaDirection.toFixed(1)}° {cardinal}.
            </Text>
          </View>
        ) : (
          <>
            {/* Compass ring */}
            <View style={styles.compassRing}>
              {/* Cardinal directions (static, but rotate with device) */}
              <Animated.View
                style={[
                  styles.compassFace,
                  {
                    transform: [
                      {
                        rotate: rotateAnim.interpolate({
                          inputRange: [-360, 360],
                          outputRange: ['-360deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Kaaba indicator */}
                <View style={styles.kaabaIndicator}>
                  <Text style={styles.kaabaEmoji}>🕋</Text>
                </View>

                {/* Degree markers */}
                {Array.from({ length: 72 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.degreeMark,
                      {
                        transform: [
                          { rotate: `${i * 5}deg` },
                          { translateY: -120 },
                        ],
                      },
                      i % 18 === 0 && styles.degreeMarkMajor,
                    ]}
                  />
                ))}

                {/* N, E, S, W labels */}
                <Text style={[styles.cardinalLabel, styles.cardinalN]}>N</Text>
                <Text style={[styles.cardinalLabel, styles.cardinalE]}>E</Text>
                <Text style={[styles.cardinalLabel, styles.cardinalS]}>S</Text>
                <Text style={[styles.cardinalLabel, styles.cardinalW]}>W</Text>
              </Animated.View>

              {/* Center dot */}
              <View style={styles.centerDot} />
            </View>

            {/* Fixed pointer at top */}
            <View style={styles.fixedPointer}>
              <Ionicons name="caret-up" size={32} color={colors.primary} />
            </View>

            <Text style={styles.headingText}>
              {heading.toFixed(0)}°
            </Text>
          </>
        )}
      </View>

      {/* Calibration hint */}
      <Text style={styles.hint}>
        Move your phone in a figure-8 pattern to calibrate the compass
      </Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      paddingTop: Spacing.lg,
    },
    infoSection: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    title: {
      ...Typography.h2,
      color: colors.text,
    },
    subtitle: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginTop: Spacing.xs,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.lg,
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 3,
    },
    infoItem: {
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
    },
    infoLabel: {
      ...Typography.caption,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    infoValue: {
      ...Typography.h3,
      color: colors.primary,
      marginTop: 4,
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
    },

    // Compass
    compassContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    compassRing: {
      width: 280,
      height: 280,
      borderRadius: 140,
      borderWidth: 3,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.card,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 5,
    },
    compassFace: {
      width: 280,
      height: 280,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    kaabaIndicator: {
      position: 'absolute',
      top: 8,
      alignSelf: 'center',
    },
    kaabaEmoji: {
      fontSize: 28,
    },
    degreeMark: {
      position: 'absolute',
      width: 1,
      height: 8,
      backgroundColor: colors.border,
    },
    degreeMarkMajor: {
      height: 14,
      width: 2,
      backgroundColor: colors.textSecondary,
    },
    cardinalLabel: {
      position: 'absolute',
      ...Typography.label,
      color: colors.textSecondary,
    },
    cardinalN: { top: 30, color: colors.primary, fontWeight: '700' },
    cardinalE: { right: 30 },
    cardinalS: { bottom: 30 },
    cardinalW: { left: 30 },
    centerDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
      zIndex: 10,
    },
    fixedPointer: {
      position: 'absolute',
      top: 0,
      marginTop: -4,
    },
    headingText: {
      ...Typography.h3,
      color: colors.textSecondary,
      marginTop: Spacing.md,
    },

    // Error
    errorContainer: {
      alignItems: 'center',
      padding: Spacing.xl,
    },
    errorText: {
      ...Typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.md,
    },

    hint: {
      ...Typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xl,
    },
  });
