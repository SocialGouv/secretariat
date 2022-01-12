# secretariat

Application de gestion des utilisateurs externes des différents outils en ligne de la Fabrique.

## Exécuter l'app avec le serveur de développement

### Lancer la base de donnée PostgreSQL et le serveur Hasura

```sh
cd backend
docker-compose up
```

Importer ensuite les metadonnées Hasura `hasura_metadata_2022_01_12_09_35_51_241.json` si vous lancez l'application pour la première fois.

### Lancer le serveur de développement React

```sh
cd frontend
npm run start
```