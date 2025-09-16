# rabatize-new-gen

## Prévisualisations mobiles via GitHub Actions

Le workflow [`pr-preview.yml`](.github/workflows/pr-preview.yml) construit automatiquement des préversions Expo/EAS pour chaque Pull Request. Pour qu'il fonctionne, configurez votre projet Expo et les secrets GitHub suivants :

1. Associez le projet Expo à EAS en local (`npx eas init`), puis récupérez l'identifiant du projet (`projectId`) via `npx expo config --type public | jq '.extra.eas.projectId'` ou depuis https://expo.dev.
2. Dans GitHub, créez (ou réutilisez) un environnement — `DEV` par défaut — et ajoutez-y les secrets :
   - `EXPO_TOKEN` : le token généré par `npx eas token:create`.
   - `EAS_PROJECT_ID` : l'identifiant récupéré à l'étape précédente.
   > 💡 Vous pouvez changer le nom de l'environnement en définissant la variable de dépôt `EXPO_PREVIEW_ENVIRONMENT`.

À chaque PR créée ou mise à jour depuis une branche interne :

- Une mise à jour OTA est publiée sur le canal `pr-<numéro>`.
- Des builds Android (APK interne) et iOS (simulateur) sont lancés.
- Un commentaire est ajouté sur la PR avec les liens de téléchargement.

Les secrets ne sont pas exposés aux forks ; pour les contributions externes, déclenchez les builds depuis une branche du dépôt principal.

## Base de données des modes et des règles

- Le script [`apps/mobile/scripts/init-vercel-db.sql`](apps/mobile/scripts/init-vercel-db.sql) crée la structure Postgres (hébergée sur Vercel) et insère les modes/règles par défaut. Appliquez-le sur une base neuve via `psql` ou le dashboard Vercel Postgres.
- Exposez une route HTTP (par exemple `/config`) qui retourne un JSON de la forme suivante pour que l’application mobile puisse consommer les données :

  ```json
  {
    "modes": [
      {
        "id": "classic",
        "translations": {
          "en": { "name": "Classic Rabatize", "tagline": "…", "description": "…" },
          "fr": { "name": "Rabatize Classique", "tagline": "…", "description": "…" }
        }
      }
    ],
    "rules": [
      {
        "id": "toast-master",
        "language": "en",
        "title": "Toast Master",
        "prompt": "{{player_1}} raises a toast…",
        "participants": 1,
        "modeIds": ["classic", "storyteller", "chaos"],
        "translationMap": { "en": "toast-master", "fr": "toast-master-fr" }
      }
    ]
  }
  ```

- Ajoutez la variable d’environnement `EXPO_PUBLIC_API_URL` (ex. `https://rabatize-api.vercel.app`) dans la configuration Expo afin que l’application récupère les données avant d’afficher l’interface.
