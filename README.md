# Secrétariat

<!--toc:start-->

- [Fonctionnement](#fonctionnement)
  - [Définitions](#définitions)
  - [Utilisation](#utilisation)
    - [Synchronisation des accès](#synchronisation-des-accès)
    - [Désactiver un accès](#désactiver-un-accès)
      - [Cas particuliers](#cas-particuliers)
    - [Créer un accès](#créer-un-accès)
    - [Authentification](#authentification)
- [Développement](#développement)
  - [Fichiers d'environnement](#fichiers-denvironnement)
    - [Application Next](#application-next)
    - [Backend Hasura](#backend-hasura)
  - [Mise en place du backend Hasura](#mise-en-place-du-backend-hasura)
    - [Démarrage du serveur](#démarrage-du-serveur)
    - [Seed de données](#seed-de-données)
  - [Accès à l'application](#accès-à-lapplication)
  <!--toc:end-->

Application de **gestion** des **utilisateurs** des différents outils en ligne
de la **Fabrique Numérique des Ministères Sociaux**.

## Fonctionnement

### Définitions

- `service` : un **service externe** mis a disposition par la Fabrique (Github,
  Mattermost, etc.). Un service peut-être auto-hébergé par la Fabrique ou non.
- `account`, `compte` : un **accès** à la Fabrique existant **au sein d'un
  service** (membre de l'organisation Github, compte Mattermost, etc.).
- `user`, `utilisateur` : objet issu de la **fusion de plusieurs comptes**.
  Représente le fait que plusieurs comptes **appartiennent à une même entité**
  (personne, produit, équipe, etc.).
- `onboarding`, `embarquement` : procédure d'**accueil d'un nouveau membre** à
  la Fabrique. Demande possiblement la **création d'un compte** sur un ou
  plusieurs services.

### Utilisation

L'application est capable d'**afficher et administrer** (insertion et
suppression) **chaque service externe** utilisé par la Fabrique (Github,
Mattermost, Sentry, etc.). Elle dispose pour ce faire d'un **token d'accès
administrateur** pour chaque service (non présents en environnement de
développement public).

L'interaction avec un service se fait dans la plupart des cas avec son **API
REST**. La seule exception à ce jour est le service Github, qui propose une API
GraphQL qui a été reliée au backend Hasura (seulement pour l'opération de
synchronisation).

#### Synchronisation des accès

Secrétariat maintient une **base de donnée** qui **reflète l'état de la liste
des accès existants** sur chaque service de la Fabrique.

Le endpoint `/api/sync` déclenche la **synchronisation auprès des tous les
services**. La synchronisation consiste au **téléchargement de toutes les
données** puis à la **fusion avec l'état précédent stocké** dans la base de
données.

Un **cron** mis en place sur Hasura déclenche **quotidiennement** une
**synchronisation totale**.

Voir `src/services/sync.ts`.

#### Désactiver un accès

L'application permet aussi de désactiver un compte.

Idéalement, un compté désactivé peut être réactivé, la désactivation est dans ce
cas **réversible**. Cependant, certains services peuvent ne pas permettre une
désactivation parfaitement réversible.

##### Cas particuliers

- **Github** : désactiver un service Github revient à exclure l'utilisateur de
  l'organisation. On peut ensuite le réactiver en lui attribuant automatiquement
  les mêmes droits (équipes, dépôts, etc.) qu'avant. Cependant, l'utilisateur
  devra préalablement **accepter une invitation** dans l'organisation.
- **OVH** : l'API ne permet pas de désactiver l'accès à une boîte mail OVH sans
  effacer son contenu. Pour désactiver un compte, l'application **change le mot
  de passe** de la boîte de manière à priver l'utilisateur de son accès. Pour
  réactiver le compte, l'application doit **envoyer un nouveau mot de passe** à
  l'utilisateur mais cela n'est possible que si l'on dispose de l'**adresse
  email externe vérifiée** de l'utilisateur issue de la procédure
  d'embarquement. Sinon, la **réactivation est impossible**.

Voir `src/services/disablers`.

#### Créer un accès

Enfin, l'application permet de créer de nouveaux accès à la Fabrique au cours de
la **procédure d'onboarding**. De manière similaire à la désactivation, la
création d'un compte consiste à **envoyer la requête de création** de compte à
l'API du service concerné puis à **insérer le compte en base de données** si
l'API répond avec un statut de succès.

Du fait de l'utilisation de l'**OAuth Github** pour plusieurs services, la
création d'un **compte Github implique la création d'un compte sur chaque
service utilisant l'OAuth**.

Les services proposés à l'embarquement sont Github, Mattermost et OVH. Tous les
autres services sont accessibles par l'OAuth Github.

En plus de créer des accès à des services, la procédure d'embarquement permet de
récolter des données propres à l'utilisateur et non à des services :

- date d'arrivée et date de départ
- adresse email vérifiée

Voir `src/services/onboard.ts`.

#### Authentification

Ce composant est également l'**authorité d'authentification** qui fournit au
client le **JWT signé** lui permettant d'**interagir avec le backend Hasura**,
c'est-à-dire avec la base de données.

L'émission de ce JWT se fait sous condition que le client se **connecte avec
Github** et soit **membre de certaines équipes spécifiques** de l'organisation
Github de la Fabrique.

La backend NodeJS signe un **JWT pour lui-même** quand il doit interagir avec
Hasura.

Voir https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/.

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

On utilise avec ce backend un _remote schema_ connecté à Github. Le **token
d'accès** nécessaire ne peut pas être laissé sur tous les environnements de
développement, mais Hasura ne **démarrera pas** tant qu'il n'aura pas réussi à
se connecter à Github. Il est donc nécessaire de fournir un **token de
remplacement** créé depuis https://github.com/settings/tokens/new (inutile de
lui donner des autorisations). Remplacer `<YOUR_PAT>` du fichier
`packages/hasura/.env` par le token nouvellement créé.

### Mise en place du backend Hasura

```bash
cd packages/hasura
```

#### Démarrage du serveur

```bash
docker-compose up --build -d
```

On utilise une image Hasura qui applique des **migrations lors de son build**.
L'option `--build` n'est donc nécessaire que si la base de données n'est pas
déjà mise en place dans le volume Postgres :

- lors de la **première mise en place** de l'environnement
- après avoir **manuellement supprimé** le volume (par exemple
  `docker compose down --volumes`)

Il faut alors vérifier que Hasura a **bien fini de démarrer avant de passer à
l'étape suivante**. Une bonne manière de s'en assurer est de lancer
l'**interface web** : `hasura console` après avoir installé `hasura-cli`. Le
démarrage complet peut prendre **plusieurs minutes**.

#### Seed de données

De manière à se **passer des secrets** permettant de télécharger les données
réelles de l'application auprès des différents services de la Fabrique
(Mattermost, Github, Sentry, etc.), on applique une **seed** avec de fausses
données génériques :

```bash
hasura --database-name=default seed apply
```

### Accès à l'application

Démarrage du **serveur de développement** :

```bash
yarn dev
```

La plupart des pages de Secrétariat sont derrière un **NextAuth qui accepte
seulement certains membres de la Fabrique**. En environnement de développement,
ce comportement est modifié. Il suffit de rentrer un **nom d'utilisateur
arbitraire** sur la page de connexion pour accéder à l'application.
