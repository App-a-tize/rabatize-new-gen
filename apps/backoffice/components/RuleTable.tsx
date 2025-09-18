import { formatDate, formatRelative } from '@/lib/datetime';
import type { Rule } from '@/lib/types';

interface RuleTableProps {
  rules: Rule[];
}

const RuleTable = ({ rules }: RuleTableProps) => {
  const sortedRules = [...rules].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );

  return (
    <div className="table-wrapper" role="region" aria-live="polite">
      <table className="data-table">
        <caption className="visually-hidden">Règles de jeu et métadonnées associées</caption>
        <thead>
          <tr>
            <th scope="col">Titre</th>
            <th scope="col">Résumé</th>
            <th scope="col">Catégorie</th>
            <th scope="col">Tags</th>
            <th scope="col">Statut</th>
            <th scope="col">Dernière mise à jour</th>
          </tr>
        </thead>
        <tbody>
          {sortedRules.map((rule) => (
            <tr key={rule.id}>
              <th scope="row">{rule.title}</th>
              <td>{rule.summary}</td>
              <td>{rule.category}</td>
              <td>
                <div className="tag-cloud inline">
                  {rule.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <span className={`status-pill ${rule.isActive ? 'success' : 'warning'}`}>
                  {rule.isActive ? 'Active' : 'En pause'}
                </span>
              </td>
              <td>
                <div className="table-primary">{formatDate(rule.lastUpdated)}</div>
                <span className="table-secondary">{formatRelative(rule.lastUpdated)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RuleTable;
