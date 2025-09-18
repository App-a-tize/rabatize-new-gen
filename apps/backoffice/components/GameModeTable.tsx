import { formatDate, formatRelative } from '@/lib/datetime';
import type { GameMode, Rule } from '@/lib/types';

interface GameModeTableProps {
  gameModes: GameMode[];
  rules: Rule[];
}

const GameModeTable = ({ gameModes, rules }: GameModeTableProps) => {
  const ruleMap = new Map(rules.map((rule) => [rule.id, rule.title]));
  const sortedModes = [...gameModes].sort(
    (a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
  );

  return (
    <div className="table-wrapper" role="region" aria-live="polite">
      <table className="data-table">
        <caption className="visually-hidden">Modes de jeux et performances associées</caption>
        <thead>
          <tr>
            <th scope="col">Mode</th>
            <th scope="col">Difficulté</th>
            <th scope="col">Statut</th>
            <th scope="col">Rotation</th>
            <th scope="col">Règles liées</th>
            <th scope="col">Performance</th>
            <th scope="col">Prochaine revue</th>
          </tr>
        </thead>
        <tbody>
          {sortedModes.map((mode) => {
            const associatedRules = mode.ruleIds
              .map((ruleId) => ruleMap.get(ruleId))
              .filter((title): title is string => Boolean(title));

            return (
              <tr key={mode.id}>
                <th scope="row">
                  <div className="table-primary">{mode.name}</div>
                  <span className="table-secondary">{mode.description}</span>
                </th>
                <td>{mode.difficulty}</td>
                <td>
                  <span
                    className={`status-pill ${
                      mode.status === 'Actif' ? 'success' : mode.status === 'Planifié' ? 'warning' : 'muted'
                    }`}
                  >
                    {mode.status}
                  </span>
                </td>
                <td>{mode.rotation}</td>
                <td>
                  <div className="tag-cloud inline">
                    {associatedRules.length ? (
                      associatedRules.map((title) => (
                        <span className="tag" key={title}>
                          {title}
                        </span>
                      ))
                    ) : (
                      <span className="table-secondary">Aucune règle associée</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="metric-grid compact">
                    <div className="metric">
                      <span>Rétention</span>
                      <strong>{mode.metrics.retention}%</strong>
                    </div>
                    <div className="metric">
                      <span>Satisfaction</span>
                      <strong>{mode.metrics.satisfaction}</strong>
                    </div>
                    <div className="metric">
                      <span>Complétion</span>
                      <strong>{mode.metrics.completion}%</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="table-primary">{formatDate(mode.nextReview)}</div>
                  <span className="table-secondary">{formatRelative(mode.nextReview)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GameModeTable;
