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
