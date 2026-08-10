# 🚀 Djassa - MVP Features & Roadmap

## ✅ Fonctionnalités MVP Implémentées

### 1. Authentification & Utilisateurs
- [x] Connexion via WhatsApp avec code OTP (simulation)
- [x] Trois rôles : Acheteur, Vendeur, Admin
- [x] Profils utilisateurs avec rating et vérification
- [x] Gestion de session locale (localStorage)

### 2. Annonces & Produits
- [x] CRUD complet des annonces (Create, Read, Update, Delete)
- [x] Statuts : active, sold, pending, reserved
- [x] Conditions : new, used-excellent, used-good, used-fair
- [x] Prix négociable ou fixe
- [x] Compteur de vues et favoris
- [x] Galerie d'images multiple
- [x] Catégories et localisations

### 3. Recherche Avancée
- [x] Recherche textuelle
- [x] Filtres par catégorie, prix, condition, localisation
- [x] Tri : récent, ancien, prix, popularité
- [x] Vue grille/liste
- [x] Historique de recherche (prévu)

### 4. Communication WhatsApp
- [x] Bouton "Contacter sur WhatsApp"
- [x] Message pré-rempli avec détails produit
- [x] Liens wa.me optimisés
- [x] Pas de paiement en ligne (conforme marché africain)

### 5. Fonctionnalités Sociales
- [x] Système de favoris
- [x] Partage d'annonces (Web Share API + clipboard)
- [x] Notifications (système, messages, likes)
- [ ] Reviews & ratings (structure prête)

### 6. Dashboards
- [x] Dashboard Vendeur :
  - Mes annonces
  - Statistiques (vues, favoris)
  - Ajouter/modifier/supprimer
- [x] Dashboard Acheteur :
  - Favoris
  - Historique
  - Notifications
- [x] Dashboard Admin :
  - Modération annonces
  - Gestion utilisateurs
  - Statistiques plateforme

### 7. Design & UX
- [x] Design System "Loyancé" premium
- [x] Mobile-first responsive
- [x] Couleurs adaptées au marché africain
- [x] Typographie élégante (Serif display + Sans body)
- [x] Micro-interactions subtiles

### 8. Technique
- [x] React + TypeScript
- [x] Supabase integration (optionnel)
- [x] Mode démo sans backend
- [x] Build Vercel-ready
- [x] CSS variables pour theming

---

## 🎯 Features à Ajouter pour Production

### Phase 1 : Core Business (Semaines 1-2)

#### 1.1 Upload d'Images Réel
```typescript
// À implémenter dans AddProductModal
- Intégration Supabase Storage
- Compression d'images côté client
- Multiple image upload with preview
- Progress indicators
```

#### 1.2 Géolocalisation Précise
```typescript
// Nouvelle page : MapView.tsx
- Integration Google Maps / Mapbox
- Rayon de recherche en km
- Affichage des annonces sur carte
- "Annonces près de moi"
```

#### 1.3 Notifications Push
```typescript
// Service: notifications.ts
- Firebase Cloud Messaging
- Notifications navigateur
- Rappels de panier/favoris
- Alertes prix (baisse de prix sur favoris)
```

### Phase 2 : Confiance & Sécurité (Semaines 3-4)

#### 2.1 Vérification Identité
```typescript
// Pages: Verification.tsx
- Upload pièce d'identité
- Selfie de verification
- Badge "Vendeur Vérifié"
- Niveau de confiance (0-100%)
```

#### 2.2 Système de Reviews
```typescript
// Composant: ReviewModal.tsx
- Notation 1-5 étoiles
- Commentaires avec modération
- Response du vendeur
- Signalement d'avis frauduleux
```

#### 2.3 Signalement & Modération
```typescript
// Dashboard Admin amélioré
- Signaler une annonce (spam, arnaque, interdit)
- File de modération
- Suspension automatique (mots-clés)
- Blacklist utilisateurs
```

### Phase 3 : Engagement (Semaines 5-6)

#### 3.1 Alerts Personnalisées
```typescript
// Page: Alerts.tsx
- Créer une alerte de recherche
- Notification email/SMS/WhatsApp
- Fréquence : instantanée, quotidienne, hebdo
- "Nouveautés dans votre région"
```

#### 3.2 Boost d'Annonces (Premium)
```typescript
// Dashboard Vendeur + Paiement
- Mettre en avant (top listing)
- Urgent badge
- Homepage featured
- Relance automatique (7 jours)
```

#### 3.3 Messagerie Interne
```typescript
// Page: Messages.tsx
- Chat en temps réel (Supabase Realtime)
- Historique des conversations
- Pièces jointes
- Traduction automatique (optionnel)
```

### Phase 4 : Expansion (Semaines 7-8)

#### 4.1 Multi-Pays & Devises
```typescript
// Context: LocaleContext.tsx
- Détection automatique pays
- Conversion FCFA ↔ autres devises
- Langues : FR, EN, PT
- Spécificités par pays
```

#### 4.2 Categories Spécialisées
```typescript
// Templates par catégorie
- Véhicules : KM, année, carburant
- Immobilier : m², pièces, étage
- Emploi : CDI/CDD, salaire, remote
- Services : tarifs, disponibilités
```

#### 4.3 Analytics Vendeur
```typescript
// Dashboard Vendeur → Stats
- Graphiques de vues (Chart.js)
- Taux de conversion (vues → contacts)
- Meilleurs horaires de publication
- Comparaison avec marché
```

---

## 📊 Metrics de Succès (KPIs)

| Metric | Cible MVP | Cible Production |
|--------|-----------|------------------|
| Utilisateurs actifs/jour | 100 | 1,000+ |
| Annonces publiées/jour | 20 | 200+ |
| Taux de conversion (vue→contact) | 5% | 10%+ |
| Temps moyen sur site | 3 min | 8+ min |
| Retention J+7 | 20% | 40%+ |
| Notes moyennes vendeurs | 4.0/5 | 4.5/5 |

---

## 🔧 Stack Technique Recommandée

### Backend (Supabase)
```sql
-- Tables additionnelles à créer
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products(id),
  buyer_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  query TEXT,
  category TEXT,
  location TEXT,
  price_min INT,
  price_max INT,
  frequency TEXT CHECK (frequency IN ('instant', 'daily', 'weekly')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  id_document_url TEXT,
  selfie_url TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Services Externes
| Service | Usage | Coût Estimé |
|---------|-------|-------------|
| WhatsApp Business API | Envoi codes OTP | $0.005/msg |
| Firebase Cloud Messaging | Notifications push | Gratuit (<1M) |
| Cloudinary | Optimisation images | Gratuit (<25GB) |
| Mapbox | Cartes géo | Gratuit (<50k vues) |
| Sentry | Error tracking | Gratuit (<5k erreurs) |

---

## 📱 Mobile : PWA vs Native

### Option 1 : PWA (Recommandé pour MVP)
```json
// manifest.json
{
  "name": "Djassa",
  "short_name": "Djassa",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f5f3ee",
  "theme_color": "#203027",
  "icons": [...]
}
```
**Avantages** : 
- Développement unique (web)
- Pas de stores Apple/Google
- Mises à jour instantanées
- Coût réduit

### Option 2 : React Native (Phase 2)
- Code sharing avec web (~70%)
- Meilleures performances
- Accès natif (camera, GPS)
- Présence app stores

---

## 💰 Modèle Économique

### Gratuit
- Publication illimitée d'annonces
- Recherche et filtres
- Contact WhatsApp
- 5 photos par annonce

### Premium (2,99€/mois ou 1,500 FCFA/mois)
- Annonces boostées (x5 visibilité)
- 20 photos par annonce
- Badge "Vendeur Pro"
- Statistiques détaillées
- Support prioritaire

### Commission (Optionnel)
- Catégories spéciales (Immobilier, Véhicules pro)
- 1-3% sur transactions facilitées
- Optionnel car pas de paiement in-app

---

## 🚀 Checklist Pré-Production

### Technique
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible/Google)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Performance (Lighthouse >90)
- [ ] Security headers
- [ ] HTTPS enforcement
- [ ] Rate limiting API

### Légal
- [ ] CGU/CGV
- [ ] Politique de confidentialité
- [ ] Cookie consent
- [ ] Mentions légales
- [ ] Conformité RGPD/local

### Business
- [ ] Support client (email/WhatsApp)
- [ ] FAQ complète
- [ ] Tutoriels vidéo
- [ ] Programme ambassadeurs
- [ ] Partenariats locaux

---

## 📅 Timeline Suggérée

| Semaine | Objectif | Livrables |
|---------|----------|-----------|
| 1-2 | Images + Géoloc | Upload fonctionnel, carte interactive |
| 3-4 | Confiance | Vérification ID, reviews, modération |
| 5-6 | Engagement | Alerts, messagerie, boosts |
| 7-8 | Expansion | Multi-pays, analytics, templates |
| 9 | Tests & QA | Bug fixes, performance |
| 10 | Launch | Marketing, support, monitoring |

---

## 🎉 Prêt pour le Launch !

Le MVP est **fonctionnel** et peut être déployé immédiatement pour :
- Tester le marché
- Recueillir les premiers feedbacks
- Valider le product-market fit
- Commencer l'acquisition utilisateurs

**Prochaine étape** : Déploiement sur Vercel + configuration Supabase production.
