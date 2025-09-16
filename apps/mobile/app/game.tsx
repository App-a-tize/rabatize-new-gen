import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useGame } from '@/context/GameContext';
import { gameModes } from '@/constants/gameModes';
import { compileRule, type CompiledRule } from '@/constants/rules';

const GameScreen = () => {
  const { activePlayers, selectedModeId, maxDrinks } = useGame();
  const router = useRouter();
  const [currentRule, setCurrentRule] = useState<CompiledRule | null>(null);

  const mode = useMemo(() => gameModes.find((item) => item.id === selectedModeId), [selectedModeId]);

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

    setCurrentRule(compileRule(activePlayers, maxDrinks, selectedModeId));
  }, [activePlayers, maxDrinks, selectedModeId]);

  const handleNextCard = () => {
    if (selectedModeId) {
      setCurrentRule(compileRule(activePlayers, maxDrinks, selectedModeId));
    }
  };

  const handleAdjustSettings = () => {
    router.push('/modes');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.modeName}>{mode?.name ?? 'Rabatize'}</Text>
          <Text style={styles.modeSubtitle}>Up to {maxDrinks} drinks per card</Text>
        </View>

        <View style={styles.card}>
          {currentRule ? (
            <>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{currentRule.title}</Text>
                <View style={styles.drinksBadge}>
                  <Text style={styles.drinksBadgeText}>{currentRule.drinks}</Text>
                  <Text style={styles.drinksBadgeLabel}>drinks</Text>
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
            <Text style={styles.cardBody}>
              Add more players or adjust the mode to generate a rule.
            </Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={handleNextCard}>
            <Text style={styles.primaryButtonText}>Next card</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleAdjustSettings}>
            <Text style={styles.secondaryButtonText}>Adjust settings</Text>
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
    backgroundColor: '#020617',
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
    color: '#f8fafc',
  },
  modeSubtitle: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  card: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 24,
    justifyContent: 'space-between',
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
    paddingRight: 16,
  },
  cardBody: {
    fontSize: 18,
    lineHeight: 26,
    color: '#e2e8f0',
  },
  drinksBadge: {
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  drinksBadgeText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  drinksBadgeLabel: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '500',
  },
  playersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  playerChipText: {
    color: '#bae6fd',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
});
