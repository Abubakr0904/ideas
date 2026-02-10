# 🕌 Salati - Prayer Times App

A beautiful, feature-rich Islamic prayer times app built with React Native (Expo) for Android.

## Features

- **Accurate Prayer Times** — Supports 7 calculation methods (MWL, ISNA, Egypt, Umm Al-Qura, Karachi, Tehran, Jafari)
- **Qibla Compass** — Real-time direction to Kaaba using device magnetometer
- **Athkar & Supplications** — Morning, Evening, After Prayer, and Before Sleep athkar with tap counter
- **Hijri Calendar** — Automatic Hijri date alongside Gregorian
- **Smart Notifications** — Customizable adhan reminders for each prayer
- **Dark Mode** — Beautiful light/dark themes with system auto-detection
- **Offline First** — All calculations done locally, no internet required
- **High Latitude Support** — Angle-based, midnight, and one-seventh methods

## Tech Stack

- **React Native** with Expo SDK 52
- **TypeScript** for type safety
- **Expo Location** for GPS
- **Expo Sensors** for compass/magnetometer
- **Expo Notifications** for prayer reminders
- **AsyncStorage** for local data persistence
- **React Navigation** for tab-based navigation

## Project Structure

```
prayer-app/
├── App.tsx                     # Entry point
├── app.json                    # Expo config
├── eas.json                    # EAS Build config
├── package.json
├── tsconfig.json
├── babel.config.js
└── src/
    ├── data/
    │   └── athkar.ts           # Athkar/supplications data
    ├── hooks/
    │   └── index.ts            # Custom hooks (theme, location, prayer times)
    ├── navigation/
    │   └── AppNavigation.tsx   # Bottom tab navigator
    ├── screens/
    │   ├── HomeScreen.tsx      # Prayer times + countdown
    │   ├── QiblaScreen.tsx     # Qibla compass
    │   ├── AthkarScreen.tsx    # Athkar categories + counter
    │   └── SettingsScreen.tsx  # App settings
    ├── theme/
    │   └── index.ts            # Colors, typography, spacing
    └── utils/
        ├── prayerTimes.ts      # Prayer time calculation engine
        ├── qibla.ts            # Qibla direction calculator
        ├── hijriCalendar.ts    # Gregorian-to-Hijri converter
        ├── storage.ts          # AsyncStorage manager
        └── notifications.ts    # Notification scheduler
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Android Studio** (for emulator) or a physical Android device with Expo Go

### 1. Install Dependencies

```bash
cd prayer-app
npm install
```

### 2. Run in Development

```bash
# Start Expo dev server
npx expo start

# Or run directly on Android
npx expo run:android
```

**Using a physical device?** Install "Expo Go" from the Play Store and scan the QR code.

### 3. Test on Emulator

Open Android Studio → AVD Manager → Create/start an emulator, then:

```bash
npx expo start --android
```

---

## 📱 Building for Play Store

### Step 1: Create an Expo Account

```bash
npx eas login
```

### Step 2: Configure Your Project

```bash
npx eas build:configure
```

Update `app.json` with your:
- `expo.android.package` — e.g., `com.yourname.salati`
- `expo.extra.eas.projectId` — from your Expo dashboard

### Step 3: Build APK (for testing)

```bash
npx eas build --platform android --profile preview
```

This generates a downloadable `.apk` file.

### Step 4: Build AAB (for Play Store)

```bash
npx eas build --platform android --profile production
```

This generates a `.aab` file that you upload to Google Play Console.

### Step 5: Submit to Play Store

**Option A — Manual Upload:**
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Upload the `.aab` file
4. Fill in the store listing (see below)

**Option B — Automated via EAS:**
1. Create a Google Play Service Account and download the JSON key
2. Save as `play-store-key.json` in your project root
3. Run:
```bash
npx eas submit --platform android
```

---

## 🏪 Play Store Listing Suggestions

**App Name:** Salati - Prayer Times & Qibla

**Short Description:**
Accurate prayer times, Qibla compass, and daily athkar — beautiful and offline-ready.

**Full Description:**
Salati is a beautiful, ad-supported Islamic prayer times app that provides accurate prayer times for your location using established astronomical calculation methods.

Features:
• Accurate prayer times with 7 calculation methods
• Qibla compass with real-time direction
• Morning, evening, and after-prayer athkar with tap counter
• Hijri calendar display
• Customizable adhan notifications
• Beautiful dark mode
• Works offline — no internet required
• Supports Standard and Hanafi Asr calculation

**Category:** Lifestyle or Books & Reference

**Content Rating:** Everyone

---

## 💰 Monetization Setup

### Google AdMob (for free tier ads)

1. Create an [AdMob account](https://admob.google.com/)
2. Register your app and get ad unit IDs
3. The project includes `react-native-google-mobile-ads` — configure it:

```javascript
// In app.json, add:
{
  "react-native-google-mobile-ads": {
    "android_app_id": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
  }
}
```

4. Add banner ads to HomeScreen (bottom of prayer list) and AthkarScreen (between categories).

### Premium Tier (future)

Use **RevenueCat** for subscription management:
1. `npm install react-native-purchases`
2. Create products in Play Console (monthly/yearly)
3. Configure RevenueCat with your Play Store credentials
4. Gate premium features behind subscription checks

---

## 🔧 Customization

### Adding a New Calculation Method

Edit `src/utils/prayerTimes.ts`:
```typescript
export const CalculationMethods = {
  // ... existing methods
  MY_METHOD: {
    name: 'My Custom Method',
    params: { fajrAngle: 18, ishaAngle: 17 },
  },
};
```

### Adding More Athkar

Edit `src/data/athkar.ts` and add new categories or items to existing categories.

### Adding a New Language

1. Create a translations file: `src/data/translations/ar.ts`
2. Use the `language` setting from storage to switch strings
3. Wrap all user-visible strings with a translation function

---

## 📋 Next Steps / Roadmap

- [ ] Add AdMob banner ads
- [ ] Add Arabic language support
- [ ] Add Quran reader (Surah Al-Mulk, Al-Kahf, etc.)
- [ ] Add Tasbih (digital prayer beads) screen
- [ ] Add widget for home screen
- [ ] Add premium subscription via RevenueCat
- [ ] Add custom adhan sounds
- [ ] Add Ramadan mode (Suhoor/Iftar times)
- [ ] Add mosque finder using Google Places API
- [ ] Add Hijri calendar full month view
- [ ] Add multiple language support (Arabic, Urdu, Turkish, etc.)

---

## License

This project is for personal/commercial use by the original developer.
