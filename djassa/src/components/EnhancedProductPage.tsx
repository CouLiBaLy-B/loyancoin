import { useState } from 'react'
import { useDjassa, formatWhatsAppMessage, getWhatsAppLink } from '../contexts/DjassaContext'
import type { Product } from '../types'
import { Heart, Share2, MessageCircle, MapPin, Clock, Eye } from 'lucide-react'

interface EnhancedProductPageProps {
  product: Product
}

export function EnhancedProductPage({ product }: EnhancedProductPageProps) {
  const { favorites, toggleFavorite, incrementView } = useDjassa()
  const [imageIndex, setImageIndex] = useState(0)

  // Increment view on mount
  useState(() => {
    incrementView(product.id)
  })

  const isFavorite = favorites.includes(product.id)
  
  const whatsappMessage = formatWhatsAppMessage(product)
  const whatsappLink = getWhatsAppLink(product.seller_phone, whatsappMessage)

  const conditionLabels = {
    'new': 'Neuf',
    'used-excellent': 'Très bon état',
    'used-good': 'Bon état',
    'used-fair': 'État correct'
  }

  return (
    <div className="container-wide" style={{ padding: '40px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* Image Gallery */}
        <div>
          <div style={{ position: 'relative', background: 'var(--paper-deep)', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '4px' }}>
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[imageIndex]} 
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                <span>Aucune image</span>
              </div>
            )}
            
            {/* Favorite Button */}
            <button 
              onClick={() => toggleFavorite(product.id)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--white)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? 'var(--clay)' : 'none'}
                stroke={isFavorite ? 'var(--clay)' : 'var(--ink)'}
              />
            </button>

            {/* Share Button */}
            <button 
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: product.title,
                      text: `Découvrez cette annonce sur Djassa: ${product.title}`,
                      url: window.location.href
                    })
                  } catch (error) {
                    console.log('Share cancelled')
                  }
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Lien copié dans le presse-papier !')
                }
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '70px',
                background: 'var(--white)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Share2 size={20} stroke="var(--ink)" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  style={{
                    flexShrink: 0,
                    width: '80px',
                    height: '80px',
                    border: idx === imageIndex ? '2px solid var(--clay)' : '1px solid var(--line)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'none',
                    padding: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Product Stats */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', padding: '16px', background: 'var(--white)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink-soft)' }}>
              <Eye size={16} />
              <span>{product.views || 0} vues</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink-soft)' }}>
              <Heart size={16} />
              <span>{product.favoritesCount || 0} favoris</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink-soft)' }}>
              <Clock size={16} />
              <span>Publié le {new Date(product.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>{product.category}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '16px' }}>
            {product.title}
          </h1>

          <div style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)', color: 'var(--moss)', fontWeight: '700', marginBottom: '16px' }}>
            {product.price.toLocaleString('fr-FR')} {product.currency}
            {product.negotiable && (
              <span style={{ fontSize: '14px', color: 'var(--clay)', marginLeft: '12px', fontWeight: '400' }}>
                (Négociable)
              </span>
            )}
          </div>

          {/* Condition Badge */}
          <div style={{ display: 'inline-block', padding: '6px 12px', background: 'var(--paper-deep)', borderRadius: '4px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
            {conditionLabels[product.condition]}
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--ink-soft)' }}>
            <MapPin size={18} />
            <span>{product.location}</span>
          </div>

          {/* WhatsApp Contact Button */}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="button button--whatsapp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: '#25D366',
              color: 'white',
              padding: '16px 32px',
              width: '100%',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            <MessageCircle size={20} />
            Contacter sur WhatsApp
          </a>

          {/* Seller Info */}
          <div style={{ padding: '24px', background: 'var(--white)', border: '1px solid var(--line)', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>Vendeur</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--paper-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: 'var(--clay)' }}>
                {product.seller_name?.charAt(0) || 'V'}
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '16px' }}>{product.seller_name || 'Vendeur'}</p>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>Membre depuis {new Date(product.created_at).getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '16px' }}>Description</h3>
            <p style={{ lineHeight: '1.7', color: 'var(--ink-soft)' }}>{product.description}</p>
          </div>

          {/* Safety Tips */}
          <div style={{ padding: '20px', background: 'var(--paper-deep)', borderRadius: '4px', border: '1px solid var(--line)' }}>
            <h4 style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: 'var(--moss)' }}>
              🔒 Conseils de Sécurité
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.8' }}>
              <li>Rencontrez le vendeur dans un lieu public</li>
              <li>Inspectez l'article avant de payer</li>
              <li>Ne payez jamais à l'avance par mobile money</li>
              <li>Méfiez-vous des prix trop attractifs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Products Section could go here */}
    </div>
  )
}
