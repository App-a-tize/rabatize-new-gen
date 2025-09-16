export type RuleTemplate = {
  id: string;
  title: string;
  prompt: string;
  participants: number;
  modeIds: string[];
};

export type CompiledRule = {
  id: string;
  title: string;
  text: string;
  drinks: number;
  players: string[];
};

const ruleTemplates: RuleTemplate[] = [
  {
    id: 'toast-master',
    title: 'Toast Master',
    participants: 1,
    modeIds: ['classic', 'storyteller', 'chaos'],
    prompt: '{{player_1}} raises a toast and gives out {{drinks}} drinks to share.',
  },
  {
    id: 'story-swap',
    title: 'Story Swap',
    participants: 2,
    modeIds: ['classic', 'storyteller'],
    prompt:
      '{{player_1}} tells a quick tale about {{player_2}}. If {{player_2}} laughs, they hand out {{drinks}} drinks; otherwise {{player_1}} drinks them.',
  },
  {
    id: 'rabatize-chant',
    title: 'Rabatize Chant',
    participants: 1,
    modeIds: ['classic', 'chaos'],
    prompt:
      'Everyone chants "Rabatize" while {{player_1}} counts down from five. Anyone who breaks rhythm drinks {{drinks}}.',
  },
  {
    id: 'synchronized-clap',
    title: 'Synchronized Clap',
    participants: 2,
    modeIds: ['chaos'],
    prompt: '{{player_1}} and {{player_2}} perform a synchronized clap. If they miss, both drink {{drinks}}.',
  },
  {
    id: 'story-relay',
    title: 'Story Relay',
    participants: 3,
    modeIds: ['storyteller'],
    prompt:
      '{{player_1}} starts a story, {{player_2}} continues it, and {{player_3}} ends it. The trio hands out {{drinks}} drinks if the table applauds.',
  },
  {
    id: 'call-out',
    title: 'Call Out',
    participants: 1,
    modeIds: ['classic', 'chaos'],
    prompt: 'Anyone who has toasted with {{player_1}} tonight drinks {{drinks}}.',
  },
  {
    id: 'spotlight-word',
    title: 'Spotlight Word',
    participants: 1,
    modeIds: ['storyteller', 'classic'],
    prompt: '{{player_1}} picks a word. Everyone tells a mini-story using it or drinks {{drinks}}.',
  },
  {
    id: 'seat-swap',
    title: 'Seat Swap',
    participants: 2,
    modeIds: ['classic', 'chaos'],
    prompt: '{{player_1}} swaps seats with {{player_2}}. The last to sit drinks {{drinks}}.',
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
): CompiledRule | null => {
  if (players.length === 0) {
    return null;
  }

  const applicableRules = ruleTemplates.filter(
    (rule) => (!modeId || rule.modeIds.includes(modeId)) && players.length >= rule.participants,
  );

  const fallbackRules = ruleTemplates.filter((rule) => players.length >= rule.participants);

  const template = pickRandom(applicableRules) ?? pickRandom(fallbackRules);

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

  return {
    id: template.id,
    title: template.title,
    text,
    drinks,
    players: selectedPlayers,
  };
};
