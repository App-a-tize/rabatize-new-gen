import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';

import { GameProvider } from '@/context/GameContext';
import { LocalizationProvider, useLocalization } from '@/context/LocalizationContext';
import { RemoteConfigProvider, useRemoteConfig } from '@/context/RemoteConfigContext';

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen might already be hidden if Expo is in debug mode.
});

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <RemoteConfigProvider>
        <GameProvider>
          <LocalizedStack />
        </GameProvider>
      </RemoteConfigProvider>
    </LocalizationProvider>
  );
}

const LocalizedStack = () => {
  const { t } = useLocalization();
  const { isReady } = useRemoteConfig();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore if the splash screen was already hidden.
      });
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="modes" options={{ title: t('navigation.modes') }} />
      <Stack.Screen name="game" options={{ title: t('navigation.game') }} />
    </Stack>
  );
};
