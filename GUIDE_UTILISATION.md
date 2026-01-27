# ABYSSE - Guide d'Utilisation

Guide de passation pour les administrateurs et futurs utilisateurs du site.

---

## Accès au Site

| Environnement | URL |
|---------------|-----|
| Site public | https://site-abysse.vercel.app |
| Administration | https://site-abysse.vercel.app/admin |

---

## Interface d'Administration

### Connexion

1. Accédez à `/admin`
2. Entrez le mot de passe administrateur : `AbysseSuperMusee2026`
3. Cliquez sur **Connexion**

> **Note** : La session reste active pendant 24h. Après déconnexion, le mot de passe sera redemandé.

---

### Dashboard

Le tableau de bord affiche :
- **Nombre total d'articles** publiés
- **Articles à la une** mis en avant
- **Articles du mois** - publications récentes
- **Dernière mise à jour** - date du dernier article modifié

---

### Gestion des Articles

#### Créer un article

1. Cliquez sur **Nouvel Article** dans le dashboard
2. Remplissez les champs :
   - **Titre** - Titre principal de l'article
   - **Résumé** - Extrait affiché dans la liste (max 200 caractères recommandé)
   - **Contenu** - Corps complet de l'article
   - **Catégorie** - Sélectionnez parmi les catégories existantes
   - **Image** - Uploadez via le bouton ou glissez-déposez
3. Options facultatives :
   - **Mettre à la une** - Affiche l'article en vedette
   - **Date/Heure d'événement** - Pour les événements uniquement
4. Cliquez sur **Publier**

#### Modifier un article

1. Allez dans **Articles** depuis le menu
2. Cliquez sur l'article à modifier
3. Effectuez vos changements
4. Cliquez sur **Enregistrer**

#### Supprimer un article

1. Dans la liste des articles, cliquez sur l'icône **Corbeille**
2. Confirmez la suppression

> ⚠️ **Attention** : La suppression est définitive.

---

### Gestion des Catégories

L'espace admin permet de **créer, modifier et supprimer des catégories** d'articles.

#### Catégories par défaut

| Catégorie | Usage | Couleur |
|-----------|-------|---------|
| Événement | Annonces, vernissages, conférences | Cyan |
| Découverte | Sciences, biodiversité, exploration | Vert |
| Musée | Coulisses, équipe, projets | Orange |

#### Ajouter une catégorie

1. Dans l'espace admin, accédez à la gestion des catégories
2. Cliquez sur **Nouvelle catégorie**
3. Définissez le nom et la couleur
4. Enregistrez

#### Modifier / Supprimer une catégorie

- Cliquez sur une catégorie pour la modifier
- Utilisez l'icône corbeille pour supprimer

> ⚠️ **Attention** : Supprimer une catégorie n'affecte pas les articles existants, mais ils n'auront plus de catégorie assignée.

---

### Upload d'Images

- **Formats acceptés** : JPG, PNG, WebP
- **Taille recommandée** : 1200x800 pixels minimum
- **Poids maximum** : 10 Mo

Les images sont automatiquement :
- Compressées pour le web
- Redimensionnées si nécessaire
- Hébergées sur Cloudinary (CDN)

---

### Articles à la Une

Les articles marqués "à la une" apparaissent :
- En tête de la page Actualités
- Avec un badge spécial

Recommandation : **2 à 3 articles maximum** à la une pour éviter de surcharger.

---

## Accès aux Services Externes

### Firebase (Base de données)

| Info | Valeur |
|------|--------|
| Console | https://console.firebase.google.com |
| Connexion | Compte Google ABYSSE |
| Email | `abyssemusee@gmail.com` |
| Mot de passe | `AbysseSuperMusee2026` |

Les données sont stockées dans la collection `articles`.

---

### Cloudinary (Hébergement images)

| Info | Valeur |
|------|--------|
| Console | https://cloudinary.com/console |
| Connexion | **Via Google** avec le compte ABYSSE |
| Email Google | `abyssemusee@gmail.com` |

Les images uploadées sont visibles dans le **Media Library**.

---

### Vercel (Hébergement du site)

| Info | Valeur |
|------|--------|
| Dashboard | https://vercel.com/dashboard |
| Email du compte | `killiangil2003@gmail.com` |

Le déploiement est **automatique** à chaque push sur la branche `main`.

> 💡 **Conseil** : Pour toute modification sur Vercel, il est plus simple de contacter directement **Killian Gil** à l'adresse : `killiangil04@gmail.com`

---

## Identifiants Récapitulatifs

| Service | Email | Mot de passe |
|---------|-------|--------------|
| Admin du site | - | `AbysseSuperMusee2026` |
| Firebase | `abyssemusee@gmail.com` | `AbysseSuperMusee2026` |
| Cloudinary | `abyssemusee@gmail.com` (via Google) | `AbysseSuperMusee2026` |
| Vercel | `killiangil2003@gmail.com` | Contacter Killian Gil |

---

## Variables d'Environnement

Le fichier `.env.local` contient les clés secrètes :

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

# Admin
ADMIN_PASSWORD=AbysseSuperMusee2026
```

> ⚠️ **Ne jamais partager ces clés publiquement.**

---

## Développement Local

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/KillianGil/reaco-site-abysse

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs dans .env.local

# Lancer le serveur de développement
npm run dev
```

Le site est accessible sur `http://localhost:3000`

### Dépôt GitHub

| Info | Valeur |
|------|--------|
| URL | https://github.com/KillianGil/reaco-site-abysse |
| Branche principale | `main` |

### Build de Production

```bash
npm run build
npm run start
```

---

## Maintenance

### Mises à jour

1. Mettre à jour les dépendances : `npm update`
2. Tester localement : `npm run dev`
3. Vérifier le build : `npm run build`
4. Pousser sur GitHub → Déploiement automatique sur Vercel

### Sauvegardes

- **Base de données** : Export depuis la console Firebase (Firestore > Exporter)
- **Images** : Disponibles et téléchargeables depuis Cloudinary

### Problèmes Courants

| Problème | Solution |
|----------|----------|
| Page blanche | Vérifier les variables d'environnement |
| Images non affichées | Vérifier la configuration Cloudinary |
| Erreur de connexion admin | Vérifier que le mot de passe est correct |
| Données non affichées | Vérifier les règles Firebase Firestore |
| Déploiement échoué | Vérifier les logs sur Vercel |

---

## Contacts

| Rôle | Contact |
|------|---------|
| Développeur principal | killiangil04@gmail.com |
| Compte ABYSSE | abyssemusee@gmail.com |

---

*Document mis à jour le 27 janvier 2026*
