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
import { theme } from '@/constants/theme';

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
      <StatusBar style="dark" />
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
                <View key={`player-${index}`} style={styles.playerRowWrapper}>
                  <View style={styles.playerRow}>
                    <TextInput
                      value={player}
                      onChangeText={(text) => updatePlayer(index, text)}
                      placeholder={t('home.playerPlaceholder', { index: index + 1 })}
                      placeholderTextColor={theme.colors.textMuted}
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
    gap: 8,
  },
  languageRow: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  languageToggle: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  languageFlag: {
    fontSize: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  playerSection: {
    flex: 1,
    marginBottom: 12,
  },
  playerList: {
    gap: 16,
    paddingBottom: 12,
  },
  playerRowWrapper: {
    borderRadius: 22,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
  },
  playerInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  removeButtonText: {
    color: theme.colors.danger,
    fontSize: 22,
    lineHeight: 24,
  },
  addButton: {
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  addButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 26,
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: theme.colors.accentSoft,
    shadowOpacity: 0.2,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
});
