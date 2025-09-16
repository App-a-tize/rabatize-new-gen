export type RuleCategory =
  | 'Engagement'
  | 'Progression'
  | 'Sécurité'
  | 'Bonus'
  | 'Communication';

export type DifficultyLevel = 'Débutant' | 'Standard' | 'Expert';

export type ModeStatus = 'Planifié' | 'Actif' | 'Archivé';

export interface Rule {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: RuleCategory;
  tags: string[];
  isActive: boolean;
  lastUpdated: string;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  status: ModeStatus;
  rotation: 'Ponctuel' | 'Hebdomadaire' | 'Mensuel';
  ruleIds: string[];
  metrics: {
    retention: number;
    satisfaction: number;
    completion: number;
  };
  nextReview: string;
}

export interface DeploymentActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'Succès' | 'Attention' | 'Information';
}

export interface Insight {
  id: string;
  label: string;
  description: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}
