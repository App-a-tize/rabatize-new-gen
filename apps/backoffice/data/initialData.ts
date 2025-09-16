import type { DeploymentActivity, GameMode, Insight, Rule } from '@/lib/types';

export const initialRules: Rule[] = [
  {
    id: 'rule-progression',
    title: 'Progression dynamique',
    summary: 'Ajuste automatiquement les points en fonction de la difficulté courante.',
    description:
      "Le barème de points est recalculé à chaque fin de partie selon la performance moyenne des joueurs pour maintenir un taux de victoire équilibré.",
    category: 'Progression',
    tags: ['points', 'équilibrage', 'liveops'],
    isActive: true,
    lastUpdated: '2024-09-18T09:15:00.000Z'
  },
  {
    id: 'rule-fairplay',
    title: 'Fair-play communautaire',
    summary: 'Récompenses supplémentaires pour les joueurs signalant des comportements toxiques.',
    description:
      "Les joueurs qui envoient des signalements confirmés obtiennent un bonus temporaire de points de karma visible dans le classement social.",
    category: 'Sécurité',
    tags: ['modération', 'communauté'],
    isActive: true,
    lastUpdated: '2024-09-12T11:40:00.000Z'
  },
  {
    id: 'rule-chaines',
    title: 'Défis en chaîne',
    summary: 'Les défis journaliers non complétés expirent après 48h.',
    description:
      "Chaque défi journalier se transforme en défi expert s'il n'est pas terminé sous 48 heures afin de créer un sentiment d'urgence maîtrisé.",
    category: 'Engagement',
    tags: ['défis', 'rétention'],
    isActive: true,
    lastUpdated: '2024-09-10T08:00:00.000Z'
  },
  {
    id: 'rule-booster',
    title: 'Booster collaboratif',
    summary: 'Bonus d’expérience collectif activé lors des soirées communautaires.',
    description:
      "Lorsque plus de 60 % d’un salon rejoint une soirée communautaire, un multiplicateur d’expérience x1.5 est appliqué à l’ensemble du lobby.",
    category: 'Bonus',
    tags: ['évènement', 'coop'],
    isActive: false,
    lastUpdated: '2024-08-28T19:30:00.000Z'
  }
];

export const initialGameModes: GameMode[] = [
  {
    id: 'mode-ascension',
    name: 'Ascension tactique',
    description:
      "Mode compétitif structuré autour de paliers successifs avec révision hebdomadaire des règles actives.",
    difficulty: 'Expert',
    status: 'Actif',
    rotation: 'Hebdomadaire',
    ruleIds: ['rule-progression', 'rule-fairplay'],
    metrics: {
      retention: 89,
      satisfaction: 4.3,
      completion: 62
    },
    nextReview: '2024-09-25T09:00:00.000Z'
  },
  {
    id: 'mode-exploration',
    name: 'Expédition coopérative',
    description:
      "Sessions coopératives scénarisées avec objectifs optionnels et système de karma communautaire.",
    difficulty: 'Standard',
    status: 'Planifié',
    rotation: 'Mensuel',
    ruleIds: ['rule-fairplay', 'rule-booster'],
    metrics: {
      retention: 72,
      satisfaction: 4.6,
      completion: 48
    },
    nextReview: '2024-10-05T14:30:00.000Z'
  },
  {
    id: 'mode-rapide',
    name: 'Sprint éclair',
    description:
      "Parties rapides de 6 minutes pensées pour le mobile avec défis en chaîne et matchmaking accéléré.",
    difficulty: 'Débutant',
    status: 'Actif',
    rotation: 'Ponctuel',
    ruleIds: ['rule-chaines'],
    metrics: {
      retention: 65,
      satisfaction: 4.1,
      completion: 78
    },
    nextReview: '2024-09-22T17:00:00.000Z'
  }
];

export const deploymentActivities: DeploymentActivity[] = [
  {
    id: 'deploy-20240918',
    title: 'Release 2024.09.18',
    description:
      "Synchronisation Vercel réussie avec activation de la règle 'Progression dynamique' et audit sécurité effectué.",
    date: '2024-09-18T18:20:00.000Z',
    status: 'Succès'
  },
  {
    id: 'deploy-20240911',
    title: 'Préproduction 2024.09.11',
    description:
      "Prévisualisation générée automatiquement depuis la branche feature/modes-coop sur Vercel.",
    date: '2024-09-11T07:35:00.000Z',
    status: 'Information'
  },
  {
    id: 'deploy-20240830',
    title: 'Hotfix 2024.08.30',
    description:
      "Rollback partiel des boosters collaboratifs suite à un taux d’erreur de 2,4 % détecté après déploiement.",
    date: '2024-08-30T22:10:00.000Z',
    status: 'Attention'
  }
];

export const operationalInsights: Insight[] = [
  {
    id: 'insight-stability',
    label: 'Stabilité build',
    description: 'Taux de déploiement réussi sur les 30 derniers jours.',
    value: '96 %',
    trend: 'up'
  },
  {
    id: 'insight-feedback',
    label: 'Feedback joueurs',
    description: 'Note moyenne déclarée sur le dernier sondage in-game.',
    value: '4,4 / 5',
    trend: 'stable'
  },
  {
    id: 'insight-cycle',
    label: 'Cycle de release',
    description: 'Durée médiane entre deux mises en production.',
    value: '6 jours',
    trend: 'down'
  },
  {
    id: 'insight-preview',
    label: 'Prévisualisations',
    description: 'Builds de prévisualisation générés la semaine dernière.',
    value: '12',
    trend: 'up'
  }
];
