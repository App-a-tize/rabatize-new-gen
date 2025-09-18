import RuleTable from '@/components/RuleTable';
import { initialRules } from '@/data/initialData';

const RulesPage = () => {
  return (
    <div className="dashboard-container">
      <section className="card" aria-labelledby="rules-heading">
        <header className="card-header">
          <div>
            <h1 id="rules-heading" className="card-title">
              Vue des règles
            </h1>
            <p className="card-subtitle">
              Analysez l’ensemble des règles actives et archivées avec leurs métadonnées clés.
            </p>
          </div>
          <span className="status-pill success">Synchronisé</span>
        </header>
        <p>
          Consultez les règles applicables aux différents modes de jeux ainsi que leur historique de mise à jour. Cette
          vue tabulaire permet de préparer des exports ou de vérifier la couverture LiveOps par catégorie.
        </p>
      </section>

      <section className="card" aria-label="Table des règles de jeu">
        <RuleTable rules={initialRules} />
      </section>
    </div>
  );
};

export default RulesPage;
