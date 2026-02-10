/**
 * App Navigation
 * Bottom tab navigator with 4 tabs: Home, Qibla, Athkar, Settings
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useSettings } from '../hooks';

import HomeScreen from '../screens/HomeScreen';
import QiblaScreen from '../screens/QiblaScreen';
import AthkarScreen from '../screens/AthkarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Qibla: { focused: 'compass', default: 'compass-outline' },
  Athkar: { focused: 'book', default: 'book-outline' },
  Settings: { focused: 'settings', default: 'settings-outline' },
};

export default function AppNavigation() {
  const { settings } = useSettings();
  const { colors, isDark } = useTheme(settings?.theme);

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.tabBar,
          text: colors.text,
          border: colors.tabBarBorder,
          notification: colors.accent,
        },
        fonts: {
          regular: { fontFamily: undefined, fontWeight: '400' },
          medium: { fontFamily: undefined, fontWeight: '500' },
          bold: { fontFamily: undefined, fontWeight: '700' },
          heavy: { fontFamily: undefined, fontWeight: '900' },
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = TAB_ICONS[route.name];
            const iconName = focused ? icons.focused : icons.default;
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.activeTab,
          tabBarInactiveTintColor: colors.inactiveTab,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
            paddingTop: 4,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 4,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Qibla" component={QiblaScreen} />
        <Tab.Screen name="Athkar" component={AthkarScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
