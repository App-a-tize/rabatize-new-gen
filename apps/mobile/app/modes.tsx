import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGame } from '@/context/GameContext';
import { gameModes } from '@/constants/gameModes';

const ModeSelectionScreen = () => {
  const {
    activePlayers,
    selectedModeId,
    selectMode,
    maxDrinks,
    increaseMaxDrinks,
    decreaseMaxDrinks,
  } = useGame();
  const router = useRouter();
  const [expandedModeId, setExpandedModeId] = useState<string | null>(selectedModeId);

  const canStart = Boolean(selectedModeId) && activePlayers.length >= 2;

  const handleStart = () => {
    if (canStart) {
      router.push('/game');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Select a game mode</Text>
        <Text style={styles.subtitle}>Each mode changes the rhythm of the night.</Text>

        <ScrollView style={styles.modeList} contentContainerStyle={styles.modeListContent}>
          {gameModes.map((mode) => {
            const selected = mode.id === selectedModeId;
            const expanded = mode.id === expandedModeId || selected;

            return (
              <Pressable
                key={mode.id}
                onPress={() => {
                  selectMode(mode.id);
                  setExpandedModeId(mode.id);
                }}
                style={[styles.modeCard, selected && styles.modeCardSelected]}
              >
                <Text style={styles.modeTitle}>{mode.name}</Text>
                <Text style={styles.modeTagline}>{mode.tagline}</Text>
                {expanded && <Text style={styles.modeDescription}>{mode.description}</Text>}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.settingsPanel}>
          <View>
            <Text style={styles.settingsTitle}>Maximum drinks per card</Text>
            <Text style={styles.settingsSubtitle}>Tune the intensity before you start.</Text>
          </View>
          <View style={styles.stepper}>
            <Pressable style={styles.stepperButton} onPress={decreaseMaxDrinks}>
              <Text style={styles.stepperLabel}>−</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{maxDrinks}</Text>
            <Pressable style={styles.stepperButton} onPress={increaseMaxDrinks}>
              <Text style={styles.stepperLabel}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleStart}
          style={[styles.startButton, !canStart && styles.startButtonDisabled]}
          disabled={!canStart}
        >
          <Text style={styles.startButtonText}>Start the game</Text>
          {!canStart && (
            <Text style={styles.helperText}>Select a mode and make sure at least two players are ready.</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ModeSelectionScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  modeList: {
    flex: 1,
    marginVertical: 8,
  },
  modeListContent: {
    gap: 16,
    paddingBottom: 8,
  },
  modeCard: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    gap: 8,
  },
  modeCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  modeTagline: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  modeDescription: {
    fontSize: 13,
    color: '#e2e8f0',
    lineHeight: 18,
  },
  settingsPanel: {
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 20,
    gap: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  settingsSubtitle: {
    fontSize: 13,
    color: '#cbd5f5',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperLabel: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  stepperValue: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    gap: 4,
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.35)',
  },
  startButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  helperText: {
    color: '#e2e8f0',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
