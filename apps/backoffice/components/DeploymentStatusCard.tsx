import Link from 'next/link';
import type { DeploymentActivity } from '@/lib/types';
import { formatDate, formatRelative } from '@/lib/datetime';

interface DeploymentStatusCardProps {
  lastDeployment: DeploymentActivity | null;
  previewCount: number;
  successRate: number;
  attentionCount: number;
}

const DeploymentStatusCard = ({
  lastDeployment,
  previewCount,
  successRate,
  attentionCount
}: DeploymentStatusCardProps) => {
  return (
    <section className="card" aria-labelledby="deployment-card-title">
      <header className="card-header">
        <div>
          <h2 id="deployment-card-title" className="card-title">
            Déploiement Vercel
          </h2>
          <p className="card-subtitle">
            Synchronisez automatiquement le backoffice sur chaque merge avec les workflows GitHub préconfigurés.
          </p>
        </div>
        <span className="status-pill success">Production prête</span>
      </header>

      <dl style={{ display: 'grid', gap: '12px' }}>
        <div>
          <dt style={{ fontWeight: 600 }}>Dernier déploiement</dt>
          <dd>
            {lastDeployment ? (
              <>
                {formatDate(lastDeployment.date)}
                <span style={{ color: 'var(--muted)', marginLeft: 6 }}>({formatRelative(lastDeployment.date)})</span>
              </>
            ) : (
              'Aucun déploiement effectué'
            )}
          </dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Taux de succès</dt>
          <dd>{successRate}%</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Alerte(s) à suivre</dt>
          <dd>{attentionCount}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Prévisualisations générées</dt>
          <dd>{previewCount} sur les 30 derniers jours</dd>
        </div>
      </dl>

      <div className="section-divider" role="presentation" />

      <div>
        <h3 className="card-subtitle" style={{ fontWeight: 700, marginBottom: 8 }}>
          Configuration résumée
        </h3>
        <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--muted)', display: 'grid', gap: '6px' }}>
          <li>Racine du projet : <code>apps/backoffice</code></li>
          <li>
            Workflow GitHub : <code>.github/workflows/deploy-backoffice.yml</code>
          </li>
          <li>
            Secrets requis : <code>VERCEL_TOKEN</code>, <code>VERCEL_ORG_ID</code>, <code>VERCEL_PROJECT_ID</code>
          </li>
        </ul>
      </div>

      <div className="button-row" style={{ marginTop: '12px' }}>
        <Link
          className="btn primary"
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noreferrer noopener"
        >
          Ouvrir Vercel
        </Link>
        <Link
          className="btn secondary"
          href="https://vercel.com/docs/deployments/git"
          target="_blank"
          rel="noreferrer noopener"
        >
          Docs auto-déploiement
        </Link>
      </div>
    </section>
  );
};

export default DeploymentStatusCard;
