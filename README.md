# Secrétariat

Application de gestion des utilisateurs externes des différents outils en ligne de la Fabrique.

## Développement

**Cloner** le dépôt et installer les **dépendances** :

```bash
git clone git@github.com:SocialGouv/secretariat.git
yarn
```

### Fichiers d'environnement

#### Application Next

Environnement pour le composant **application** :

```bash
cp .env.sample .env.local
```

#### Backend Hasura

Environnement pour le composant **Hasura** :

```bash
cp packages/hasura/.env.sample packages/hasura/.env
```

On utilise avec ce backend un _remote schema_ connecté à Github. Le **token d'accès** nécessaire ne peut pas être laissé sur tous les environnements de développement, mais Hasura ne **démarrera pas** tant qu'il n'aura pas réussi à se connecter à Github. Il est donc nécessaire de fournir un **token de remplacement** créé depuis https://github.com/settings/tokens/new (inutile de lui donner des autorisations). Remplacer `<YOUR_PAT>` du fichier `packages/hasura/.env` par le token nouvellement créé.

### Mise en place du backend Hasura

```bash
cd packages/hasura
```

#### Démarrage du serveur

```bash
docker-compose up --build -d
```

On utilise une image Hasura qui applique des **migrations lors de son build**. L'option `--build` n'est donc nécessaire que si la base de données n'est pas déjà mise en place dans le volume Postgres :

- lors de la **première mise en place** de l'environnement
- après avoir **manuellement supprimé** le volume (par exemple `docker-compose down --volumes`)

Il faut alors vérifier que Hasura a **bien fini de démarrer avant de passer à l'étape suivante**. Une bonne manière de s'en assurer est de lancer l'**interface web** : `hasura console`. Le démarrage complet peut prendre **plusieurs minutes**.

#### Seed de données

De manière à se **passer des secrets** permettant de télécharger les données réelles de l'application auprès des différents services de la Fabrique (Mattermost, Github, Sentry, etc.), on applique une **seed** avec de fausses données génériques :

```bash
hasura --database-name=default seed apply
```

### Accès à l'application

Démarrage du **serveur de développement** :

```bash
yarn dev
```

La plupart des pages de Secrétariat sont derrière un **NextAuth qui accepte seulement certains membres de la Fabrique**. En environnement de développement, ce comportement est modifié. Il suffit de rentrer un **nom d'utilisateur arbitraire** sur la page de connexion pour accéder à l'application.
