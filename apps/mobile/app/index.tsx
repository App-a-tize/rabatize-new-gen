import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useGame } from '@/context/GameContext';
import { useLocalization } from '@/context/LocalizationContext';

const PlayerSetupScreen = () => {
  const { players, activePlayers, updatePlayer, addPlayer, removePlayer, resetMode } = useGame();
  const router = useRouter();
  const { t, language, toggleLanguage } = useLocalization();

  useEffect(() => {
    resetMode();
  }, [resetMode]);

  const canStart = activePlayers.length >= 2;

  const handleStart = () => {
    if (canStart) {
      router.push('/modes');
    }
  };

  const nextLanguage = language === 'en' ? 'fr' : 'en';
  const nextLanguageName = t(nextLanguage === 'en' ? 'language.en' : 'language.fr');
  const flag = language === 'fr' ? '🇫🇷' : '🇬🇧';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <View style={styles.container}>
          <View style={styles.languageRow}>
            <Pressable
              accessibilityHint={t('home.languageToggle.hint', { language: nextLanguageName })}
              accessibilityLabel={t('home.languageToggle.accessibility')}
              accessibilityRole="button"
              hitSlop={10}
              onPress={toggleLanguage}
              style={styles.languageToggle}
            >
              <Text style={styles.languageFlag}>{flag}</Text>
            </Pressable>
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>{t('home.title')}</Text>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
          </View>

          <View style={styles.playerSection}>
            <ScrollView
              contentContainerStyle={styles.playerList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {players.map((player, index) => (
                <View key={`player-${index}`} style={styles.playerRow}>
                  <TextInput
                    value={player}
                    onChangeText={(text) => updatePlayer(index, text)}
                    placeholder={t('home.playerPlaceholder', { index: index + 1 })}
                    placeholderTextColor="#777"
                    style={styles.playerInput}
                  />
                  {players.length > 1 && (
                    <Pressable
                      accessibilityLabel={t('home.removePlayer', { index: index + 1 })}
                      onPress={() => removePlayer(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </Pressable>
                  )}
                </View>
              ))}

              <Pressable style={styles.addButton} onPress={addPlayer}>
                <Text style={styles.addButtonText}>{t('home.addPlayer')}</Text>
              </Pressable>
            </ScrollView>
          </View>

          <Pressable
            onPress={handleStart}
            style={[styles.startButton, !canStart && styles.startButtonDisabled]}
            disabled={!canStart}
          >
            <Text style={styles.startButtonText}>{t('home.chooseMode')}</Text>
            {!canStart && <Text style={styles.helperText}>{t('home.helperAddPlayers')}</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PlayerSetupScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  header: {
    gap: 8,
  },
  languageRow: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  languageToggle: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  languageFlag: {
    fontSize: 18,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5f5',
  },
  playerSection: {
    flex: 1,
    marginTop: 32,
    marginBottom: 24,
  },
  playerList: {
    gap: 12,
    paddingBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  playerInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#f87171',
    fontSize: 20,
    lineHeight: 24,
  },
  addButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    gap: 4,
  },
  startButtonDisabled: {
    backgroundColor: 'rgba(148, 163, 184, 0.4)',
  },
  startButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  helperText: {
    color: '#e2e8f0',
    fontSize: 12,
  },
});
