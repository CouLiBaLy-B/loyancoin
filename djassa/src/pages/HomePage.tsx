import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import type { Product } from '../types'
import { Search } from 'lucide-react'

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(9)

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([
        {
          id: '1',
          title: 'iPhone 14 Pro Max',
          description: 'Excellent état',
          price: 850000,
          currency: 'FCFA',
          location: 'Abidjan, Cocody',
          category: 'Téléphones',
          images: [],
          seller_id: '1',
          seller_phone: '2250707070707',
          status: 'active',
          condition: 'used-excellent',
          negotiable: true,
          views: 120,
          favoritesCount: 8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Toyota Corolla 2020',
          description: 'Première main',
          price: 12000000,
          currency: 'FCFA',
          location: 'Dakar, Plateau',
          category: 'Véhicules',
          images: [],
          seller_id: '2',
          seller_phone: '221770707070',
          status: 'active',
          condition: 'used-good',
          negotiable: false,
          views: 340,
          favoritesCount: 22,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Appartement T3',
          description: 'Meublé, centre ville',
          price: 500000,
          currency: 'FCFA',
          location: 'Cotonou',
          category: 'Immobilier',
          images: [],
          seller_id: '3',
          seller_phone: '22997070707',
          status: 'active',
          condition: 'used-excellent',
          negotiable: true,
          views: 89,
          favoritesCount: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section style={{ background: 'var(--moss)', color: 'var(--white)' }}>
        <div className="container-wide" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '60px', padding: '80px 0' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--clay-light)', marginBottom: '16px' }}>Marché en Ligne</p>
            <h2 style={{ fontSize: 'clamp(2.6rem, 5vw, 5.4rem)', lineHeight: '1.1', marginBottom: '24px' }}>
              Achetez et vendez<br />
              <em style={{ fontStyle: 'italic', color: 'var(--clay-light)' }}>en toute confiance.</em>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--clay-light)', marginBottom: '32px', maxWidth: '480px' }}>
              La plateforme de petites annonces pour l'Afrique de l'Ouest. Contact direct via WhatsApp, sans paiement en ligne.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#products" className="button button--clay">Voir les annonces</a>
              <a href="/search" className="button button--light"><Search size={16} /> Rechercher</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--paper-deep)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Image Hero</div>
          </div>
        </div>
      </section>

      <div className="marquee-band">
        <div className="marquee-content">
          <span>✳ Achat & Vente Local</span>
          <span>✳ Sans Paiement en Ligne</span>
          <span>✳ Contact Direct WhatsApp</span>
          <span>✳ Sécurisé & Simple</span>
          <span>✳ Achat & Vente Local</span>
          <span>✳ Sans Paiement en Ligne</span>
          <span>✳ Contact Direct WhatsApp</span>
          <span>✳ Sécurisé & Simple</span>
        </div>
      </div>

      <section id="products" className="container-wide" style={{ padding: '80px 0' }}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Dernières Annonces</p>
            <h2>Découvrez des<br /><em>opportunités uniques.</em></h2>
          </div>
          <a href="/search" className="underlined-link">Tout parcourir</a>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>Chargement...</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section style={{ borderTop: '1px solid var(--line)', background: 'var(--white)' }}>
        <div className="container-wide" style={{ padding: '80px 0' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catégories</p>
              <h2>Trouvez par<br /><em>catégorie.</em></h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {['Téléphones', 'Véhicules', 'Immobilier', 'Emploi', 'Maison', 'Mode', 'Sports', 'Services'].map((category) => (
              <a key={category} href={`/search?category=${encodeURIComponent(category)}`} style={{ padding: '32px 24px', border: '1px solid var(--line)', textAlign: 'center', textDecoration: 'none', color: 'var(--ink)', transition: 'all 0.2s ease' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>{category}</h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Voir les annonces →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--line)', background: 'var(--moss)', color: 'var(--white)', padding: '80px 0' }}>
        <div className="container-wide" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)', marginBottom: '16px' }}>Prêt à vendre ?</h2>
          <p style={{ color: 'var(--clay-light)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>Créez votre annonce en quelques minutes et touchez des milliers d'acheteurs potentiels.</p>
          <a href="/login" className="button button--clay">Commencer maintenant</a>
        </div>
      </section>
    </div>
  )
}
