import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { NativeModules, Platform } from 'react-native';

import {
  fallbackLanguage,
  isSupportedLanguage,
  translations,
  type Language,
  type TranslationKey,
  type TranslationParams,
} from '@/constants/i18n';

const extractLanguageCode = (value?: string | null): Language | null => {
  if (!value) {
    return null;
  }

  const languageCode = value.split(/[-_]/)[0]?.toLowerCase();

  if (languageCode && isSupportedLanguage(languageCode)) {
    return languageCode;
  }

  return null;
};

const getLanguageFromNativeModules = (): Language | null => {
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules?.SettingsManager?.settings;
      const locale =
        (Array.isArray(settings?.AppleLanguages) ? settings?.AppleLanguages[0] : null) ??
        settings?.AppleLocale;

      return extractLanguageCode(locale);
    }

    if (Platform.OS === 'android') {
      const locale = NativeModules?.I18nManager?.localeIdentifier;
      return extractLanguageCode(locale);
    }
  } catch (error) {
    // Ignore errors from native lookups.
  }

  return null;
};

const detectInitialLanguage = (): Language => {
  const nativeLanguage = getLanguageFromNativeModules();

  if (nativeLanguage) {
    return nativeLanguage;
  }

  const globalNavigator =
    typeof globalThis !== 'undefined' && typeof (globalThis as { navigator?: unknown }).navigator !== 'undefined'
      ? (globalThis as { navigator?: { language?: string } }).navigator
      : null;
  const navigatorLanguage = globalNavigator?.language
    ? extractLanguageCode(globalNavigator.language)
    : null;

  if (navigatorLanguage) {
    return navigatorLanguage;
  }

  const resolvedLocale =
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().locale : undefined;

  const intlLanguage = extractLanguageCode(resolvedLocale);

  if (intlLanguage) {
    return intlLanguage;
  }

  return fallbackLanguage;
};

const formatTranslation = (
  key: TranslationKey,
  language: Language,
  params?: TranslationParams,
): string => {
  const template = translations[language]?.[key] ?? translations[fallbackLanguage]?.[key] ?? key;

  if (!params) {
    return template;
  }

  return template.replace(/{{(\w+)}}/g, (match, token) => {
    const value = params[token];

    return value === undefined ? match : String(value);
  });
};

type LocalizationContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === 'en' ? 'fr' : 'en'));
  }, []);

  const translate = useCallback(
    (key: TranslationKey, params?: TranslationParams) => formatTranslation(key, language, params),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translate,
    }),
    [language, setLanguage, toggleLanguage, translate],
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }

  return context;
};
