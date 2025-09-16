import { fallbackLanguage, type Language } from './i18n';

export type RuleTemplate = {
  id: string;
  title: string;
  prompt: string;
  participants: number;
  modeIds: string[];
  language: Language;
  translationMap: Partial<Record<Language, string>>;
};

export type CompiledRule = {
  id: string;
  title: string;
  text: string;
  drinks: number;
  players: string[];
  language: Language;
  translationMap: Partial<Record<Language, string>>;
};

export const defaultRuleTemplates: RuleTemplate[] = [
  {
    id: 'toast-master',
    title: 'Toast Master',
    prompt: '{{player_1}} raises a toast and gives out {{drinks}} drinks to share.',
    participants: 1,
    modeIds: ['classic', 'storyteller', 'chaos'],
    language: 'en',
    translationMap: { en: 'toast-master', fr: 'toast-master-fr' },
  },
  {
    id: 'toast-master-fr',
    title: 'Maître du toast',
    prompt: '{{player_1}} porte un toast et distribue {{drinks}} gorgées à partager.',
    participants: 1,
    modeIds: ['classic', 'storyteller', 'chaos'],
    language: 'fr',
    translationMap: { en: 'toast-master', fr: 'toast-master-fr' },
  },
  {
    id: 'story-swap',
    title: 'Story Swap',
    prompt:
      '{{player_1}} tells a quick tale about {{player_2}}. If {{player_2}} laughs, they hand out {{drinks}} drinks; otherwise {{player_1}} drinks them.',
    participants: 2,
    modeIds: ['classic', 'storyteller'],
    language: 'en',
    translationMap: { en: 'story-swap', fr: 'story-swap-fr' },
  },
  {
    id: 'story-swap-fr',
    title: 'Échange d\'histoires',
    prompt:
      '{{player_1}} raconte une histoire rapide sur {{player_2}}. Si {{player_2}} rit, iel distribue {{drinks}} gorgées ; sinon {{player_1}} les boit.',
    participants: 2,
    modeIds: ['classic', 'storyteller'],
    language: 'fr',
    translationMap: { en: 'story-swap', fr: 'story-swap-fr' },
  },
  {
    id: 'rabatize-chant',
    title: 'Rabatize Chant',
    prompt:
      'Everyone chants "Rabatize" while {{player_1}} counts down from five. Anyone who breaks rhythm drinks {{drinks}}.',
    participants: 1,
    modeIds: ['classic', 'chaos'],
    language: 'en',
    translationMap: { en: 'rabatize-chant', fr: 'rabatize-chant-fr' },
  },
  {
    id: 'rabatize-chant-fr',
    title: 'Chant Rabatize',
    prompt:
      'Tout le monde scande "Rabatize" pendant que {{player_1}} compte à rebours depuis cinq. Ceux qui cassent le rythme boivent {{drinks}}.',
    participants: 1,
    modeIds: ['classic', 'chaos'],
    language: 'fr',
    translationMap: { en: 'rabatize-chant', fr: 'rabatize-chant-fr' },
  },
  {
    id: 'synchronized-clap',
    title: 'Synchronized Clap',
    prompt: '{{player_1}} and {{player_2}} perform a synchronized clap. If they miss, both drink {{drinks}}.',
    participants: 2,
    modeIds: ['chaos'],
    language: 'en',
    translationMap: { en: 'synchronized-clap', fr: 'synchronized-clap-fr' },
  },
  {
    id: 'synchronized-clap-fr',
    title: 'Claque synchronisée',
    prompt:
      '{{player_1}} et {{player_2}} tapent dans leurs mains en même temps. S’ils ratent, les deux boivent {{drinks}}.',
    participants: 2,
    modeIds: ['chaos'],
    language: 'fr',
    translationMap: { en: 'synchronized-clap', fr: 'synchronized-clap-fr' },
  },
  {
    id: 'story-relay',
    title: 'Story Relay',
    prompt:
      '{{player_1}} starts a story, {{player_2}} continues it, and {{player_3}} ends it. The trio hands out {{drinks}} drinks if the table applauds.',
    participants: 3,
    modeIds: ['storyteller'],
    language: 'en',
    translationMap: { en: 'story-relay', fr: 'story-relay-fr' },
  },
  {
    id: 'story-relay-fr',
    title: 'Relais d\'histoires',
    prompt:
      '{{player_1}} commence une histoire, {{player_2}} la continue et {{player_3}} la conclut. Le trio distribue {{drinks}} gorgées si la table applaudit.',
    participants: 3,
    modeIds: ['storyteller'],
    language: 'fr',
    translationMap: { en: 'story-relay', fr: 'story-relay-fr' },
  },
  {
    id: 'call-out',
    title: 'Call Out',
    prompt: 'Anyone who has toasted with {{player_1}} tonight drinks {{drinks}}.',
    participants: 1,
    modeIds: ['classic', 'chaos'],
    language: 'en',
    translationMap: { en: 'call-out', fr: 'call-out-fr' },
  },
  {
    id: 'call-out-fr',
    title: 'Appel ciblé',
    prompt: 'Tous ceux qui ont trinqué avec {{player_1}} ce soir boivent {{drinks}}.',
    participants: 1,
    modeIds: ['classic', 'chaos'],
    language: 'fr',
    translationMap: { en: 'call-out', fr: 'call-out-fr' },
  },
  {
    id: 'spotlight-word',
    title: 'Spotlight Word',
    prompt: '{{player_1}} picks a word. Everyone tells a mini-story using it or drinks {{drinks}}.',
    participants: 1,
    modeIds: ['storyteller', 'classic'],
    language: 'en',
    translationMap: { en: 'spotlight-word', fr: 'spotlight-word-fr' },
  },
  {
    id: 'spotlight-word-fr',
    title: 'Mot vedette',
    prompt:
      '{{player_1}} choisit un mot. Tout le monde raconte une mini-histoire qui l’utilise ou boit {{drinks}}.',
    participants: 1,
    modeIds: ['storyteller', 'classic'],
    language: 'fr',
    translationMap: { en: 'spotlight-word', fr: 'spotlight-word-fr' },
  },
  {
    id: 'seat-swap',
    title: 'Seat Swap',
    prompt: '{{player_1}} swaps seats with {{player_2}}. The last to sit drinks {{drinks}}.',
    participants: 2,
    modeIds: ['classic', 'chaos'],
    language: 'en',
    translationMap: { en: 'seat-swap', fr: 'seat-swap-fr' },
  },
  {
    id: 'seat-swap-fr',
    title: 'Échange de places',
    prompt: '{{player_1}} échange sa place avec {{player_2}}. Le dernier à s’asseoir boit {{drinks}}.',
    participants: 2,
    modeIds: ['classic', 'chaos'],
    language: 'fr',
    translationMap: { en: 'seat-swap', fr: 'seat-swap-fr' },
  },
];

const playerToken = /{{player_(\d+)}}/g;
const drinksToken = /{{drinks}}/g;

const pickRandom = <T,>(items: readonly T[]): T | null => {
  if (items.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * items.length);
  return items[index] ?? null;
};

const selectPlayers = (players: string[], count: number): string[] =>
  players
    .map((player) => ({ player, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
    .map(({ player }) => player);

export const compileRule = (
  players: string[],
  maxDrinks: number,
  modeId: string | null,
  language: Language,
  ruleTemplates: RuleTemplate[] = defaultRuleTemplates,
): CompiledRule | null => {
  if (players.length === 0) {
    return null;
  }

  const languagesToTry: Language[] =
    language === fallbackLanguage ? [language] : [language, fallbackLanguage];

  let template: RuleTemplate | null = null;

  for (const currentLanguage of languagesToTry) {
    const languageRules = ruleTemplates.filter((rule) => rule.language === currentLanguage);

    if (languageRules.length === 0) {
      continue;
    }

    const applicableRules = languageRules.filter(
      (rule) => (!modeId || rule.modeIds.includes(modeId)) && players.length >= rule.participants,
    );

    const fallbackRules = languageRules.filter((rule) => players.length >= rule.participants);

    template = pickRandom(applicableRules) ?? pickRandom(fallbackRules);

    if (template) {
      break;
    }
  }

  if (!template) {
    return null;
  }

  const drinks = Math.max(1, Math.floor(Math.random() * maxDrinks) + 1);
  const selectedPlayers = selectPlayers(players, template.participants);

  const text = template.prompt
    .replace(playerToken, (_, rawIndex: string) => {
      const index = Number(rawIndex) - 1;
      return selectedPlayers[index] ?? players[index % players.length] ?? 'Someone';
    })
    .replace(drinksToken, String(drinks));

  const translationMap = {
    ...template.translationMap,
    [template.language]: template.id,
  };

  return {
    id: template.id,
    title: template.title,
    text,
    drinks,
    players: selectedPlayers,
    language: template.language,
    translationMap,
  };
};
