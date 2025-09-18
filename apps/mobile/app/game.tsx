import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useGame } from '@/context/GameContext';
import { useLocalization } from '@/context/LocalizationContext';
import { getGameModeCopy } from '@/constants/gameModes';
import { compileRule, type CompiledRule } from '@/constants/rules';
import { useRemoteConfig } from '@/context/RemoteConfigContext';
import { theme } from '@/constants/theme';

const GameScreen = () => {
  const { activePlayers, selectedModeId, maxDrinks, playerStats, recordDrinkForPlayer, adjustDrinkTotal } = useGame();
  const router = useRouter();
  const { t, language } = useLocalization();
  const { gameModes, ruleTemplates } = useRemoteConfig();
  const [currentRule, setCurrentRule] = useState<CompiledRule | null>(null);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const mode = useMemo(
    () => gameModes.find((item) => item.id === selectedModeId),
    [gameModes, selectedModeId],
  );
  const modeCopy = useMemo(() => (mode ? getGameModeCopy(mode, language) : null), [language, mode]);
  const totalDrinks = useMemo(
    () => playerStats.reduce((sum, stat) => sum + stat.drinks, 0),
    [playerStats],
  );

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

  const handleOpenMenu = () => {
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleAdjustSettings = () => {
    setMenuVisible(false);
    router.push('/modes');
  };

  const handlePlayerDrank = (player: string) => {
    if (!currentRule) {
      return;
    }

    recordDrinkForPlayer(player, currentRule.drinks);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.modeInfo}>
            <Text style={styles.modeName}>{modeCopy?.name ?? t('home.title')}</Text>
            <Text style={styles.modeSubtitle}>{t('game.maxDrinks', { count: maxDrinks })}</Text>
          </View>
          <Pressable style={styles.menuButton} onPress={handleOpenMenu} accessibilityRole="button">
            <Text style={styles.menuButtonText}>{t('game.sessionMenu')}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {currentRule ? (
            <>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{currentRule.title}</Text>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardBody}>{currentRule.text}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.playersColumn}>
                  {currentRule.players.length > 0 ? (
                    <>
                      <Text style={styles.recordHint}>{t('game.recordHint')}</Text>
                      <View style={styles.playersRow}>
                        {currentRule.players.map((player) => (
                          <Pressable
                            key={player}
                            style={styles.playerChip}
                            onPress={() => handlePlayerDrank(player)}
                            accessibilityRole="button"
                          >
                            <Text style={styles.playerChipText}>{player}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </>
                  ) : null}
                </View>
                <View style={styles.drinksContainer}>
                  <Text style={styles.drinksCount}>{currentRule.drinks}</Text>
                  <Text style={styles.drinksLabel}>{t('game.drinksLabel')}</Text>
                </View>
              </View>

            </>
          ) : (
            <View style={styles.cardContent}>
              <Text style={styles.cardBody}>{t('game.emptyState')}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={handleNextCard}>
            <Text style={styles.primaryButtonText}>{t('game.nextCard')}</Text>
          </Pressable>
        </View>
      </View>

      <Modal animationType="fade" transparent visible={isMenuVisible} onRequestClose={handleCloseMenu}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalDismissArea} onPress={handleCloseMenu} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('game.sessionOverview')}</Text>
            <Text style={styles.modalSubtitle}>{t('game.totalRecordedDrinks', { count: totalDrinks })}</Text>
            <View style={styles.modalList}>
              {playerStats.length > 0 ? (
                playerStats.map((stat) => (
                  <View key={stat.index} style={styles.modalRow}>
                    <View style={styles.modalPlayerInfo}>
                      <Text style={styles.modalPlayerName}>{stat.name}</Text>
                      <Text style={styles.modalPlayerDrinks}>
                        {stat.drinks} {t('game.drinksLabel')}
                      </Text>
                    </View>
                    <View style={styles.modalActions}>
                      <Pressable
                        style={[styles.modalAdjustButton, stat.drinks === 0 && styles.modalAdjustButtonDisabled]}
                        onPress={() => adjustDrinkTotal(stat.index, -1)}
                        disabled={stat.drinks === 0}
                        accessibilityLabel={t('game.decreaseDrink')}
                      >
                        <Text style={styles.modalAdjustButtonText}>-</Text>
                      </Pressable>
                      <Pressable
                        style={styles.modalAdjustButton}
                        onPress={() => adjustDrinkTotal(stat.index, 1)}
                        accessibilityLabel={t('game.increaseDrink')}
                      >
                        <Text style={styles.modalAdjustButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.modalEmptyState}>{t('game.noPlayersTracking')}</Text>
              )}
            </View>
            <Pressable style={styles.modalSettingsButton} onPress={handleAdjustSettings}>
              <Text style={styles.modalSettingsButtonText}>{t('game.adjustSettings')}</Text>
            </Pressable>
            <Pressable style={styles.modalCloseButton} onPress={handleCloseMenu}>
              <Text style={styles.modalCloseButtonText}>{t('game.close')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  modeInfo: {
    flex: 1,
    gap: 4,
  },
  modeName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  menuButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  menuButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 28,
    gap: 32,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  cardTop: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardBody: {
    fontSize: 22,
    lineHeight: 32,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 24,
  },
  playersColumn: {
    flex: 1,
    gap: 8,
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
  recordHint: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  drinksContainer: {
    alignItems: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  drinksCount: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'center',
  },
  drinksLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    gap: 16,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalList: {
    gap: 12,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    gap: 12,
  },
  modalPlayerInfo: {
    flex: 1,
    gap: 4,
  },
  modalPlayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  modalPlayerDrinks: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalAdjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalAdjustButtonDisabled: {
    opacity: 0.4,
  },
  modalAdjustButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  modalEmptyState: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalSettingsButton: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modalSettingsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  modalCloseButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
