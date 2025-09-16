'use client';

import { useMemo, useState } from 'react';
import type { GameMode, DifficultyLevel, ModeStatus, Rule } from '@/lib/types';
import { formatDate, formatRelative } from '@/lib/datetime';

interface GameModeManagerProps {
  rules: Rule[];
  gameModes: GameMode[];
  onCreate: (payload: Omit<GameMode, 'id'>) => void;
  onUpdate: (id: string, payload: Omit<GameMode, 'id'>) => void;
  onDelete: (id: string) => void;
}

interface FormState {
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  status: ModeStatus;
  rotation: GameMode['rotation'];
  ruleIds: string[];
  retention: number;
  satisfaction: number;
  completion: number;
  nextReview: string;
}

const DIFFICULTIES: DifficultyLevel[] = ['Débutant', 'Standard', 'Expert'];
const STATUSES: ModeStatus[] = ['Planifié', 'Actif', 'Archivé'];
const ROTATIONS: GameMode['rotation'][] = ['Ponctuel', 'Hebdomadaire', 'Mensuel'];

const today = new Date().toISOString().slice(0, 16);

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  difficulty: 'Standard',
  status: 'Planifié',
  rotation: 'Mensuel',
  ruleIds: [],
  retention: 75,
  satisfaction: 4.2,
  completion: 50,
  nextReview: today
};

const GameModeManager = ({ rules, gameModes, onCreate, onUpdate, onDelete }: GameModeManagerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingModeId, setEditingModeId] = useState<string | null>(null);

  const sortedModes = useMemo(
    () => [...gameModes].sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()),
    [gameModes]
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingModeId(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: Omit<GameMode, 'id'> = {
      name: form.name.trim(),
      description: form.description.trim(),
      difficulty: form.difficulty,
      status: form.status,
      rotation: form.rotation,
      ruleIds: form.ruleIds,
      metrics: {
        retention: form.retention,
        satisfaction: form.satisfaction,
        completion: form.completion
      },
      nextReview: new Date(form.nextReview).toISOString()
    };

    if (editingModeId) {
      onUpdate(editingModeId, payload);
    } else {
      onCreate(payload);
    }

    resetForm();
  };

  const handleEdit = (mode: GameMode) => {
    setEditingModeId(mode.id);
    setForm({
      name: mode.name,
      description: mode.description,
      difficulty: mode.difficulty,
      status: mode.status,
      rotation: mode.rotation,
      ruleIds: mode.ruleIds,
      retention: mode.metrics.retention,
      satisfaction: mode.metrics.satisfaction,
      completion: mode.metrics.completion,
      nextReview: mode.nextReview.slice(0, 16)
    });
  };

  return (
    <section className="card" aria-labelledby="modes-title">
      <header className="card-header">
        <div>
          <h2 id="modes-title" className="card-title">
            Modes de jeux
          </h2>
          <p className="card-subtitle">
            Planifiez vos cycles de contenu, associez les règles actives et déclenchez les prévisualisations Vercel.
          </p>
        </div>
        <span className={`status-pill ${editingModeId ? 'warning' : 'success'}`}>
          {editingModeId ? 'Édition en cours' : 'Calendrier à jour'}
        </span>
      </header>

      <form onSubmit={handleSubmit} className="form-grid" style={{ gap: '24px' }}>
        <div className="input-group">
          <label htmlFor="mode-name">Nom</label>
          <input
            id="mode-name"
            name="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Ex. Ascension tactique"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="mode-difficulty">Difficulté</label>
          <select
            id="mode-difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={(event) => setForm((prev) => ({ ...prev, difficulty: event.target.value as DifficultyLevel }))}
          >
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="mode-status">Statut</label>
          <select
            id="mode-status"
            name="status"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ModeStatus }))}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="mode-rotation">Rotation</label>
          <select
            id="mode-rotation"
            name="rotation"
            value={form.rotation}
            onChange={(event) => setForm((prev) => ({ ...prev, rotation: event.target.value as GameMode['rotation'] }))}
          >
            {ROTATIONS.map((rotation) => (
              <option key={rotation} value={rotation}>
                {rotation}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="mode-description">Description</label>
          <textarea
            id="mode-description"
            name="description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Décrivez les objectifs, récompenses et éléments différenciants."
            required
          />
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="mode-rules">Règles associées</label>
          <select
            id="mode-rules"
            name="ruleIds"
            multiple
            value={form.ruleIds}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                ruleIds: Array.from(event.target.selectedOptions).map((option) => option.value)
              }))
            }
          >
            {rules.map((rule) => (
              <option key={rule.id} value={rule.id}>
                {rule.title}
              </option>
            ))}
          </select>
          <small style={{ color: 'var(--muted)' }}>
            Maintenez <kbd>Ctrl</kbd> ou <kbd>Cmd</kbd> pour sélectionner plusieurs règles.
          </small>
        </div>
        <div className="input-group">
          <label htmlFor="mode-retention">Rétention (%)</label>
          <input
            id="mode-retention"
            type="number"
            name="retention"
            min={0}
            max={100}
            value={form.retention}
            onChange={(event) => setForm((prev) => ({ ...prev, retention: Number(event.target.value) }))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="mode-satisfaction">Satisfaction (1-5)</label>
          <input
            id="mode-satisfaction"
            type="number"
            step="0.1"
            min={0}
            max={5}
            name="satisfaction"
            value={form.satisfaction}
            onChange={(event) => setForm((prev) => ({ ...prev, satisfaction: Number(event.target.value) }))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="mode-completion">Taux de complétion (%)</label>
          <input
            id="mode-completion"
            type="number"
            min={0}
            max={100}
            name="completion"
            value={form.completion}
            onChange={(event) => setForm((prev) => ({ ...prev, completion: Number(event.target.value) }))}
          />
        </div>
        <div className="input-group">
          <label htmlFor="mode-review">Prochaine revue</label>
          <input
            id="mode-review"
            type="datetime-local"
            name="nextReview"
            value={form.nextReview}
            onChange={(event) => setForm((prev) => ({ ...prev, nextReview: event.target.value }))}
          />
        </div>
        <div className="button-row" style={{ gridColumn: '1 / -1' }}>
          <button type="button" className="btn secondary" onClick={resetForm}>
            Réinitialiser
          </button>
          <button type="submit" className="btn primary">
            {editingModeId ? 'Mettre à jour le mode' : 'Créer le mode'}
          </button>
        </div>
      </form>

      <div className="section-divider" role="presentation" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sortedModes.map((mode) => {
          const associatedRules = mode.ruleIds.map((ruleId) => rules.find((rule) => rule.id === ruleId)?.title).filter(Boolean);

          return (
            <article key={mode.id}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{mode.name}</h3>
                  <p className="card-subtitle" style={{ marginTop: 4 }}>
                    {mode.description}
                  </p>
                </div>
                <span className={`status-pill ${mode.status === 'Actif' ? 'success' : mode.status === 'Planifié' ? 'warning' : 'muted'}`}>
                  {mode.status}
                </span>
              </header>
              <div className="tag-cloud" style={{ marginTop: 12 }}>
                <span className="tag">{mode.difficulty}</span>
                <span className="tag">Rotation : {mode.rotation}</span>
                {associatedRules.map((ruleTitle) => (
                  <span className="tag" key={ruleTitle}>
                    {ruleTitle}
                  </span>
                ))}
              </div>
              <div className="metric-grid" style={{ marginTop: 12 }}>
                <div className="metric">
                  <span style={{ fontWeight: 600 }}>Rétention</span>
                  <strong>{mode.metrics.retention}%</strong>
                </div>
                <div className="metric">
                  <span style={{ fontWeight: 600 }}>Satisfaction</span>
                  <strong>{mode.metrics.satisfaction}</strong>
                </div>
                <div className="metric">
                  <span style={{ fontWeight: 600 }}>Complétion</span>
                  <strong>{mode.metrics.completion}%</strong>
                </div>
              </div>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>
                Prochaine revue : {formatDate(mode.nextReview)} ({formatRelative(mode.nextReview)})
              </p>
              <div className="button-row" style={{ marginTop: 12 }}>
                <button type="button" className="btn secondary" onClick={() => handleEdit(mode)}>
                  Modifier
                </button>
                <button type="button" className="btn danger" onClick={() => onDelete(mode.id)}>
                  Supprimer
                </button>
              </div>
              <div className="list-divider" role="presentation" />
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default GameModeManager;
