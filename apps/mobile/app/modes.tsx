import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGame } from '@/context/GameContext';
import { useLocalization } from '@/context/LocalizationContext';
import { getGameModeCopy } from '@/constants/gameModes';
import { useRemoteConfig } from '@/context/RemoteConfigContext';
import { theme } from '@/constants/theme';

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
  const { t, language } = useLocalization();
  const { gameModes } = useRemoteConfig();
  const [expandedModeId, setExpandedModeId] = useState<string | null>(selectedModeId);

  const canStart = Boolean(selectedModeId) && activePlayers.length >= 2;

  const handleStart = () => {
    if (canStart) {
      router.push('/game');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>{t('modes.title')}</Text>
        <Text style={styles.subtitle}>{t('modes.subtitle')}</Text>

        <ScrollView style={styles.modeList} contentContainerStyle={styles.modeListContent}>
          {gameModes.map((mode) => {
            const selected = mode.id === selectedModeId;
            const expanded = mode.id === expandedModeId || selected;
            const copy = getGameModeCopy(mode, language);

            return (
              <Pressable
                key={mode.id}
                onPress={() => {
                  selectMode(mode.id);
                  setExpandedModeId(mode.id);
                }}
                style={[styles.modeCard, selected && styles.modeCardSelected]}
              >
                <View style={styles.modeHeader}>
                  <Text style={styles.modeTitle}>{copy.name}</Text>
                  {selected && <View style={styles.modePill} />}
                </View>
                <Text style={styles.modeTagline}>{copy.tagline}</Text>
                {expanded && <Text style={styles.modeDescription}>{copy.description}</Text>}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.settingsPanel}>
          <View>
            <Text style={styles.settingsTitle}>{t('modes.settingsTitle')}</Text>
            <Text style={styles.settingsSubtitle}>{t('modes.settingsSubtitle')}</Text>
          </View>
          <View style={styles.stepper}>
            <Pressable style={[styles.stepperButton, styles.stepperButtonLeft]} onPress={decreaseMaxDrinks}>
              <Text style={styles.stepperLabel}>−</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{maxDrinks}</Text>
            <Pressable style={[styles.stepperButton, styles.stepperButtonRight]} onPress={increaseMaxDrinks}>
              <Text style={styles.stepperLabel}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleStart}
          style={[styles.startButton, !canStart && styles.startButtonDisabled]}
          disabled={!canStart}
        >
          <Text style={styles.startButtonText}>{t('modes.startGame')}</Text>
          {!canStart && (
            <Text style={styles.helperText}>{t('modes.helper')}</Text>
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
    backgroundColor: theme.colors.backgroundAlt,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modeList: {
    flex: 1,
    marginVertical: 8,
  },
  modeListContent: {
    gap: 16,
    paddingBottom: 16,
  },
  modeCard: {
    borderRadius: 24,
    padding: 20,
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
  modeCardSelected: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.25,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modePill: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modeTagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modeDescription: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  settingsPanel: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stepperButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 6,
  },
  stepperButtonLeft: {
    shadowOffset: { width: 6, height: 6 },
  },
  stepperButtonRight: {
    shadowOffset: { width: 6, height: 6 },
  },
  stepperLabel: {
    color: theme.colors.accent,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  stepperValue: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    width: 56,
    textAlign: 'center',
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    gap: 4,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.accentSoft,
    shadowOpacity: 0.18,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
