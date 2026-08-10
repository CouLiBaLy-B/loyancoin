# 🗺️ Roadmap de Développement - Djassa

## Statut Actuel : Semaines 1-2 ✅ COMPLÉTÉ

### Fonctionnalités Implémentées

#### ✅ Semaine 1 - Upload d'images et Storage
- [x] **Supabase Storage Integration**
  - Module `src/lib/storage.ts` créé
  - Upload d'images avec optimisation côté client
  - Compression automatique (max 1920px, qualité 80%)
  - Support multi-images (jusqu'à 5 par produit)
  - Gestion des erreurs et fallback
  
- [x] **Composant ImageUploader amélioré**
  - Prévisualisation immédiate (blob URLs)
  - Upload en arrière-plan
  - Barre de progression
  - Suppression d'images
  - Conseils pour de meilleures photos
  
- [x] **Page CreateProduct mise à jour**
  - Intégration du nouveau flux d'upload
  - Optimisation avant upload
  - Progress tracking (10% → 30% → 60% → 90% → 100%)
  - Gestion mode offline (localStorage)

#### ✅ Semaine 2 - Géolocalisation
- [x] **Composant LocationPicker**
  - Détection automatique de position
  - Affichage sur carte (Leaflet/OpenStreetMap)
  - Recherche d'adresse
  - Villes principales d'Afrique de l'Ouest pré-configurées
  
- [x] **Intégration dans CreateProduct**
  - Sélection obligatoire de localisation
  - Affichage ville + pays
  - Coordonnées GPS stockées

---

## 📅 Semaine 3-4 - À IMPLÉMENTER

### Objectif: Confiance & Sécurité

#### 🎯 Vérification d'Identité
```typescript
// Nouveau champ User
interface User {
  // ... champs existants
  idVerified: boolean;
  idType?: 'cni' | 'passport' | 'driver_license';
  idDocumentUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
}
```

**Tâches:**
- [ ] Page de soumission de documents d'identité
- [ ] Upload sécurisé vers Supabase Storage (bucket privé)
- [ ] Dashboard admin pour validation manuelle
- [ ] Badge "Vendeur vérifié" sur les annonces
- [ ] Notification SMS/WhatsApp après validation

#### ⭐ Système de Reviews 1-5 Étoiles
```typescript
interface Review {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number; // 1-5
  comment: string;
  response?: string; // Réponse du vendeur
  created_at: string;
  helpful_count: number;
}
```

**Tâches:**
- [ ] Composant StarRating (affichage + saisie)
- [ ] Formulaire de review post-achat
- [ ] Calcul automatique du rating moyen vendeur
- [ ] Affichage des reviews sur le profil vendeur
- [ ] Modération des reviews (signalement)

#### 🚨 Signalement et Modération
```typescript
interface Report {
  id: string;
  product_id?: string;
  user_id?: string;
  reporter_id: string;
  reason: 'spam' | 'fraud' | 'inappropriate' | 'duplicate' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'action_taken';
  created_at: string;
}
```

**Tâches:**
- [ ] Bouton "Signaler" sur chaque annonce
- [ ] Formulaire de signalement avec motifs
- [ ] Dashboard admin des signalements
- [ ] Actions: masquer, supprimer, bannir
- [ ] Historique des actions de modération

---

## 📅 Semaine 5-6 - Notifications & Engagement

### Push Notifications Navigateur
- [ ] Permission browser notifications
- [ ] Service Worker configuration
- [ ] Notifications: nouveau message, prix baissé, favori
- [ ] Badge non-lus dans le header

### Notifications In-App
- [ ] Centre de notifications (cloche header)
- [ ] Marquer comme lu/non-lu
- [ ] Pagination des notifications
- [ ] Préférences de notification par utilisateur

### Favoris Avancés
- [ ] Alertes prix sur favoris
- [ ] Notification si produit favori vendu
- [ ] Collections de favoris (thématiques)

---

## 📅 Semaine 7-8 - Performance & Mobile

### Progressive Web App (PWA)
- [ ] Manifest.json configuration
- [ ] Service Worker pour cache offline
- [ ] Installation sur écran d'accueil
- [ ] Mode offline partiel (voir annonces visitées)

### Optimisations Mobile
- [ ] Lazy loading images (Intersection Observer)
- [ ] Infinite scroll sur liste produits
- [ ] Swipe gestures (back, delete)
- [ ] Bottom navigation bar mobile

### Performance
- [ ] Code splitting par route
- [ ] Image CDN (Cloudinary ou Imgix)
- [ ] Database indexes optimization
- [ ] Lighthouse score > 90

---

## 📅 Semaine 9-10 - Analytics & Monétisation

### Analytics Dashboard (Admin)
- [ ] Nombre d'annonces par jour/semaine
- [ ] Utilisateurs actifs (DAU/MAU)
- [ ] Catégories populaires
- [ ] Taux de conversion (vue → contact WhatsApp)
- [ ] Géographie des utilisateurs

### Options Premium (Future Revenue)
- [ ] Annonces mises en avant (bannière "Sponsorisé")
- [ ] Boost de visibilité (top de liste 7 jours)
- [ ] Badge "Vendeur Pro"
- [ ] Statistiques avancées pour vendeurs
- [ ] API accès pour entreprises

---

## 🎯 KPIs de Succès (Post-Launch)

| Métrique | Cible J+30 | Cible J+90 |
|----------|-----------|-----------|
| Utilisateurs inscrits | 500 | 5,000 |
| Annonces actives | 200 | 2,000 |
| Taux de réponse vendeur | 60% | 80% |
| Temps moyen avant vente | 14 jours | 7 jours |
| NPS (Net Promoter Score) | 30 | 50 |
| Revenu mensuel | $0 | $2,000 |

---

## 🛠️ Stack Technique Détaillée

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **State**: Context API + localStorage
- **Styling**: Inline styles + CSS variables (Loyancé Design System)
- **Icons**: Lucide React
- **Maps**: Leaflet + OpenStreetMap
- **Build**: Vite

### Backend (Supabase)
- **Database**: PostgreSQL
- **Auth**: Phone-based (WhatsApp)
- **Storage**: Supabase Storage (product-images, id-documents)
- **Realtime**: Supabase Realtime (messages, notifications)
- **Edge Functions**: Pour webhooks WhatsApp (futur)

### Infrastructure
- **Hosting**: Vercel (Frontend)
- **Database**: Supabase (Backend-as-a-Service)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics + Custom

---

## 📝 Checklist Pré-Production

### Sécurité
- [ ] RLS (Row Level Security) activé sur toutes les tables
- [ ] Rate limiting sur API endpoints
- [ ] Validation input côté serveur
- [ ] HTTPS obligatoire
- [ ] CORS configuré correctement

### Légal
- [ ] CGU/CGV rédigées
- [ ] Politique de confidentialité
- [ ] Conformité RGPD (droit à l'oubli)
- [ ] Mentions légales
- [ ] Gestion cookies (banner)

### Tests
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Tests manuels mobile (iOS/Android)
- [ ] Load testing (1000 utilisateurs simultanés)

### Documentation
- [ ] README complet
- [ ] Guide de déploiement
- [ ] API documentation
- [ ] Guide utilisateur (FAQ)

---

## 🚀 Commandes Utiles

```bash
# Développement local
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Tests
npm run test
```

---

## 📞 Support & Contact

- **Email**: support@djassa.africa (à créer)
- **WhatsApp Business**: +225 XX XX XX XX XX (à configurer)
- **Documentation**: https://djassa.africa/docs

---

*Dernière mise à jour: 2025*
*Version: 1.0.0*
