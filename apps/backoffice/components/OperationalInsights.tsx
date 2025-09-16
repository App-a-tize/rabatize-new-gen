import type { Insight } from '@/lib/types';

interface OperationalInsightsProps {
  insights: Insight[];
}

const trendSymbol: Record<Insight['trend'], string> = {
  up: '▲',
  down: '▼',
  stable: '■'
};

const trendColor: Record<Insight['trend'], string> = {
  up: 'var(--success)',
  down: 'var(--danger)',
  stable: 'var(--muted)'
};

const OperationalInsights = ({ insights }: OperationalInsightsProps) => {
  return (
    <section className="card" aria-labelledby="insights-title">
      <header className="card-header">
        <div>
          <h2 id="insights-title" className="card-title">
            Insights opérationnels
          </h2>
          <p className="card-subtitle">
            Mesurez en continu l’impact des ajustements du gameplay sur l’expérience des joueurs.
          </p>
        </div>
      </header>

      <div className="metric-grid">
        {insights.map((insight) => (
          <article key={insight.id} className="metric">
            <span style={{ color: trendColor[insight.trend], fontSize: '1.1rem', fontWeight: 700 }}>
              {trendSymbol[insight.trend]}
            </span>
            <strong>{insight.value}</strong>
            <span style={{ fontWeight: 600 }}>{insight.label}</span>
            <p className="card-subtitle" style={{ margin: 0 }}>{insight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OperationalInsights;
