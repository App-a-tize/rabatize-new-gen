import type { DeploymentActivity } from '@/lib/types';
import { formatDate, formatRelative } from '@/lib/datetime';

interface DeploymentTimelineProps {
  activities: DeploymentActivity[];
}

const statusTone: Record<DeploymentActivity['status'], string> = {
  Succès: 'success',
  Attention: 'warning',
  Information: 'muted'
};

const DeploymentTimeline = ({ activities }: DeploymentTimelineProps) => {
  return (
    <section className="card" aria-labelledby="deployment-timeline-title">
      <header className="card-header">
        <div>
          <h2 id="deployment-timeline-title" className="card-title">
            Historique des déploiements
          </h2>
          <p className="card-subtitle">
            Visualisez l’impact de chaque release et assurez le suivi des actions post-déploiement.
          </p>
        </div>
      </header>

      <div className="timeline" role="list">
        {activities.map((activity) => (
          <article key={activity.id} className="timeline-item" role="listitem">
            <time dateTime={activity.date}>{formatDate(activity.date)}</time>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{activity.title}</h3>
                <span className={`status-pill ${statusTone[activity.status]}`}>{activity.status}</span>
              </div>
              <p className="card-subtitle" style={{ marginTop: 4 }}>
                {activity.description}
              </p>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>{formatRelative(activity.date)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DeploymentTimeline;
