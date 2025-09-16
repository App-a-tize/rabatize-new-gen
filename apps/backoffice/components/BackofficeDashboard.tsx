'use client';

import { useMemo, useState } from 'react';
import {
  deploymentActivities,
  initialGameModes,
  initialRules,
  operationalInsights
} from '@/data/initialData';
import { createId } from '@/lib/id';
import type { GameMode, Rule } from '@/lib/types';
import { formatDate, formatRelative } from '@/lib/datetime';
import DeploymentStatusCard from './DeploymentStatusCard';
import DeploymentTimeline from './DeploymentTimeline';
import GameModeManager from './GameModeManager';
import OperationalInsights from './OperationalInsights';
import RuleManager from './RuleManager';

type RulePayload = Omit<Rule, 'id' | 'lastUpdated'>;
type GameModePayload = Omit<GameMode, 'id'>;

interface StatDescriptor {
  id: string;
  label: string;
  value: string;
  detail?: string;
}

const BackofficeDashboard = () => {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [gameModes, setGameModes] = useState<GameMode[]>(initialGameModes);

  const sortedDeployments = useMemo(
    () => [...deploymentActivities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  );

  const lastDeployment = sortedDeployments[0] ?? null;

  const stats = useMemo<StatDescriptor[]>(() => {
    const activeRules = rules.filter((rule) => rule.isActive).length;
    const plannedModes = gameModes.filter((mode) => mode.status !== 'Archivé').length;

    const nextReview = gameModes
      .map((mode) => mode.nextReview)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

    const recentlyUpdatedRule = [...rules].sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )[0];

    return [
      {
        id: 'stat-rules',
        label: 'Règles actives',
        value: `${activeRules}/${rules.length}`,
        detail: activeRules === rules.length ? 'Toutes les règles sont actives' : 'Certaines règles sont en pause'
      },
      {
        id: 'stat-modes',
        label: 'Modes disponibles',
        value: `${plannedModes}/${gameModes.length}`,
        detail: 'Inclut les modes en production et en prévisualisation'
      },
      {
        id: 'stat-review',
        label: 'Prochaine revue',
        value: nextReview ? formatDate(nextReview) : 'À planifier',
        detail: nextReview ? `Dans ${formatRelative(nextReview)}` : 'Aucune revue planifiée'
      },
      {
        id: 'stat-updated',
        label: 'Dernière mise à jour',
        value: recentlyUpdatedRule ? recentlyUpdatedRule.title : '—',
        detail: recentlyUpdatedRule ? formatRelative(recentlyUpdatedRule.lastUpdated) : undefined
      }
    ];
  }, [rules, gameModes]);

  const handleRuleCreate = (payload: RulePayload) => {
    setRules((previous) => [
      {
        ...payload,
        id: createId('rule'),
        lastUpdated: new Date().toISOString()
      },
      ...previous
    ]);
  };

  const handleRuleUpdate = (id: string, payload: RulePayload) => {
    setRules((previous) =>
      previous.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              ...payload,
              lastUpdated: new Date().toISOString()
            }
          : rule
      )
    );
  };

  const handleRuleDelete = (id: string) => {
    setRules((previous) => previous.filter((rule) => rule.id !== id));
    setGameModes((previous) =>
      previous.map((mode) => ({
        ...mode,
        ruleIds: mode.ruleIds.filter((ruleId) => ruleId !== id)
      }))
    );
  };

  const handleGameModeCreate = (payload: GameModePayload) => {
    setGameModes((previous) => [
      {
        ...payload,
        id: createId('mode')
      },
      ...previous
    ]);
  };

  const handleGameModeUpdate = (id: string, payload: GameModePayload) => {
    setGameModes((previous) => previous.map((mode) => (mode.id === id ? { ...payload, id } : mode)));
  };

  const handleGameModeDelete = (id: string) => {
    setGameModes((previous) => previous.filter((mode) => mode.id !== id));
  };

  const previewCount = sortedDeployments.filter((deployment) => deployment.status === 'Information').length;
  const successRate = sortedDeployments.length
    ? Math.round(
        (sortedDeployments.filter((deployment) => deployment.status === 'Succès').length / sortedDeployments.length) * 100
      )
    : 0;
  const attentionCount = sortedDeployments.filter((deployment) => deployment.status === 'Attention').length;

  return (
    <div className="dashboard-container">
      <section className="card" aria-labelledby="dashboard-title">
        <div className="card-header">
          <div>
            <h1 id="dashboard-title" className="card-title">
              Backoffice Rabatize
            </h1>
            <p className="card-subtitle">
              Pilotez les règles de jeu, configurez les modes et suivez les déploiements Vercel en un coup d’œil.
            </p>
          </div>
          <span className="status-pill success">Auto-déploiement Vercel actif</span>
        </div>
        <div className="section-divider" role="presentation" />
        <p>
          Ce tableau de bord met à disposition les leviers essentiels pour synchroniser votre design de jeu avec le pipeline
          de livraison continue. Utilisez les sections ci-dessous pour orchestrer les règles, préparer les prochains modes et
          déclencher les déploiements de production.
        </p>
      </section>

      <div className="dashboard-grid" role="list" aria-label="Indicateurs clés">
        {stats.map((stat) => (
          <article key={stat.id} className="card" role="listitem">
            <header className="card-header">
              <span className="card-title">{stat.label}</span>
            </header>
            <strong style={{ fontSize: '2rem' }}>{stat.value}</strong>
            {stat.detail ? <p className="card-subtitle">{stat.detail}</p> : null}
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <RuleManager rules={rules} onCreate={handleRuleCreate} onUpdate={handleRuleUpdate} onDelete={handleRuleDelete} />
        <GameModeManager
          rules={rules}
          gameModes={gameModes}
          onCreate={handleGameModeCreate}
          onUpdate={handleGameModeUpdate}
          onDelete={handleGameModeDelete}
        />
      </div>

      <div className="dashboard-grid">
        <DeploymentStatusCard
          lastDeployment={lastDeployment}
          previewCount={previewCount}
          successRate={successRate}
          attentionCount={attentionCount}
        />
        <OperationalInsights insights={operationalInsights} />
        <DeploymentTimeline activities={sortedDeployments} />
      </div>
    </div>
  );
};

export default BackofficeDashboard;
