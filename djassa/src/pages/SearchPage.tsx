import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import type { Product } from '../types'
import { Search, MapPin, Tag } from 'lucide-react'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '')
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' })

  const categories = [
    'Téléphones',
    'Véhicules', 
    'Immobilier',
    'Emploi',
    'Maison',
    'Mode',
    'Sports & Loisirs',
    'Services',
    'Électronique',
    'Meubles',
    'Animaux',
    'Autres'
  ]

  const locations = [
    'Abidjan, Cocody',
    'Abidjan, Plateau',
    'Abidjan, Yopougon',
    'Abidjan, Marcory',
    'Dakar, Plateau',
    'Dakar, Almadies',
    'Cotonou',
    'Lomé',
    'Bamako',
    'Ouagadougou',
    'Accra',
    'Lagos'
  ]

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      const q = searchParams.get('q')
      const category = searchParams.get('category')
      const location = searchParams.get('location')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')

      if (q) {
        query = query.ilike('title', `%${q}%`)
      }

      if (category) {
        query = query.eq('category', category)
      }

      if (location) {
        query = query.eq('location', location)
      }

      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice))
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice))
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedLocation) params.set('location', selectedLocation)
    if (priceRange.min) params.set('minPrice', priceRange.min)
    if (priceRange.max) params.set('maxPrice', priceRange.max)
    
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLocation('')
    setPriceRange({ min: '', max: '' })
    setSearchParams(new URLSearchParams())
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)' }}>
      {/* Search Header */}
      <section style={{ background: 'var(--moss)', color: 'var(--white)', padding: '48px 0' }}>
        <div className="container-wide">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>
            Rechercher des annonces
          </h1>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que recherchez-vous ?"
                style={{ width: '100%', padding: '14px 14px 14px 40px', border: 'none', borderRadius: '4px', background: 'var(--white)', fontFamily: 'var(--font-sans)', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="button button--clay">
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', padding: '48px 0' }}>
        {/* Filters Sidebar */}
        <aside>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>
              Filtres
            </h2>
            {(searchParams.size > 0) && (
              <button 
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', color: 'var(--clay)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
              >
                Effacer tout
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Catégorie
            </h3>
            <div style={{ position: 'relative' }}>
              <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  const params = new URLSearchParams(searchParams)
                  if (e.target.value) {
                    params.set('category', e.target.value)
                  } else {
                    params.delete('category')
                  }
                  setSearchParams(params)
                }}
                style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid var(--line)', background: 'var(--white)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Filter */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Localisation
            </h3>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value)
                  const params = new URLSearchParams(searchParams)
                  if (e.target.value) {
                    params.set('location', e.target.value)
                  } else {
                    params.delete('location')
                  }
                  setSearchParams(params)
                }}
                style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid var(--line)', background: 'var(--white)', borderRadius: '4px', cursor: 'pointer' }}
              >
                <option value="">Toutes les villes</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Prix
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange(prev => ({ ...prev, min: e.target.value }))
                  const params = new URLSearchParams(searchParams)
                  if (e.target.value) {
                    params.set('minPrice', e.target.value)
                  } else {
                    params.delete('minPrice')
                  }
                  setSearchParams(params)
                }}
                placeholder="Min"
                style={{ padding: '10px', border: '1px solid var(--line)', background: 'var(--white)', borderRadius: '4px', fontSize: '14px' }}
              />
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange(prev => ({ ...prev, max: e.target.value }))
                  const params = new URLSearchParams(searchParams)
                  if (e.target.value) {
                    params.set('maxPrice', e.target.value)
                  } else {
                    params.delete('maxPrice')
                  }
                  setSearchParams(params)
                }}
                placeholder="Max"
                style={{ padding: '10px', border: '1px solid var(--line)', background: 'var(--white)', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>
              {loading ? 'Recherche...' : `${products.length} annonce${products.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>Chargement...</p>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px' }}>
                Aucune annonce trouvée
              </h3>
              <p style={{ color: 'var(--ink-soft)', marginBottom: '24px' }}>
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <button onClick={clearFilters} className="button button--clay">
                Voir toutes les annonces
              </button>
            </div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px 16px' }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
