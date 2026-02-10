/**
 * Settings Screen
 * Configure calculation method, Asr juristic method, notifications, theme, etc.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useSettings } from '../hooks';
import {
  CalculationMethods,
  CalculationMethodKey,
  AsrMethods,
  AsrMethodKey,
} from '../utils/prayerTimes';
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  NotificationPrefs,
} from '../utils/storage';
import { requestNotificationPermissions } from '../utils/notifications';
import { ThemeColors, Typography, Spacing, BorderRadius } from '../theme';

// ============================================================
// Picker Modal (simple inline)
// ============================================================
function OptionPicker<T extends string>({
  title,
  options,
  selected,
  onSelect,
  onClose,
  colors,
}: {
  title: string;
  options: { key: T; label: string; subtitle?: string }[];
  selected: T;
  onSelect: (key: T) => void;
  onClose: () => void;
  colors: ThemeColors;
}) {
  const styles = makePickerStyles(colors);
  return (
    <View style={styles.pickerOverlay}>
      <View style={styles.pickerContainer}>
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.pickerList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.pickerOption,
                selected === opt.key && styles.pickerOptionSelected,
              ]}
              onPress={() => {
                onSelect(opt.key);
                onClose();
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.pickerOptionText,
                    selected === opt.key && styles.pickerOptionTextSelected,
                  ]}
                >
                  {opt.label}
                </Text>
                {opt.subtitle && (
                  <Text style={styles.pickerOptionSubtitle}>{opt.subtitle}</Text>
                )}
              </View>
              {selected === opt.key && (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const makePickerStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pickerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: BorderRadius.xl,
      borderTopRightRadius: BorderRadius.xl,
      maxHeight: '70%',
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerTitle: { ...Typography.h3, color: colors.text },
    pickerList: { paddingHorizontal: Spacing.md },
    pickerOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    pickerOptionSelected: {},
    pickerOptionText: { ...Typography.body, color: colors.text },
    pickerOptionTextSelected: { color: colors.primary, fontWeight: '600' },
    pickerOptionSubtitle: { ...Typography.caption, color: colors.textMuted, marginTop: 2 },
  });

// ============================================================
// Settings Screen
// ============================================================
export default function SettingsScreen() {
  const { settings, loading, updateSettings } = useSettings();
  const { colors } = useTheme(settings?.theme);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs | null>(null);
  const [showPicker, setShowPicker] = useState<string | null>(null);

  useEffect(() => {
    getNotificationPrefs().then(setNotifPrefs);
  }, []);

  if (loading || !settings || !notifPrefs) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  const currentCalcMethod = CalculationMethods[settings.prayerConfig.calculationMethod];
  const currentAsrMethod = AsrMethods[settings.prayerConfig.asrMethod];

  const updateNotifPref = async (key: keyof NotificationPrefs, value: any) => {
    const updated = { ...notifPrefs, [key]: value };
    setNotifPrefs(updated);
    await saveNotificationPrefs({ [key]: value });
  };

  const handleNotificationToggle = async (key: keyof NotificationPrefs, value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive prayer reminders.'
        );
        return;
      }
    }
    updateNotifPref(key, value);
  };

  const styles = makeStyles(colors);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* PRAYER CALCULATION */}
        <Text style={styles.sectionTitle}>Prayer Calculation</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowPicker('calcMethod')}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Calculation Method</Text>
              <Text style={styles.settingValue}>{currentCalcMethod.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowPicker('asrMethod')}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Asr Calculation</Text>
              <Text style={styles.settingValue}>{currentAsrMethod.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer, i) => (
            <React.Fragment key={prayer}>
              {i > 0 && <View style={styles.separator} />}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>
                  {prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                </Text>
                <Switch
                  value={notifPrefs[prayer]}
                  onValueChange={(v) => handleNotificationToggle(prayer, v)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={notifPrefs[prayer] ? colors.primary : colors.textMuted}
                />
              </View>
            </React.Fragment>
          ))}
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound</Text>
            <Switch
              value={notifPrefs.soundEnabled}
              onValueChange={(v) => updateNotifPref('soundEnabled', v)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notifPrefs.soundEnabled ? colors.primary : colors.textMuted}
            />
          </View>
          <View style={styles.separator} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Vibration</Text>
            <Switch
              value={notifPrefs.vibrationEnabled}
              onValueChange={(v) => updateNotifPref('vibrationEnabled', v)}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notifPrefs.vibrationEnabled ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        {/* APPEARANCE */}
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowPicker('theme')}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingValue}>
                {settings.theme === 'auto' ? 'System Default' : settings.theme === 'dark' ? 'Dark' : 'Light'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>24-hour format</Text>
            <Switch
              value={settings.use24Hour}
              onValueChange={(v) => updateSettings({ use24Hour: v })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={settings.use24Hour ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        {/* ABOUT */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      {/* PICKERS */}
      {showPicker === 'calcMethod' && (
        <OptionPicker
          title="Calculation Method"
          options={Object.entries(CalculationMethods).map(([key, val]) => ({
            key: key as CalculationMethodKey,
            label: val.name,
          }))}
          selected={settings.prayerConfig.calculationMethod}
          onSelect={(key) => {
            updateSettings({
              prayerConfig: { ...settings.prayerConfig, calculationMethod: key },
            });
          }}
          onClose={() => setShowPicker(null)}
          colors={colors}
        />
      )}

      {showPicker === 'asrMethod' && (
        <OptionPicker
          title="Asr Calculation"
          options={Object.entries(AsrMethods).map(([key, val]) => ({
            key: key as AsrMethodKey,
            label: val.name,
          }))}
          selected={settings.prayerConfig.asrMethod}
          onSelect={(key) => {
            updateSettings({
              prayerConfig: { ...settings.prayerConfig, asrMethod: key },
            });
          }}
          onClose={() => setShowPicker(null)}
          colors={colors}
        />
      )}

      {showPicker === 'theme' && (
        <OptionPicker
          title="Theme"
          options={[
            { key: 'auto' as const, label: 'System Default' },
            { key: 'light' as const, label: 'Light' },
            { key: 'dark' as const, label: 'Dark' },
          ]}
          selected={settings.theme}
          onSelect={(key) => updateSettings({ theme: key })}
          onClose={() => setShowPicker(null)}
          colors={colors}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    content: {
      padding: Spacing.md,
    },
    pageTitle: {
      ...Typography.h1,
      color: colors.text,
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      ...Typography.label,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      marginBottom: Spacing.sm,
      marginTop: Spacing.lg,
      marginLeft: Spacing.xs,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: BorderRadius.lg,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 2,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
    },
    settingLabel: {
      ...Typography.body,
      color: colors.text,
    },
    settingValue: {
      ...Typography.bodySmall,
      color: colors.textSecondary,
      marginTop: 2,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginHorizontal: Spacing.md,
    },
  });
