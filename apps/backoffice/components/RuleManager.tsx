'use client';

import { useMemo, useState } from 'react';
import type { Rule, RuleCategory } from '@/lib/types';
import { formatDate } from '@/lib/datetime';

interface RuleManagerProps {
  rules: Rule[];
  onCreate: (payload: Omit<Rule, 'id' | 'lastUpdated'>) => void;
  onUpdate: (id: string, payload: Omit<Rule, 'id' | 'lastUpdated'>) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: RuleCategory[] = ['Engagement', 'Progression', 'Sécurité', 'Bonus', 'Communication'];

interface FormState {
  title: string;
  summary: string;
  description: string;
  category: RuleCategory;
  tagsInput: string;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  summary: '',
  description: '',
  category: 'Engagement',
  tagsInput: '',
  isActive: true
};

const RuleManager = ({ rules, onCreate, onUpdate, onDelete }: RuleManagerProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const sortedRules = useMemo(
    () => [...rules].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()),
    [rules]
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingRuleId(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: form.tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      isActive: form.isActive
    };

    if (editingRuleId) {
      onUpdate(editingRuleId, payload);
    } else {
      onCreate(payload);
    }

    resetForm();
  };

  const handleEdit = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setForm({
      title: rule.title,
      summary: rule.summary,
      description: rule.description,
      category: rule.category,
      tagsInput: rule.tags.join(', '),
      isActive: rule.isActive
    });
  };

  return (
    <section className="card" aria-labelledby="rules-title">
      <header className="card-header">
        <div>
          <h2 id="rules-title" className="card-title">
            Règles de jeu
          </h2>
          <p className="card-subtitle">
            Créez, mettez à jour ou archivez les règles appliquées en production. Chaque modification déclenche une note de
            version.
          </p>
        </div>
        <span className={`status-pill ${editingRuleId ? 'warning' : 'success'}`}>
          {editingRuleId ? 'Modification en cours' : 'Prêt à déployer'}
        </span>
      </header>

      <form onSubmit={handleSubmit} className="form-grid" style={{ gap: '24px' }}>
        <div className="input-group">
          <label htmlFor="rule-title">Titre</label>
          <input
            id="rule-title"
            name="title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Ex. Progression dynamique"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="rule-summary">Résumé</label>
          <input
            id="rule-summary"
            name="summary"
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Une phrase d’intention"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="rule-category">Catégorie</label>
          <select
            id="rule-category"
            name="category"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as RuleCategory }))}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="rule-description">Description complète</label>
          <textarea
            id="rule-description"
            name="description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Décrivez précisément le comportement attendu pour l’équipe LiveOps."
            required
          />
        </div>
        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="rule-tags">Tags (séparés par une virgule)</label>
          <input
            id="rule-tags"
            name="tags"
            value={form.tagsInput}
            onChange={(event) => setForm((prev) => ({ ...prev, tagsInput: event.target.value }))}
            placeholder="équilibrage, coopération, liveops"
          />
        </div>
        <div className="input-group">
          <label htmlFor="rule-active">Statut</label>
          <select
            id="rule-active"
            name="isActive"
            value={form.isActive ? 'active' : 'inactive'}
            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.value === 'active' }))}
          >
            <option value="active">Active</option>
            <option value="inactive">En pause</option>
          </select>
        </div>
        <div className="button-row" style={{ gridColumn: '1 / -1' }}>
          <button type="button" className="btn secondary" onClick={resetForm}>
            Réinitialiser
          </button>
          <button type="submit" className="btn primary">
            {editingRuleId ? 'Mettre à jour' : 'Créer la règle'}
          </button>
        </div>
      </form>

      <div className="section-divider" role="presentation" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sortedRules.map((rule) => (
          <article key={rule.id}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0 }}>{rule.title}</h3>
                <p className="card-subtitle" style={{ marginTop: 4 }}>
                  {rule.summary}
                </p>
              </div>
              <span className={`status-pill ${rule.isActive ? 'success' : 'warning'}`}>
                {rule.isActive ? 'Active' : 'En pause'}
              </span>
            </header>
            <p style={{ marginTop: 12 }}>{rule.description}</p>
            <div className="tag-cloud">
              <span className="tag">{rule.category}</span>
              {rule.tags.map((tag) => (
                <span className="tag" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Dernière mise à jour : {formatDate(rule.lastUpdated)}</p>
            <div className="button-row" style={{ marginTop: 12 }}>
              <button type="button" className="btn secondary" onClick={() => handleEdit(rule)}>
                Modifier
              </button>
              <button type="button" className="btn danger" onClick={() => onDelete(rule.id)}>
                Supprimer
              </button>
            </div>
            <div className="list-divider" role="presentation" />
          </article>
        ))}
      </div>
    </section>
  );
};

export default RuleManager;
