import { fallbackLanguage, type Language } from './i18n';

export type GameModeCopy = {
  name: string;
  tagline: string;
  description: string;
};

export type GameMode = {
  id: string;
  translations: Record<Language, GameModeCopy>;
};

export const defaultGameModes: GameMode[] = [
  {
    id: 'classic',
    translations: {
      en: {
        name: 'Classic Rabatize',
        tagline: 'Balanced mix of group prompts and quick dares.',
        description:
          'The classic experience. Expect social challenges, rhythm games, and cheers that make everyone feel part of the crew.',
      },
      fr: {
        name: 'Rabatize Classique',
        tagline: 'Mélange équilibré de défis de groupe et de gages rapides.',
        description:
          'L’expérience classique. Attends-toi à des défis sociaux, des jeux de rythme et des toasts qui mettent tout le monde dans l’ambiance.',
      },
    },
  },
  {
    id: 'storyteller',
    translations: {
      en: {
        name: 'Storyteller',
        tagline: 'Spin tales, weave lies, and toast to the best improv.',
        description:
          'Every card nudges the group to share a story or improvise a hilarious moment. Perfect for players who love tall tales.',
      },
      fr: {
        name: 'Conteur',
        tagline: 'Raconte des histoires, improvise et trinque pour la meilleure impro.',
        description:
          'Chaque carte pousse le groupe à partager une histoire ou à improviser un moment hilarant. Parfait pour ceux qui adorent les récits.',
      },
    },
  },
  {
    id: 'chaos',
    translations: {
      en: {
        name: 'Chaos Mode',
        tagline: 'Fast-paced twists with plenty of group participation.',
        description:
          'Expect the unexpected: sudden challenges, partner swaps, and cheers that keep everyone guessing what comes next.',
      },
      fr: {
        name: 'Mode Chaos',
        tagline: 'Des rebondissements rapides avec beaucoup de participation.',
        description:
          'Attends-toi à l’imprévu : défis éclairs, échanges de partenaires et toasts qui surprennent à chaque carte.',
      },
    },
  },
];

export const getGameModeCopy = (mode: GameMode, language: Language): GameModeCopy =>
  mode.translations[language] ?? mode.translations[fallbackLanguage];
