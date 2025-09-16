# Backoffice Rabatize

Interface Next.js déployable sur Vercel pour administrer les règles et modes de jeu de Rabatize.

## Démarrage local

```bash
npm install
npm run dev --workspace apps/backoffice
```

L’interface est accessible sur [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
| --- | --- |
| `npm run dev --workspace apps/backoffice` | Lance le serveur de développement Next.js. |
| `npm run lint --workspace apps/backoffice` | Analyse les fichiers avec ESLint. |
| `npm run build --workspace apps/backoffice` | Prépare le build de production. |
| `npm run start --workspace apps/backoffice` | Démarre le serveur Next.js en mode production. |

## Déploiement Vercel automatisé

Le dossier contient tout le nécessaire pour un auto-déploiement sur Vercel :

- `apps/backoffice/vercel.json` définit la racine du projet pour Vercel.
- `.github/workflows/deploy-backoffice.yml` déploie automatiquement les merges sur Vercel.
- Secrets requis côté GitHub : `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

Pour initialiser le projet Vercel :

```bash
cd apps/backoffice
npx vercel link
```

Puis configurez les secrets dans votre dépôt GitHub :

```bash
gh secret set VERCEL_TOKEN --body "<token>"
gh secret set VERCEL_ORG_ID --body "<org-id>"
gh secret set VERCEL_PROJECT_ID --body "<project-id>"
```

Le workflow exécute `vercel pull`, `vercel build` puis `vercel deploy --prebuilt` afin de réutiliser le build Next.js généré côté CI.
