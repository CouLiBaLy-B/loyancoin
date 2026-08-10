import { useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, MessageCircle, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

// Mock data for demo
const mockProduct = {
  id: '1',
  title: 'iPhone 14 Pro Max 256GB',
  description: `Excellent état, très peu utilisé. 
Acheté il y a 6 mois, toujours sous garantie Apple.
Couleur: Titanium Natural
Capacité: 256GB
Batterie: 98% de capacité

Accessoires inclus:
- Boîte d'origine
- Câble USB-C
- Coque de protection

Prix légèrement négociable.`,
  price: 850000,
  currency: 'FCFA',
  location: 'Abidjan, Cocody',
  category: 'Téléphones',
  images: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'
  ],
  seller_id: '1',
  seller_phone: '2250707070707',
  seller_name: 'Jean K.',
  status: 'active' as const,
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  
  // In production, fetch product from Supabase
  const product = mockProduct

  const whatsappMessage = `Bonjour, je suis intéressé par votre annonce: ${product.title}`
  const whatsappUrl = `https://wa.me/${product.seller_phone}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div>
      <div className="container-wide" style={{ padding: '40px 0' }}>
        <Link to="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--ink-soft)', 
          textDecoration: 'none',
          marginBottom: '24px'
        }}>
          <ArrowLeft size={16} />
          Retour aux annonces
        </Link>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '60px'
        }}>
          {/* Images */}
          <div>
            <div style={{ 
              aspectRatio: '1/1', 
              background: 'var(--paper-deep)', 
              overflow: 'hidden',
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <img 
                src={product.images[0]}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {product.images.map((image, index) => (
                <div key={index} style={{ 
                  aspectRatio: '1/1', 
                  background: 'var(--paper-deep)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  <img 
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="eyebrow" style={{ marginBottom: '12px' }}>{product.category}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', marginBottom: '16px' }}>
              {product.title}
            </h1>
            
            <p style={{ fontSize: '32px', fontFamily: 'var(--font-display)', color: 'var(--clay)', marginBottom: '24px' }}>
              {product.price.toLocaleString()} {product.currency}
            </p>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-soft)' }}>
                <MapPin size={18} />
                {product.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink-soft)' }}>
                <Calendar size={18} />
                Publié il y a 7 jours
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '12px',
                padding: '18px 32px',
                fontSize: '16px',
                marginBottom: '32px'
              }}
            >
              <MessageCircle size={20} />
              Contacter le vendeur sur WhatsApp
            </a>

            {/* Seller Info */}
            <div className="card" style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>
                Informations du Vendeur
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'var(--clay)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--white)',
                  fontWeight: '700',
                  fontSize: '18px'
                }}>
                  {product.seller_name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: '700' }}>{product.seller_name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Vendeur vérifié</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>
                Description
              </h3>
              <div style={{ 
                lineHeight: '1.8', 
                color: 'var(--ink-soft)',
                whiteSpace: 'pre-line'
              }}>
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <section style={{ borderTop: '1px solid var(--line)', background: 'var(--white)', padding: '60px 0' }}>
        <div className="container-wide">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px' }}>
            Conseils de Sécurité
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'var(--paper-deep)', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '12px' }}>
                📍 Rencontre en lieu public
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                Privilégiez les lieux publics et fréquentés pour vos rencontres.
              </p>
            </div>
            <div style={{ padding: '24px', background: 'var(--paper-deep)', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '12px' }}>
                💰 Paiement en main propre
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                Ne payez jamais à l'avance. Vérifiez le produit avant paiement.
              </p>
            </div>
            <div style={{ padding: '24px', background: 'var(--paper-deep)', borderRadius: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '12px' }}>
                🔍 Vérifiez le produit
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                Inspectez soigneusement l'article avant de finaliser l'achat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
