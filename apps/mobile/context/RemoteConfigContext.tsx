import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { defaultGameModes, type GameMode, type GameModeCopy } from '@/constants/gameModes';
import {
  defaultRuleTemplates,
  type RuleTemplate,
} from '@/constants/rules';
import { fallbackLanguage, isSupportedLanguage, type Language } from '@/constants/i18n';

type RemoteConfigContextValue = {
  gameModes: GameMode[];
  ruleTemplates: RuleTemplate[];
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

const RemoteConfigContext = createContext<RemoteConfigContextValue | undefined>(undefined);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type UnknownRecord = Record<string, unknown>;

type PartialGameMode = {
  id: string;
  translations: Partial<Record<Language, GameModeCopy>>;
};

type RemoteConfigResponse = {
  modes: PartialGameMode[];
  rules: RuleTemplate[];
};

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseGameMode = (value: unknown): PartialGameMode | null => {
  if (!isRecord(value) || typeof value.id !== 'string' || !isRecord(value.translations)) {
    return null;
  }

  const translationsEntries = Object.entries(value.translations).reduce<
    Partial<Record<Language, GameModeCopy>>
  >((acc, [language, copy]) => {
    if (!isSupportedLanguage(language) || !isRecord(copy)) {
      return acc;
    }

    const { name, tagline, description } = copy;

    if (
      typeof name === 'string' &&
      typeof tagline === 'string' &&
      typeof description === 'string'
    ) {
      acc[language] = { name, tagline, description };
    }

    return acc;
  }, {});

  if (!translationsEntries[fallbackLanguage]) {
    return null;
  }

  return {
    id: value.id,
    translations: translationsEntries,
  };
};

const parseRuleTemplate = (value: unknown): RuleTemplate | null => {
  if (!isRecord(value)) {
    return null;
  }

  const { id, title, prompt, participants, modeIds, language, translationMap } = value;

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof prompt !== 'string' ||
    typeof participants !== 'number' ||
    Number.isNaN(participants) ||
    participants <= 0 ||
    !Array.isArray(modeIds) ||
    modeIds.some((item) => typeof item !== 'string') ||
    typeof language !== 'string' ||
    !isSupportedLanguage(language)
  ) {
    return null;
  }

  const sanitizedTranslationMap: Partial<Record<Language, string>> = {};

  if (isRecord(translationMap)) {
    for (const [key, value] of Object.entries(translationMap)) {
      if (isSupportedLanguage(key) && typeof value === 'string') {
        sanitizedTranslationMap[key] = value;
      }
    }
  }

  return {
    id,
    title,
    prompt,
    participants: Math.max(1, Math.round(participants)),
    modeIds: modeIds.slice(),
    language,
    translationMap: sanitizedTranslationMap,
  } as RuleTemplate;
};

const sanitizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const mergeWithDefaults = (remoteModes: PartialGameMode[]): GameMode[] => {
  if (remoteModes.length === 0) {
    return defaultGameModes;
  }

  return remoteModes.reduce<GameMode[]>((acc, mode) => {
    const fallbackMode = defaultGameModes.find((item) => item.id === mode.id);
    const fallbackTranslations = fallbackMode?.translations ?? ({} as Record<Language, GameModeCopy>);
    const mergedTranslations = {
      ...fallbackTranslations,
      ...mode.translations,
    } as Record<Language, GameModeCopy>;

    if (!mergedTranslations[fallbackLanguage]) {
      return acc;
    }

    acc.push({
      id: mode.id,
      translations: mergedTranslations,
    });

    return acc;
  }, []);
};

const parseConfigResponse = (value: unknown): RemoteConfigResponse => {
  if (!isRecord(value)) {
    throw new Error('Invalid remote config payload');
  }

  const modesSource = Array.isArray(value.modes) ? value.modes : [];
  const rulesSource = Array.isArray(value.rules) ? value.rules : [];

  const modes = modesSource
    .map(parseGameMode)
    .filter((mode): mode is PartialGameMode => Boolean(mode));
  const rules = rulesSource
    .map(parseRuleTemplate)
    .filter((rule): rule is RuleTemplate => Boolean(rule));

  return { modes, rules };
};

const fetchRemoteConfig = async (): Promise<RemoteConfigResponse> => {
  if (!API_BASE_URL) {
    throw new Error('Missing EXPO_PUBLIC_API_URL environment variable.');
  }

  const endpoint = `${sanitizeBaseUrl(API_BASE_URL)}/config`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to load remote config (${response.status}).`);
  }

  const payload = (await response.json()) as unknown;
  return parseConfigResponse(payload);
};

export const RemoteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [gameModes, setGameModes] = useState<GameMode[]>(defaultGameModes);
  const [ruleTemplates, setRuleTemplates] = useState<RuleTemplate[]>(defaultRuleTemplates);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');

    try {
      const { modes, rules } = await fetchRemoteConfig();
      const mergedModes = mergeWithDefaults(modes);

      setGameModes(mergedModes.length > 0 ? mergedModes : defaultGameModes);
      setRuleTemplates(rules.length > 0 ? rules : defaultRuleTemplates);
      setError(null);
    } catch (err) {
      console.error('Failed to load remote config', err);
      setError(err instanceof Error ? err.message : 'Failed to load remote config.');
      setGameModes(defaultGameModes);
      setRuleTemplates(defaultRuleTemplates);
    } finally {
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo(
    () => ({
      gameModes,
      ruleTemplates,
      isReady: status === 'ready',
      isLoading: status !== 'ready',
      error,
      reload: load,
    }),
    [error, gameModes, load, ruleTemplates, status],
  );

  return <RemoteConfigContext.Provider value={value}>{children}</RemoteConfigContext.Provider>;
};

export const useRemoteConfig = () => {
  const context = useContext(RemoteConfigContext);

  if (!context) {
    throw new Error('useRemoteConfig must be used within a RemoteConfigProvider');
  }

  return context;
};

