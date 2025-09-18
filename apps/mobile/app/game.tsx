import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useGame } from '@/context/GameContext';
import { useLocalization } from '@/context/LocalizationContext';
import { getGameModeCopy } from '@/constants/gameModes';
import { compileRule, type CompiledRule } from '@/constants/rules';
import { useRemoteConfig } from '@/context/RemoteConfigContext';
import { theme } from '@/constants/theme';

const GameScreen = () => {
  const { activePlayers, selectedModeId, maxDrinks } = useGame();
  const router = useRouter();
  const { t, language } = useLocalization();
  const { gameModes, ruleTemplates } = useRemoteConfig();
  const [currentRule, setCurrentRule] = useState<CompiledRule | null>(null);

  const mode = useMemo(
    () => gameModes.find((item) => item.id === selectedModeId),
    [gameModes, selectedModeId],
  );
  const modeCopy = useMemo(() => (mode ? getGameModeCopy(mode, language) : null), [language, mode]);

  useEffect(() => {
    if (activePlayers.length < 2) {
      router.replace('/');
      return;
    }

    if (!selectedModeId) {
      router.replace('/modes');
    }
  }, [activePlayers.length, router, selectedModeId]);

  useEffect(() => {
    if (!selectedModeId || activePlayers.length === 0) {
      setCurrentRule(null);
      return;
    }

    setCurrentRule(compileRule(activePlayers, maxDrinks, selectedModeId, language, ruleTemplates));
  }, [activePlayers, language, maxDrinks, ruleTemplates, selectedModeId]);

  const handleNextCard = () => {
    if (selectedModeId) {
      setCurrentRule(compileRule(activePlayers, maxDrinks, selectedModeId, language, ruleTemplates));
    }
  };

  const handleAdjustSettings = () => {
    router.push('/modes');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.modeName}>{modeCopy?.name ?? t('home.title')}</Text>
          <Text style={styles.modeSubtitle}>{t('game.maxDrinks', { count: maxDrinks })}</Text>
        </View>

        <View style={styles.card}>
          {currentRule ? (
            <>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{currentRule.title}</Text>
                <View style={styles.drinksBadge}>
                  <Text style={styles.drinksBadgeText}>{currentRule.drinks}</Text>
                  <Text style={styles.drinksBadgeLabel}>{t('game.drinksLabel')}</Text>
                </View>
              </View>

              {currentRule.players.length > 0 && (
                <View style={styles.playersRow}>
                  {currentRule.players.map((player) => (
                    <View key={player} style={styles.playerChip}>
                      <Text style={styles.playerChipText}>{player}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.cardBody}>{currentRule.text}</Text>
            </>
          ) : (
            <Text style={styles.cardBody}>{t('game.emptyState')}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={handleNextCard}>
            <Text style={styles.primaryButtonText}>{t('game.nextCard')}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleAdjustSettings}>
            <Text style={styles.secondaryButtonText}>{t('game.adjustSettings')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 24,
  },
  header: {
    gap: 4,
  },
  modeName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 28,
    justifyContent: 'space-between',
    gap: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    paddingRight: 16,
  },
  cardBody: {
    fontSize: 18,
    lineHeight: 26,
    color: theme.colors.textSecondary,
  },
  drinksBadge: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  drinksBadgeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  drinksBadgeLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  playersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  playerChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  playerChipText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  actions: {
    gap: 14,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 26,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
