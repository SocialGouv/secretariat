# Secrétariat

Application de gestion des utilisateurs externes des différents outils en ligne de la Fabrique.

## Développement

### Fichiers d'environnement

#### Application Next

```bash
cp .env.sample .env.local
```

#### Backend Hasura

```bash
cp packages/hasura/.env.sample packages/hasura/.env
```

On utilise avec ce backend un *remote schema* connecté à Github. Le token d'accès nécessaire ne peut pas être laissé sur tous les environnements de développements, mais Hasura ne démarrera pas tant qu'il n'aura pas réussi à se connecter à Github. Il est donc nécessaire de régler un token de remplacement sur https://github.com/settings/tokens/new (inutile de cocher des autorisations). Remplacez `<YOUR_PAT>` du fichier `packages/hasura/.env` par le token nouvellement créé.
