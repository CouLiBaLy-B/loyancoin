# Djassa - Marketplace pour l'Afrique de l'Ouest 🌍

Une plateforme de petites annonces inspirée de LeBonCoin, spécialement conçue pour l'Afrique de l'Ouest.

## ✨ Fonctionnalités

- **Pas de paiement en ligne** - Transactions en main propre uniquement
- **3 espaces utilisateurs** :
  - 🛒 Acheteur : Parcourir, favoris, historique
  - 🏪 Vendeur : Gérer les annonces, statistiques
  - 🔐 Gestionnaire : Administration de la plateforme
- **WhatsApp comme moyen de communication** - Contact direct entre vendeurs et acheteurs
- **Connexion par WhatsApp** - Validation par code OTP
- **Mobile-first** - Interface optimisée pour mobile
- **Design Premium** - Style éditorial Loyancé avec couleurs terreuses

---

## 🚀 Démarrage Rapide

### 1. Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit sur [supabase.com](https://supabase.com))

### 2. Installation

```bash
# Cloner et installer
cd djassa
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

### 3. Configuration Supabase

#### Étape 1: Créer un projet Supabase

1. Rendez-vous sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Attendez que le projet soit prêt

#### Étape 2: Exécuter le schéma SQL

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez-collez le contenu du fichier `supabase-schema.sql`
3. Cliquez sur **Run** pour exécuter le script

#### Étape 3: Configurer les variables d'environnement

Ouvrez le fichier `.env` et remplissez avec vos identifiants Supabase :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

**Où trouver ces clés ?**
- Dashboard Supabase → **Settings** (roue dentée) → **API**
- **Project URL** → `VITE_SUPABASE_URL`
- **anon/public key** → `VITE_SUPABASE_ANON_KEY`

⚠️ **Important** : N'utilisez JAMAIS la clé `service_role` dans le frontend !

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

---

## 📁 Structure du Projet

```
djassa/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   └── MarqueeBand.tsx
│   ├── contexts/         # Contextes React
│   │   └── AuthContext.tsx
│   ├── lib/              # Utilitaires
│   │   └── supabase.ts
│   ├── pages/            # Pages de l'application
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SellerDashboard.tsx
│   │   ├── BuyerDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ProductPage.tsx
│   ├── types/            # Types TypeScript
│   │   └── index.ts
│   ├── App.tsx
│   └── index.css
├── supabase-schema.sql   # Schema de base de données
├── vercel.json           # Configuration Vercel
├── .env.example          # Variables d'environnement exemple
└── .env                  # Variables d'environnement (à créer)
```

---

## 🔐 Variables d'Environnement

Fichier `.env` complet (copiez depuis `.env.example`) :

```bash
# ===========================================
# DJASSA - Configuration Environment
# ===========================================

# Supabase Configuration (OBLIGATOIRE)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anonyme-publique

# WhatsApp Configuration (OPTIONNEL - pour production)
VITE_WHATSAPP_API_URL=https://api.whatsapp.business.com/v1/
VITE_WHATSAPP_TOKEN=votre-token-whatsapp-business

# Application Configuration (OPTIONNEL)
VITE_APP_NAME=Djassa
VITE_APP_URL=http://localhost:5173
VITE_APP_DESCRIPTION=La marketplace de l'Afrique de l'Ouest

# Mode développement (OPTIONNEL)
VITE_DEBUG_MODE=true

# Limites et configurations (OPTIONNEL)
VITE_MAX_IMAGES_PER_AD=5
VITE_CODE_EXPIRATION_MINUTES=10
VITE_ITEMS_PER_PAGE=20
```

### Mode sans Supabase (Démo locale)

Si vous ne configurez pas Supabase, l'application utilisera :
- Un stockage local (localStorage) pour les démonstrations
- Des données factices pour l'interface
- Une authentification simulée (n'importe quel code à 6 chiffres fonctionne)

---

## 🗄️ Schéma de Base de Données

Le fichier `supabase-schema.sql` crée les tables suivantes :

### Tables principales

| Table | Description |
|-------|-------------|
| `profiles` | Informations utilisateurs (rôle, téléphone, avatar) |
| `listings` | Annonces produits |
| `categories` | Catégories d'annonces |
| `messages` | Messages entre utilisateurs |
| `verification_codes` | Codes de validation WhatsApp |
| `reports` | Signalements (modération) |

### Rôles utilisateurs

- `buyer` - Acheteur (par défaut)
- `seller` - Vendeur (peut publier des annonces)
- `admin` - Gestionnaire (modération, gestion utilisateurs)

---

## 📱 Flux d'Authentification WhatsApp

1. L'utilisateur entre son numéro de téléphone (format international)
   - Exemple Sénégal : `221770000000`
   - Exemple Côte d'Ivoire : `22507000000`
2. Le système génère un code à 6 chiffres
3. Envoi du code via WhatsApp Business API (ou simulation en dev)
4. L'utilisateur saisit le code reçu
5. Validation et création/connexion du compte
6. Redirection vers le dashboard approprié selon le rôle

---

## 🚀 Déploiement

### Sur Vercel (Frontend)

**Option 1: Vercel CLI**

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déploiement production
vercel --prod
```

**Option 2: GitHub Import**

1. Poussez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur **New Project**
4. Importez votre repository GitHub
5. Configurez les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Cliquez sur **Deploy**

### Configuration Supabase pour Production

Dans le dashboard Supabase :

1. Allez dans **Settings** → **Authentication** → **URL Configuration**
2. Ajoutez votre domaine Vercel dans :
   - **Site URL** : `https://votre-app.vercel.app`
   - **Redirect URLs** : `https://votre-app.vercel.app/**`

3. Allez dans **Settings** → **API**
4. Copiez les clés dans les variables d'environnement Vercel

---

## 🎨 Design System Loyancé

Le design utilise une palette de couleurs inspirée de la nature africaine :

| Variable | Couleur | Usage |
|----------|---------|-------|
| `--paper` | `#f5f3ee` | Fond principal beige chaud |
| `--paper-deep` | `#ebe8df` | Fonds de cartes |
| `--ink` | `#1d2821` | Texte principal vert très foncé |
| `--ink-soft` | `#4c554d` | Texte secondaire |
| `--moss` | `#203027` | Sections sombres, héros |
| `--moss-light` | `#30463a` | Hover moss |
| `--clay` | `#c88970` | Accents, boutons, marque principale |
| `--clay-light` | `#e6b9a5` | Accents doux |
| `--line` | `#d9d6cd` | Bordures, diviseurs |

### Typographie

- **Titres** : Georgia, serif (avec emphasis en italique)
- **Corps** : Helvetica Neue, sans-serif

Voir `src/index.css` pour tous les détails du design system.

---

## 🛠️ Commandes Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de dev
npm run build        # Build de production
npm run preview      # Prévisualise la build

# Qualité de code
npm run lint         # Linting
npm run format       # Formatage (si configuré)

# Nettoyage
rm -rf node_modules dist
npm install          # Réinstallation propre
```

---

## 🌐 Pays Cibles

- Côte d'Ivoire 🇨🇮
- Sénégal 🇸🇳
- Bénin 🇧🇯
- Togo 🇹🇬
- Burkina Faso 🇧🇫
- Mali 🇲🇱
- Guinée 🇬🇳
- Niger 🇳🇪

---

## 🔧 Dépannage

### Page blanche au démarrage

1. **Vérifiez la console navigateur** (F12) pour les erreurs
2. **Vérifiez le fichier `.env`** :
   ```bash
   cat .env
   ```
3. **Redémarrez le serveur** :
   ```bash
   Ctrl+C
   npm run dev
   ```

### Erreur de connexion Supabase

```bash
# Testez la connexion
curl "https://votre-projet.supabase.co/rest/v1/" \
  -H "apikey: votre-clé-anon" \
  -H "Authorization: Bearer votre-clé-anon"
```

### Problèmes de build

```bash
# Nettoyer le cache Vite
rm -rf node_modules/.vite
rm -rf dist

# Reconstruire
npm run build
```

---

## 📝 Notes

- Pour la démo locale, n'importe quel code à 6 chiffres fonctionne
- En production, intégrez l'API WhatsApp Business pour l'envoi de codes
- Les images utilisent des placeholders Unsplash
- Row Level Security (RLS) activée sur toutes les tables

---

## 📄 License

MIT

---

**Développé avec ❤️ pour l'Afrique de l'Ouest**

*Djassa - La marketplace qui vous connecte directement.*
