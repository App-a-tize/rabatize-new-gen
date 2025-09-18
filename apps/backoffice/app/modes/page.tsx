import GameModeTable from '@/components/GameModeTable';
import { initialGameModes, initialRules } from '@/data/initialData';

const ModesPage = () => {
  return (
    <div className="dashboard-container">
      <section className="card" aria-labelledby="modes-heading">
        <header className="card-header">
          <div>
            <h1 id="modes-heading" className="card-title">
              Vue des modes de jeu
            </h1>
            <p className="card-subtitle">
              Visualisez les statuts LiveOps, les règles associées et les métriques de performance par mode.
            </p>
          </div>
          <span className="status-pill warning">Rotation planifiée</span>
        </header>
        <p>
          Cette vue synthétise les informations opérationnelles nécessaires pour arbitrer les prochains déploiements de
          modes. Filtrez et exportez les données depuis cette table pour aligner vos équipes design, produit et
          infrastructure.
        </p>
      </section>

      <section className="card" aria-label="Table des modes de jeu">
        <GameModeTable gameModes={initialGameModes} rules={initialRules} />
      </section>
    </div>
  );
};

export default ModesPage;
