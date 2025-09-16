import { Stack } from 'expo-router';

import { GameProvider } from '@/context/GameContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modes" options={{ title: 'Game Modes' }} />
        <Stack.Screen name="game" options={{ title: 'Rabatize' }} />
      </Stack>
    </GameProvider>
  );
}
