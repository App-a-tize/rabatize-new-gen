import { Stack } from 'expo-router';

import { GameProvider } from '@/context/GameContext';
import { LocalizationProvider, useLocalization } from '@/context/LocalizationContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <LocalizationProvider>
      <GameProvider>
        <LocalizedStack />
      </GameProvider>
    </LocalizationProvider>
  );
}

const LocalizedStack = () => {
  const { t } = useLocalization();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="modes" options={{ title: t('navigation.modes') }} />
      <Stack.Screen name="game" options={{ title: t('navigation.game') }} />
    </Stack>
  );
};
