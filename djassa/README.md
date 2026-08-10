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

## 🚀 Déploiement

### Vercel (Frontend)

1. Installez Vercel CLI : `npm i -g vercel`
2. Connectez-vous : `vercel login`
3. Déployez : `vercel`

Ou importez directement le projet depuis GitHub sur [vercel.com](https://vercel.com)

### Supabase (Backend)

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez le schema SQL dans l'éditeur SQL de Supabase :
   ```bash
   # Copiez le contenu de supabase-schema.sql
   ```
3. Récupérez vos identifiants :
   - Project URL
   - Anon/Public Key
4. Configurez les variables d'environnement dans Vercel :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🛠️ Développement Local

```bash
# Installation
cd djassa
npm install

# Démarrage
npm run dev

# Build
npm run build

# Preview
npm run preview
```

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
└── .env.example          # Variables d'environnement exemple
```

## 🎨 Design System Loyancé

Le design utilise une palette de couleurs inspirée de la nature africaine :

- `--paper`: Fond principal beige chaud
- `--moss`: Vert foncé pour les sections sombres
- `--clay`: Terre cuite pour les accents
- `--ink`: Texte principal vert très foncé

## 🔐 Sécurité

- Row Level Security (RLS) activée sur toutes les tables
- Authentification par téléphone avec code OTP
- Protection des données utilisateurs

## 📱 Mobile First

L'interface est entièrement responsive avec :
- Menu hamburger sur mobile
- Grilles adaptatives (3 → 2 → 1 colonnes)
- Boutons et textes optimisés pour le tactile

## 🌐 Pays Cibles

- Côte d'Ivoire 🇨🇮
- Sénégal 🇸🇳
- Bénin 🇧🇯
- Togo 🇹🇬
- Burkina Faso 🇧🇫
- Mali 🇲🇱

## 📝 Notes

- Pour la démo, n'importe quel code à 6 chiffres fonctionne
- En production, intégrez l'API WhatsApp Business pour l'envoi de codes
- Les images utilisent des placeholders Unsplash

## 📄 License

MIT
