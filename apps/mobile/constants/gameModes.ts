export type GameMode = {
  id: string;
  name: string;
  tagline: string;
  description: string;
};

export const gameModes: GameMode[] = [
  {
    id: 'classic',
    name: 'Classic Rabatize',
    tagline: 'Balanced mix of group prompts and quick dares.',
    description:
      'The classic experience. Expect social challenges, rhythm games, and cheers that make everyone feel part of the crew.',
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    tagline: 'Spin tales, weave lies, and toast to the best improv.',
    description:
      'Every card nudges the group to share a story or improvise a hilarious moment. Perfect for players who love tall tales.',
  },
  {
    id: 'chaos',
    name: 'Chaos Mode',
    tagline: 'Fast-paced twists with plenty of group participation.',
    description:
      'Expect the unexpected: sudden challenges, partner swaps, and cheers that keep everyone guessing what comes next.',
  },
];
