# Site Web ABYSSE - Musée Maritime

Site web officiel du musée maritime ABYSSE, avec gestion de contenu (CMS) intégrée pour les articles et actualités.

## 📋 Table des Matières

- [Technologies](#technologies)
- [Architecture du Projet](#architecture-du-projet)
- [Installation et Configuration](#installation-et-configuration)
- [Structure du Projet](#structure-du-projet)
- [Système de Gestion de Contenu](#système-de-gestion-de-contenu)
- [Base de Données Firestore](#base-de-données-firestore)
- [API Routes](#api-routes)
- [Déploiement](#déploiement)

## 🛠 Technologies

### Frontend
- **Next.js 14** (App Router) - Framework React avec rendu hybride
- **TypeScript** - Typage statique pour plus de fiabilité
- **Tailwind CSS** - Framework CSS utility-first
- **GSAP** - Animations avancées (ScrollTrigger)
- **Three.js** - Scène 3D interactive (banc de poissons)
- **TipTap** - Éditeur WYSIWYG pour les articles

### Backend & Services
- **Firebase Firestore** - Base de données NoSQL temps réel
- **Firebase Admin SDK** - Opérations privilégiées côté serveur
- **Cloudinary** - Hébergement et optimisation d'images
- **Next.js API Routes** - Endpoints serveur sécurisés

### Déploiement
- **Vercel** - Plateforme de déploiement Next.js
- **Git** - Contrôle de version

## 🏗 Architecture du Projet

Le projet suit l'architecture **App Router de Next.js 14** avec une séparation claire entre :

- **Pages publiques** : Site vitrine du musée
- **Interface admin** : CMS sécurisé pour gérer le contenu
- **API Routes** : Endpoints serveur pour les opérations sensibles

### Principe de Fonctionnement

```
┌─────────────────┐
│  Client (Web)   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Next.js │ (Frontend + API Routes)
    └────┬────┘
         │
    ┌────▼────────────────────────┐
    │  Firebase Firestore         │
    │  - Collection "articles"    │
    │  - Collection "categories"  │
    └────┬────────────────────────┘
         │
    ┌────▼────────┐
    │ Cloudinary  │ (Images)
    └─────────────┘
```

## 🚀 Installation et Configuration

### Prérequis

- Node.js 18+ et npm
- Compte Firebase (avec Firestore activé)
- Compte Cloudinary (optionnel, pour l'upload d'images)

### 1. Cloner le Projet

```bash
git clone <url-du-repo>
cd reaco-site-abysse
npm install
```

### 2. Configuration des Variables d'Environnement

Créer un fichier `.env.local` à la racine du projet :

```bash
# Firebase Client (Public - utilisé côté navigateur)
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (Secret - utilisé côté serveur uniquement)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@votre_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_PRIVEE\n-----END PRIVATE KEY-----\n"

# Mot de passe Admin (Secret)
ADMIN_PASSWORD=votre_mot_de_passe_admin_securise

# Cloudinary (pour upload d'images)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=votre_api_secret
```

### 3. Initialiser Firebase

1. Créer un projet Firebase sur https://console.firebase.google.com
2. Activer **Firestore Database**
3. Créer un compte de service :
   - Aller dans **Project Settings > Service Accounts**
   - Générer une nouvelle clé privée (JSON)
   - Extraire `client_email` et `private_key`
4. Configurer les règles Firestore (voir section Base de Données)

### 4. Lancer le Projet

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Lancer le build
npm start
```

Le site sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
reaco-site-abysse/
├── src/
│   ├── app/                          # Pages Next.js (App Router)
│   │   ├── api/                      # API Routes (Backend)
│   │   │   ├── auth/login/           # Authentification admin
│   │   │   ├── articles/             # CRUD articles
│   │   │   ├── categories/           # CRUD catégories
│   │   │   └── upload/               # Upload images Cloudinary
│   │   ├── admin/                    # Interface admin (CMS)
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── articles/             # Gestion des articles
│   │   │   ├── categories/           # Gestion des catégories
│   │   │   └── nouveau/              # Création d'article
│   │   ├── actualites/               # Page publique des actualités
│   │   └── ...                       # Autres pages publiques
│   ├── components/                   # Composants React
│   │   ├── admin/                    # Composants admin
│   │   │   ├── AdminProvider.tsx     # Contexte d'authentification
│   │   │   ├── AdminLayout.tsx       # Layout avec sidebar
│   │   │   ├── CategoryForm.tsx      # Formulaire catégories
│   │   │   └── ...
│   │   ├── Canvas/                   # Composants Three.js
│   │   └── UI/                       # Composants UI réutilisables
│   ├── hooks/                        # Custom React Hooks
│   │   ├── useArticles.ts            # Hook articles Firestore
│   │   └── useCategories.ts          # Hook catégories Firestore
│   ├── services/                     # Logique métier
│   │   └── categoryService.ts        # Service gestion catégories
│   ├── types/                        # Types TypeScript
│   │   └── category.ts               # Types et utilitaires catégories
│   ├── lib/                          # Bibliothèques
│   │   └── firebase-admin.ts         # Firebase Admin SDK
│   └── firebase.ts                   # Firebase Client SDK
├── public/                           # Assets statiques
├── .env.local                        # Variables d'environnement (git-ignoré)
└── package.json                      # Dépendances npm
```

## 🎨 Système de Gestion de Contenu

### Interface Admin

L'interface admin est accessible sur `/admin` et nécessite une authentification par mot de passe (voir `.env.local`).

#### Pages Admin

- `/admin` - Dashboard avec statistiques
- `/admin/articles` - Liste de tous les articles (recherche, filtres, suppression)
- `/admin/nouveau` - Créer un nouvel article
- `/admin/articles/[id]` - Éditer un article existant
- `/admin/categories` - Gérer les catégories d'articles

#### Fonctionnalités CMS

**Gestion des Articles :**
- Éditeur riche TipTap (gras, italique, titres, listes, liens)
- Upload d'images via Cloudinary
- Catégorisation dynamique
- Option "Mettre en avant" (épinglé en haut de la page actualités)
- Champs spéciaux pour les événements (date/heure)

**Gestion des Catégories :**
- Créer des catégories personnalisées (nom, clé, couleur, ordre)
- Modifier les catégories existantes
- Supprimer avec réassignation automatique des articles
- 3 catégories par défaut protégées (Événement, Découverte, Vie du musée)
- Palette de 6 couleurs pour les badges

## 🗄 Base de Données Firestore

### Collections

#### `articles`
Structure d'un document article :

```typescript
{
  id: string,                    // Auto-généré par Firestore
  titre: string,                 // Titre de l'article
  resume: string,                // Résumé court
  contenu: string,               // Contenu HTML (TipTap)
  categorie: string,             // Clé de catégorie (ex: "evenement")
  label_categorie: string,       // Label catégorie (ex: "Événement")
  image_url: string,             // URL image Cloudinary
  date_texte: string,            // Date formatée (ex: "15 janvier 2024")
  mis_en_avant: boolean,         // Article épinglé ?
  date_evenement: string | null, // Date événement (catégorie "evenement")
  heure_evenement: string | null,// Heure événement
  date: Timestamp,               // Timestamp Firestore (tri)
  createdAt: Timestamp,          // Date de création
  updatedAt: Timestamp           // Date de modification
}
```

#### `categories`
Structure d'un document catégorie :

```typescript
{
  id: string,              // Auto-généré par Firestore
  key: string,             // Clé unique (ex: "evenement")
  label: string,           // Nom affiché (ex: "Événement")
  color: string,           // Couleur Tailwind (ex: "cyan")
  order: number,           // Ordre d'affichage (1, 2, 3...)
  isDefault: boolean,      // Protection suppression (catégories par défaut)
  createdAt: Timestamp,    // Date de création
  updatedAt: Timestamp     // Date de modification
}
```

### Règles de Sécurité Firestore

**Configuration recommandée pour la production :**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lecture publique, écriture interdite (via API Admin uniquement)
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

**Pourquoi cette configuration ?**
- **Lecture publique** : Le site web a besoin de lire les articles et catégories
- **Écriture interdite** : Toutes les modifications passent par les API Routes sécurisées (Firebase Admin SDK)
- **Sécurité** : Impossible de modifier la base directement depuis le navigateur

### Initialisation des Catégories

Au premier lancement, si la collection `categories` est vide, 3 catégories par défaut sont créées automatiquement :

1. **Événement** (cyan) - Pour les événements du musée
2. **Découverte** (emerald) - Pour les découvertes scientifiques
3. **Vie du musée** (amber) - Pour les actualités internes

Ces catégories ont `isDefault: true` et ne peuvent pas être supprimées.

## 🔌 API Routes

Toutes les API Routes utilisent **Firebase Admin SDK** pour contourner les règles de sécurité Firestore.

### `/api/auth/login` (POST)
Authentification admin par mot de passe.

**Body** : `{ password: string }`
**Réponse** : `{ success: boolean }`

### `/api/articles` (GET)
Récupère tous les articles triés par date décroissante.

**Réponse** : `Array<Article>`

### `/api/articles` (POST)
Crée un nouvel article.

**Body** : Voir structure article ci-dessus
**Réponse** : `{ id: string, message: string }`

### `/api/articles/[id]` (PUT)
Met à jour un article existant.

**Body** : Champs à modifier
**Réponse** : `{ message: string }`

### `/api/articles/[id]` (DELETE)
Supprime définitivement un article.

**Réponse** : `{ message: string }`

### `/api/categories` (GET)
Récupère toutes les catégories triées par ordre.

**Réponse** : `Array<Category>`

### `/api/categories` (POST)
Crée une nouvelle catégorie.

**Body** : `{ key, label, color, order }`
**Réponse** : `{ id: string, message: string }`

### `/api/categories/[id]` (PUT)
Modifie une catégorie (nom, couleur, ordre uniquement).

**Body** : `{ label, color, order }`
**Réponse** : `{ message: string }`

### `/api/categories/[id]` (DELETE)
Supprime une catégorie avec réassignation optionnelle.

**Body** : `{ replacementKey?: string }`
**Réponse** : `{ message: string }`

### `/api/upload` (POST)
Upload une image vers Cloudinary.

**Body** : `FormData` avec champ `file`
**Réponse** : `{ url: string, public_id: string }`

## 📦 Déploiement

### Déploiement sur Vercel

1. **Push vers GitHub** :
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Importer sur Vercel** :
   - Aller sur https://vercel.com
   - Cliquer "New Project"
   - Importer le dépôt GitHub
   - Ajouter toutes les variables d'environnement (`.env.local`)
   - Déployer

3. **Configuration Post-Déploiement** :
   - Ajouter le domaine Vercel dans Firebase (Authentication > Authorized domains)
   - Vérifier que les règles Firestore sont activées

### Variables d'Environnement Vercel

Toutes les variables de `.env.local` doivent être ajoutées dans Vercel :

- Settings > Environment Variables
- Copier toutes les variables (Firebase, Cloudinary, ADMIN_PASSWORD)
- Redéployer après ajout

### Maintenance et Mises à Jour

Pour mettre à jour le site en production :

```bash
git add .
git commit -m "Update: description des changements"
git push origin main
```

Vercel déclenchera automatiquement un nouveau déploiement.

## 🔐 Sécurité

### Bonnes Pratiques Implémentées

✅ **Clés Firebase** déplacées vers variables d'environnement
✅ **Admin SDK** utilisé pour toutes les opérations d'écriture
✅ **Session admin** gérée via sessionStorage (côté client)
✅ **Validation** des données avant insertion en base
✅ **Règles Firestore** restrictives (lecture seule côté client)

### Améliorations Recommandées pour la Production

🔄 **Rate Limiting** : Limiter les tentatives de connexion admin
🔄 **JWT Tokens** : Remplacer sessionStorage par des tokens sécurisés
🔄 **Hashing** : Utiliser bcrypt pour le mot de passe admin
🔄 **HTTPS** : Forcer HTTPS en production (automatique sur Vercel)
🔄 **Monitoring** : Ajouter Sentry ou LogRocket pour tracer les erreurs

## 📚 Documentation du Code

Tous les fichiers clés du projet sont documentés en français avec :

- **Commentaires d'en-tête** expliquant le rôle du fichier
- **JSDoc** sur toutes les fonctions et types
- **Commentaires inline** pour les parties complexes
- **Exemples d'utilisation** pour les utilitaires

### Fichiers les Plus Documentés

- `/src/app/api/**/*` - Toutes les API Routes
- `/src/types/category.ts` - Types et utilitaires catégories
- `/src/services/categoryService.ts` - Logique métier catégories
- `/src/hooks/useCategories.ts` - Hook React catégories
- `/src/components/admin/CategoryForm.tsx` - Formulaire catégories

## 🐛 Dépannage

### Problème : "Firebase Admin not initialized"

**Solution** : Vérifier que toutes les variables Firebase Admin sont dans `.env.local` :
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (avec les `\n` échappés)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### Problème : "Cannot read properties of undefined (reading 'key')"

**Cause** : Les catégories n'ont pas été initialisées dans Firestore.

**Solution** :
1. Aller sur `/admin/categories`
2. Les catégories par défaut seront créées automatiquement
3. Rafraîchir la page

### Problème : Images ne s'affichent pas

**Cause** : Cloudinary mal configuré.

**Solution** : Vérifier les variables d'environnement Cloudinary et tester l'upload d'une image.

## 👥 Contribution

Pour contribuer au projet :

1. Fork le dépôt
2. Créer une branche feature (`git checkout -b feature/ma-nouvelle-feature`)
3. Commit les changements (`git commit -m 'Add: ma nouvelle feature'`)
4. Push vers la branche (`git push origin feature/ma-nouvelle-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Projet propriétaire du Musée ABYSSE. Tous droits réservés.

---

**Développé avec ❤️ pour le Musée ABYSSE**
