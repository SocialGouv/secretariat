# Secrétariat

Application de **gestion** des **utilisateurs externes** des différents outils en ligne de la **Fabrique Numérique des Ministères Sociaux**.

## Fonctionnement

### Définitions

- `service` : un **service externe** utilisé par la Fabrique (Github, Mattermost, etc.). Un service peut-être auto-hébergé par la Fabrique ou non.
- `account`, `compte` : un **accès** à la Fabrique existant **au sein d'un service** (membre de l'organisation Github, compte Mattermost, etc.).
- `user`, `utilisateur` : objet issu de la **fusion de plusieurs comptes**. Représente le fait que plusieurs comptes **appartiennent à une même entité** (personne, produit, équipe, etc.).
- `onboarding`, `embarquement` : procédure d'**accueil d'un nouveau membre** à la Fabrique. Demande possiblement la **création d'un compte** sur un ou plusieurs services.

### Backend NodeJS

L'application est capable d'**afficher et administrer** (insertion et suppression) **chaque service externe** utilisé par la Fabrique (Github, Mattermost, Sentry, etc.). Elle dispose pour ce faire d'un **token d'accès administrateur** pour chaque service (non présents en environnement de développement public).

L'interaction avec un service se fait dans la plupart des cas avec son **API REST**. La seule exception à ce jour est le service Github, qui propose une API GraphQL qui a été reliée au backend Hasura (seulement pour l'opération de synchronisation).

#### Synchronisation des accès

Secrétariat maintient une **base de donnée** qui **reflète l'état de la liste des accès existants** sur chaque service de la Fabrique.

Le endpoint `/api/sync` déclenche la **synchronisation auprès des tous les services**. La synchronisation consiste au **téléchargement de toutes les données** puis à la **fusion avec l'état précédent stocké** dans la base de données.

Un **cron** mis en place sur Hasura déclenche la **synchronisation quotidiennement**.

Voir `src/services/sync.ts`.

#### Révoquer un accès

L'application permet aussi de révoquer un accès à la Fabrique, c'est-à-dire de **supprimer un compte**. La révoquation consiste à **envoyer la requête de suppression** à l'API du service, puis à **supprimer le compte dans la base de données** si l'API répond un statut de succès.

Il faut noter que beaucoup de services de la Fabrique utilisent l'**OAuth Github**. Pour **révoquer réellement** l'accès d'un utilisateur à un des ces services, il peut donc être nécessaire de **révoquer également son compte Github**.

Voir `src/services/revoke.ts`.

#### Créer un accès

Enfin, l'application permet de créer de nouveaux accès à la Fabrique au cours de la **procédure d'onboarding**. De manière similaire à la révocation, la création d'un compte consiste à **envoyer la requête de création** de compte à l'API du service concerné puis à **insérer le compte en base de données** si l'API répond avec un statut de succès.

Du fait de l'utilisation de l'**OAuth Github** pour plusieurs services, la création d'un **compte Github implique la création d'un compte sur chaque service utilisant l'OAuth**.

Voir `src/services/onboard.ts`.

#### Authentification

Ce composant est également l'**authorité d'authentification** qui fournit au client le **JWT signé** lui permettant d'**interagir avec le backend Hasura**, c'est-à-dire avec la base de données.

L'émission de ce JWT se fait sous condition que le client se **connecte avec Github** et soit **membre de certaines équipes spécifiques** de l'organisation Github de la Fabrique.

La backend NodeJS signe un **JWT pour lui-même** quand il doit interagir avec Hasura.

Voir https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/.

### Backend Hasura

Ce composant **enveloppe la base de données** de l'application. Il interagit avec le backend NodeJS et également directement avec le frontend pour les opérations qui le permettent.

### Frontend

Le client de l'application permet à un **utilisateur authentifié** de :

- **voir la liste** des comptes existants
- **fusionner des comptes** vers un utilisateur
- **révoquer un accès** (supprimer un compte)
- **valider une demande d'embarquement** (création de comptes)

Un utilisateur **non authentifié** peut effectuer une **demande d'embarquement** qui sera transmise aux **administrateurs**.

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
