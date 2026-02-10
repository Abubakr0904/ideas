/**
 * Notification Manager
 * Schedules local notifications for prayer times
 */
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { PrayerTimes, PrayerName } from './prayerTimes';
import { NotificationPrefs, getNotificationPrefs } from './storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PRAYER_MESSAGES: Record<string, { title: string; body: string }> = {
  fajr: { title: '🌅 Fajr Prayer', body: 'It is time for Fajr prayer. Start your day with blessings.' },
  sunrise: { title: '☀️ Sunrise', body: 'The sun has risen. Time for Ishraq prayer.' },
  dhuhr: { title: '🕐 Dhuhr Prayer', body: 'It is time for Dhuhr prayer.' },
  asr: { title: '🌤️ Asr Prayer', body: 'It is time for Asr prayer.' },
  maghrib: { title: '🌅 Maghrib Prayer', body: 'It is time for Maghrib prayer. Break your fast if fasting.' },
  isha: { title: '🌙 Isha Prayer', body: 'It is time for Isha prayer.' },
};

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  // Android-specific channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('prayer-times', {
      name: 'Prayer Times',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('athkar-reminders', {
      name: 'Athkar Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

/**
 * Schedule notifications for prayer times
 */
export async function schedulePrayerNotifications(prayerTimes: PrayerTimes): Promise<void> {
  const prefs = await getNotificationPrefs();
  
  // Cancel existing prayer notifications
  await cancelPrayerNotifications();

  const now = new Date();
  const prayers: { key: keyof NotificationPrefs; time: Date }[] = [
    { key: 'fajr', time: prayerTimes.fajr },
    { key: 'sunrise', time: prayerTimes.sunrise },
    { key: 'dhuhr', time: prayerTimes.dhuhr },
    { key: 'asr', time: prayerTimes.asr },
    { key: 'maghrib', time: prayerTimes.maghrib },
    { key: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    if (!prefs[prayer.key]) continue;

    let notifTime = new Date(prayer.time);
    
    // Apply "minutes before" offset
    if (prefs.minutesBefore > 0) {
      notifTime = new Date(notifTime.getTime() - prefs.minutesBefore * 60 * 1000);
    }

    // Only schedule future notifications
    if (notifTime <= now) continue;

    const message = PRAYER_MESSAGES[prayer.key as string];
    if (!message) continue;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: prefs.minutesBefore > 0 
            ? `${message.body} (in ${prefs.minutesBefore} minutes)` 
            : message.body,
          sound: prefs.soundEnabled ? 'default' : undefined,
          data: { type: 'prayer', prayer: prayer.key },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notifTime,
          channelId: 'prayer-times',
        },
      });
    } catch (e) {
      console.error(`Failed to schedule ${prayer.key} notification:`, e);
    }
  }
}

/**
 * Cancel all prayer notifications
 */
export async function cancelPrayerNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.type === 'prayer') {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

/**
 * Cancel all notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
