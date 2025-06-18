# Guide du Développeur - Hexo Admin Panel

## Architecture Générale

### 1. Structure du Code

#### API (Classe Principale)
- Gestion des requêtes HTTP vers le backend
- Méthodes CRUD génériques pour les entités
- Gestion des erreurs et des réponses JSON
- Configuration initiale avec `init(type, baseUrl)`

#### Gestionnaires de Données

##### DataFetcher
- Gestion asynchrone des données
- Gestion des états (loading, error, data)
- Méthodes génériques pour la récupération de données
- Pattern Observer pour les mises à jour

##### Classes Spécifiques
- Posts (gestion des articles)
- Pages (gestion des pages statiques)
- Teams (gestion des équipes)
- Stades (gestion des lieux)
- Results (gestion des résultats)
- Datas (gestion des données génériques)
- Settings (gestion des paramètres)
- About (informations sur l'application)

### 2. Système d'Édition

#### Éditeurs de Base
- PostEditor
- PageEditor
- TeamEditor
- StadeEditor
- ResultEditor
- DataEditor

Caractéristiques communes :
- Système de prévisualisation avec `updatePreview()`
- Gestion de l'état de l'édition
- Validation des données
- Sauvegarde automatique avec gestion de localStorage
- Méthode `fetchData()` pour la récupération
- Méthode `render()` pour l'affichage
- Méthode `destroy()` pour le nettoyage

### 3. Système de Tournois

#### TournamentGenerator
- Génération automatique des matchs
- Gestion des équipes
- Calcul des résultats
- Gestion des phases

#### Classes de Tournoi
- TournamentMatch (gestion des matchs individuels)
- TournamentResult (gestion des résultats)
- TournamentMatches (gestion des matchs en masse)
- TournamentResults (affichage des résultats)

### 4. App (Classe Principale)
- Gestion de l'état global avec `state`
- Navigation avec `currentRoute`
- Gestion des vues avec `currentView`
- Initialisation du système avec `init()`

## Points Techniques Importants

### 1. Gestion des États
- Utilisation de localStorage pour la persistance
- Gestion des états de chargement avec `loading`
- Système de cache avec `data`
- Gestion des erreurs avec `error`

### 2. Communication API
- Utilisation de fetch avec gestion des erreurs
- Headers de sécurité
- Méthodes HTTP standard (GET, POST, PUT, DELETE)
- Gestion des réponses JSON

### 3. Validation des Données
- Validation côté client
- Gestion des erreurs d'API
- Système de feedback utilisateur
- Validation des formats

## Bonnes Pratiques de Développement

### 1. Structure de Code
- Chaque classe a une responsabilité unique
- Séparation claire des préoccupations
- Code réutilisable avec héritage
- Documentation des méthodes

### 2. Débogage
- Logging des erreurs avec console.error()
- Points de débogage avec console.log()
- Validation des données avec try/catch
- Tests unitaires

### 3. Performance
- Minimisation des requêtes API
- Gestion du cache avec localStorage
- Optimisation du rendu avec virtual DOM
- Lazy loading des composants

## Points d'Attention

### 1. Sécurité
- Validation des entrées utilisateur
- Protection contre les injections XSS
- Gestion des sessions
- Validation des tokens

### 2. Performance
- Optimisation des requêtes API
- Gestion du cache
- Minimisation du re-rendu
- Optimisation des images

### 3. Maintenabilité
- Code documenté avec JSDoc
- Structure claire et modulaire
- Tests unitaires
- Documentation des changements

## API Principales

### Méthodes CRUD
```javascript
// Exemples d'utilisation
class API {
    async getEntries(type) { ... }
    async createEntry(type, data) { ... }
    async updateEntry(type, id, data) { ... }
    async deleteEntry(type, id) { ... }
}
```

### Gestion des États
```javascript
class DataFetcher {
    constructor(fetchMethod) {
        this.fetchMethod = fetchMethod;
        this.data = null;
        this.loading = false;
        this.error = null;
    }
    async getData() { ... }
}
```

### Exemples d'Utilisation
```javascript
// Initialisation
const api = new API();
api.init('posts', '/api');

// Utilisation
try {
    const posts = await api.getPosts();
    // ... traitement des données
} catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
}
```
