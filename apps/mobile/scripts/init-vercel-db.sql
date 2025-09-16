BEGIN;

CREATE TABLE IF NOT EXISTS game_modes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_mode_translations (
  game_mode_id TEXT NOT NULL REFERENCES game_modes(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (game_mode_id, language)
);

CREATE TABLE IF NOT EXISTS rule_templates (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr')),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  participants INTEGER NOT NULL CHECK (participants > 0),
  mode_ids TEXT[] NOT NULL,
  translation_map JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rule_templates_language ON rule_templates (language);
CREATE INDEX IF NOT EXISTS idx_rule_templates_mode_ids ON rule_templates USING GIN (mode_ids);

INSERT INTO game_modes (id) VALUES
  ('classic'),
  ('storyteller'),
  ('chaos')
ON CONFLICT (id) DO NOTHING;

INSERT INTO game_mode_translations (game_mode_id, language, name, tagline, description) VALUES
  (
    'classic',
    'en',
    'Classic Rabatize',
    'Balanced mix of group prompts and quick dares.',
    'The classic experience. Expect social challenges, rhythm games, and cheers that make everyone feel part of the crew.'
  ),
  (
    'classic',
    'fr',
    'Rabatize Classique',
    'Mélange équilibré de défis de groupe et de gages rapides.',
    'L’expérience classique. Attends-toi à des défis sociaux, des jeux de rythme et des toasts qui mettent tout le monde dans l’ambiance.'
  ),
  (
    'storyteller',
    'en',
    'Storyteller',
    'Spin tales, weave lies, and toast to the best improv.',
    'Every card nudges the group to share a story or improvise a hilarious moment. Perfect for players who love tall tales.'
  ),
  (
    'storyteller',
    'fr',
    'Conteur',
    'Raconte des histoires, improvise et trinque pour la meilleure impro.',
    'Chaque carte pousse le groupe à partager une histoire ou à improviser un moment hilarant. Parfait pour ceux qui adorent les récits.'
  ),
  (
    'chaos',
    'en',
    'Chaos Mode',
    'Fast-paced twists with plenty of group participation.',
    'Expect the unexpected: sudden challenges, partner swaps, and cheers that keep everyone guessing what comes next.'
  ),
  (
    'chaos',
    'fr',
    'Mode Chaos',
    'Des rebondissements rapides avec beaucoup de participation.',
    'Attends-toi à l’imprévu : défis éclairs, échanges de partenaires et toasts qui surprennent à chaque carte.'
  )
ON CONFLICT (game_mode_id, language)
DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description;

INSERT INTO rule_templates (id, language, title, prompt, participants, mode_ids, translation_map) VALUES
  (
    'toast-master',
    'en',
    'Toast Master',
    '{{player_1}} raises a toast and gives out {{drinks}} drinks to share.',
    1,
    ARRAY['classic', 'storyteller', 'chaos'],
    '{"en": "toast-master", "fr": "toast-master-fr"}'::jsonb
  ),
  (
    'toast-master-fr',
    'fr',
    'Maître du toast',
    '{{player_1}} porte un toast et distribue {{drinks}} gorgées à partager.',
    1,
    ARRAY['classic', 'storyteller', 'chaos'],
    '{"en": "toast-master", "fr": "toast-master-fr"}'::jsonb
  ),
  (
    'story-swap',
    'en',
    'Story Swap',
    '{{player_1}} tells a quick tale about {{player_2}}. If {{player_2}} laughs, they hand out {{drinks}} drinks; otherwise {{player_1}} drinks them.',
    2,
    ARRAY['classic', 'storyteller'],
    '{"en": "story-swap", "fr": "story-swap-fr"}'::jsonb
  ),
  (
    'story-swap-fr',
    'fr',
    'Échange d''histoires',
    '{{player_1}} raconte une histoire rapide sur {{player_2}}. Si {{player_2}} rit, iel distribue {{drinks}} gorgées ; sinon {{player_1}} les boit.',
    2,
    ARRAY['classic', 'storyteller'],
    '{"en": "story-swap", "fr": "story-swap-fr"}'::jsonb
  ),
  (
    'rabatize-chant',
    'en',
    'Rabatize Chant',
    'Everyone chants "Rabatize" while {{player_1}} counts down from five. Anyone who breaks rhythm drinks {{drinks}}.',
    1,
    ARRAY['classic', 'chaos'],
    '{"en": "rabatize-chant", "fr": "rabatize-chant-fr"}'::jsonb
  ),
  (
    'rabatize-chant-fr',
    'fr',
    'Chant Rabatize',
    'Tout le monde scande "Rabatize" pendant que {{player_1}} compte à rebours depuis cinq. Ceux qui cassent le rythme boivent {{drinks}}.',
    1,
    ARRAY['classic', 'chaos'],
    '{"en": "rabatize-chant", "fr": "rabatize-chant-fr"}'::jsonb
  ),
  (
    'synchronized-clap',
    'en',
    'Synchronized Clap',
    '{{player_1}} and {{player_2}} perform a synchronized clap. If they miss, both drink {{drinks}}.',
    2,
    ARRAY['chaos'],
    '{"en": "synchronized-clap", "fr": "synchronized-clap-fr"}'::jsonb
  ),
  (
    'synchronized-clap-fr',
    'fr',
    'Claque synchronisée',
    '{{player_1}} et {{player_2}} tapent dans leurs mains en même temps. S’ils ratent, les deux boivent {{drinks}}.',
    2,
    ARRAY['chaos'],
    '{"en": "synchronized-clap", "fr": "synchronized-clap-fr"}'::jsonb
  ),
  (
    'story-relay',
    'en',
    'Story Relay',
    '{{player_1}} starts a story, {{player_2}} continues it, and {{player_3}} ends it. The trio hands out {{drinks}} drinks if the table applauds.',
    3,
    ARRAY['storyteller'],
    '{"en": "story-relay", "fr": "story-relay-fr"}'::jsonb
  ),
  (
    'story-relay-fr',
    'fr',
    'Relais d''histoires',
    '{{player_1}} commence une histoire, {{player_2}} la continue et {{player_3}} la conclut. Le trio distribue {{drinks}} gorgées si la table applaudit.',
    3,
    ARRAY['storyteller'],
    '{"en": "story-relay", "fr": "story-relay-fr"}'::jsonb
  ),
  (
    'call-out',
    'en',
    'Call Out',
    'Anyone who has toasted with {{player_1}} tonight drinks {{drinks}}.',
    1,
    ARRAY['classic', 'chaos'],
    '{"en": "call-out", "fr": "call-out-fr"}'::jsonb
  ),
  (
    'call-out-fr',
    'fr',
    'Appel ciblé',
    'Tous ceux qui ont trinqué avec {{player_1}} ce soir boivent {{drinks}}.',
    1,
    ARRAY['classic', 'chaos'],
    '{"en": "call-out", "fr": "call-out-fr"}'::jsonb
  ),
  (
    'spotlight-word',
    'en',
    'Spotlight Word',
    '{{player_1}} picks a word. Everyone tells a mini-story using it or drinks {{drinks}}.',
    1,
    ARRAY['storyteller', 'classic'],
    '{"en": "spotlight-word", "fr": "spotlight-word-fr"}'::jsonb
  ),
  (
    'spotlight-word-fr',
    'fr',
    'Mot vedette',
    '{{player_1}} choisit un mot. Tout le monde raconte une mini-histoire qui l’utilise ou boit {{drinks}}.',
    1,
    ARRAY['storyteller', 'classic'],
    '{"en": "spotlight-word", "fr": "spotlight-word-fr"}'::jsonb
  ),
  (
    'seat-swap',
    'en',
    'Seat Swap',
    '{{player_1}} swaps seats with {{player_2}}. The last to sit drinks {{drinks}}.',
    2,
    ARRAY['classic', 'chaos'],
    '{"en": "seat-swap", "fr": "seat-swap-fr"}'::jsonb
  ),
  (
    'seat-swap-fr',
    'fr',
    'Échange de places',
    '{{player_1}} échange sa place avec {{player_2}}. Le dernier à s’asseoir boit {{drinks}}.',
    2,
    ARRAY['classic', 'chaos'],
    '{"en": "seat-swap", "fr": "seat-swap-fr"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  language = EXCLUDED.language,
  title = EXCLUDED.title,
  prompt = EXCLUDED.prompt,
  participants = EXCLUDED.participants,
  mode_ids = EXCLUDED.mode_ids,
  translation_map = EXCLUDED.translation_map;

COMMIT;
