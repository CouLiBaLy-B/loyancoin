import { useState, useEffect } from 'react'
import type { Product } from '../types'
import { Search, Filter, MapPin, Grid, List } from 'lucide-react'

const CATEGORIES = [
  'Téléphones', 'Véhicules', 'Immobilier', 'Emploi', 'Maison', 
  'Mode', 'Sports', 'Services', 'Électronique', 'Animaux'
]

const CONDITIONS = [
  { value: 'new', label: 'Neuf' },
  { value: 'used-excellent', label: 'Très bon état' },
  { value: 'used-good', label: 'Bon état' },
  { value: 'used-fair', label: 'État correct' }
]

const LOCATIONS = [
  'Abidjan', 'Dakar', 'Cotonou', 'Lomé', 'Accra', 'Bamako', 'Conakry'
]

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [negotiableOnly, setNegotiableOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load products with filters
    loadProducts()
  }, [searchQuery, selectedCategory, selectedLocation, priceMin, priceMax, selectedCondition, negotiableOnly, sortBy])

  const loadProducts = async () => {
    setLoading(true)
    // Demo data - in production, fetch from Supabase with filters
    setTimeout(() => {
      const demoProducts: Product[] = [
        {
          id: '1',
          title: 'iPhone 14 Pro Max 256GB',
          description: 'Excellent état, acheté en France',
          price: 850000,
          currency: 'FCFA',
          location: 'Abidjan, Cocody',
          category: 'Téléphones',
          images: [],
          seller_id: '1',
          seller_phone: '2250707070707',
          seller_name: 'Kouamé',
          status: 'active',
          condition: 'used-excellent',
          negotiable: true,
          views: 234,
          favoritesCount: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Toyota Corolla 2020 Automatique',
          description: 'Première main, carnet d\'entretien suivi',
          price: 12000000,
          currency: 'FCFA',
          location: 'Dakar, Plateau',
          category: 'Véhicules',
          images: [],
          seller_id: '2',
          seller_phone: '221770707070',
          seller_name: 'Diop',
          status: 'active',
          condition: 'used-good',
          negotiable: false,
          views: 567,
          favoritesCount: 34,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setProducts(demoProducts)
      setLoading(false)
    }, 500)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLocation('')
    setPriceMin('')
    setPriceMax('')
    setSelectedCondition('')
    setNegotiableOnly(false)
    setSortBy('newest')
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedLocation || priceMin || priceMax || selectedCondition || negotiableOnly

  return (
    <div className="container-wide" style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px' }}>
          Recherche Avancée
        </h1>
        <p style={{ color: 'var(--ink-soft)' }}>Trouvez exactement ce que vous cherchez</p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
          <input
            type="text"
            placeholder="Que recherchez-vous ?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              fontSize: '16px',
              background: 'var(--white)'
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="button button--dark"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Filter size={16} />
          Filtres
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{ padding: '24px', background: 'var(--white)', border: '1px solid var(--line)', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            
            {/* Category */}
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'var(--white)'
                }}
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Localisation
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'var(--white)'
                }}
              >
                <option value="">Toutes les villes</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Prix min
                </label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: 'var(--white)'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Prix max
                </label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Illimité"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: 'var(--white)'
                  }}
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label style={{ display: 'block', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                État
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'var(--white)'
                }}
              >
                <option value="">Tous les états</option>
                {CONDITIONS.map(cond => (
                  <option key={cond.value} value={cond.value}>{cond.label}</option>
                ))}
              </select>
            </div>

            {/* Negotiable */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={negotiableOnly}
                  onChange={(e) => setNegotiableOnly(e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Prix négociable uniquement</span>
              </label>
            </div>
          </div>

          {/* Filter Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--clay)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
                Effacer tous les filtres
              </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
              <label style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>Trier par:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  background: 'var(--white)'
                }}
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="popular">Plus populaires</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <p style={{ color: 'var(--ink-soft)' }}>
          {loading ? 'Chargement...' : `${products.length} résultat${products.length > 1 ? 's' : ''}`}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px',
              background: viewMode === 'grid' ? 'var(--moss)' : 'var(--white)',
              color: viewMode === 'grid' ? 'var(--white)' : 'var(--ink)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px',
              background: viewMode === 'list' ? 'var(--moss)' : 'var(--white)',
              color: viewMode === 'list' ? 'var(--white)' : 'var(--ink)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>Chargement des résultats...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '18px', color: 'var(--ink-soft)', marginBottom: '16px' }}>Aucun résultat trouvé</p>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '24px' }}>Essayez de modifier vos filtres de recherche</p>
          <button onClick={clearFilters} className="button button--dark">
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div style={{ display: viewMode === 'grid' ? 'grid' : 'flex', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '', gap: '24px', flexDirection: viewMode === 'list' ? 'column' as const : undefined }}>
          {products.map(product => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: viewMode === 'list' ? 'flex' : 'block',
                gap: '24px',
                padding: viewMode === 'list' ? '24px' : '0',
                background: viewMode === 'list' ? 'var(--white)' : 'transparent',
                border: viewMode === 'list' ? '1px solid var(--line)' : 'none',
                borderRadius: '4px'
              }}
            >
              <div style={{ aspectRatio: '4/3', background: 'var(--paper-deep)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, width: viewMode === 'list' ? '200px' : '100%' }}>
                {product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                    Aucune image
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p className="eyebrow" style={{ marginBottom: '8px' }}>{product.category}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>{product.title}</h3>
                <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--moss)', marginBottom: '8px' }}>
                  {product.price.toLocaleString('fr-FR')} {product.currency}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink-soft)' }}>
                  <MapPin size={14} />
                  <span>{product.location}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
