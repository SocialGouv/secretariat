# secretariat

Application de gestion des utilisateurs externes des différents outils en ligne de la Fabrique.

## Exécuter l'app avec le serveur de développement

### Lancer la base de données PostgreSQL et le serveur Hasura

```sh
docker-compose up
```

- importer les metadonnées Hasura `hasura_metadata_*.json`
- régler l'url des *Actions* avec l'IP du bridge Docker

### Lancer le serveur de développement React

```sh
cd frontend
npm run start
```

### Lancer le serveur Express

```sh
cd backend/api
npx nodemon start
```