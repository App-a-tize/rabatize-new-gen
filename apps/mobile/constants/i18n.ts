export const supportedLanguages = ['en', 'fr'] as const;

export type Language = (typeof supportedLanguages)[number];

export const fallbackLanguage: Language = 'en';

export const translations = {
  en: {
    'language.en': 'English',
    'language.fr': 'French',
    'home.title': 'Rabatize',
    'home.subtitle': 'Gather the crew and set the stage.',
    'home.playerPlaceholder': 'Player {{index}}',
    'home.addPlayer': '+ Add player',
    'home.chooseMode': 'Choose a mode',
    'home.helperAddPlayers': 'Add at least two players to begin.',
    'home.removePlayer': 'Remove player {{index}}',
    'home.languageToggle.accessibility': 'Change language',
    'home.languageToggle.hint': 'Switch to {{language}}',
    'modes.title': 'Select a game mode',
    'modes.subtitle': 'Each mode changes the rhythm of the night.',
    'modes.settingsTitle': 'Maximum drinks per card',
    'modes.settingsSubtitle': 'Tune the intensity before you start.',
    'modes.startGame': 'Start the game',
    'modes.helper': 'Select a mode and make sure at least two players are ready.',
    'game.maxDrinks': 'Up to {{count}} drinks per card',
    'game.emptyState': 'Add more players or adjust the mode to generate a rule.',
    'game.nextCard': 'Next card',
    'game.adjustSettings': 'Adjust settings',
    'game.drinksLabel': 'drinks',
    'game.sessionMenu': 'Game menu',
    'game.sessionOverview': 'Session overview',
    'game.totalRecordedDrinks': 'Total drinks: {{count}}',
    'game.decreaseDrink': 'Remove one drink',
    'game.increaseDrink': 'Add one drink',
    'game.noPlayersTracking': 'Add players to start tracking drinks.',
    'game.close': 'Close',
    'game.recordHint': 'Tap a player to log drinks for this card.',
    'navigation.modes': 'Game Modes',
    'navigation.game': 'Rabatize',
  },
  fr: {
    'language.en': 'Anglais',
    'language.fr': 'Français',
    'home.title': 'Rabatize',
    'home.subtitle': 'Rassemble la team et mets l’ambiance.',
    'home.playerPlaceholder': 'Joueur {{index}}',
    'home.addPlayer': '+ Ajouter un joueur',
    'home.chooseMode': 'Choisir un mode',
    'home.helperAddPlayers': 'Ajoute au moins deux joueurs pour commencer.',
    'home.removePlayer': 'Retirer le joueur {{index}}',
    'home.languageToggle.accessibility': 'Changer de langue',
    'home.languageToggle.hint': 'Basculer vers {{language}}',
    'modes.title': 'Choisis un mode de jeu',
    'modes.subtitle': 'Chaque mode change le rythme de la soirée.',
    'modes.settingsTitle': 'Nombre max de gorgées par carte',
    'modes.settingsSubtitle': 'Ajuste l’intensité avant de commencer.',
    'modes.startGame': 'Lancer la partie',
    'modes.helper': 'Choisis un mode et assure-toi qu’au moins deux joueurs sont prêts.',
    'game.maxDrinks': 'Jusqu’à {{count}} gorgées par carte',
    'game.emptyState': 'Ajoute des joueurs ou ajuste le mode pour générer une règle.',
    'game.nextCard': 'Carte suivante',
    'game.adjustSettings': 'Ajuster les paramètres',
    'game.drinksLabel': 'gorgées',
    'game.sessionMenu': 'Menu partie',
    'game.sessionOverview': 'Vue de la partie',
    'game.totalRecordedDrinks': 'Total gorgées : {{count}}',
    'game.decreaseDrink': 'Retirer une gorgée',
    'game.increaseDrink': 'Ajouter une gorgée',
    'game.noPlayersTracking': 'Ajoute des joueurs pour suivre les gorgées.',
    'game.close': 'Fermer',
    'game.recordHint': 'Appuie sur un joueur pour enregistrer les gorgées de cette carte.',
    'navigation.modes': 'Modes de jeu',
    'navigation.game': 'Partie',
  },
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof (typeof translations)[Language];

export type TranslationParams = Record<string, string | number>;

export const isSupportedLanguage = (value: string): value is Language =>
  supportedLanguages.some((language) => language === value);
