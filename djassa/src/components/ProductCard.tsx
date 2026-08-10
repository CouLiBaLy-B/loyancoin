import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { MapPin } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = `Bonjour, je suis intéressé par votre annonce: ${product.title}`
  const whatsappUrl = `https://wa.me/${product.seller_phone}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-card__image-wrapper">
          <img 
            src={product.images[0] || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'}
            alt={product.title}
            className="product-card__image"
          />
        </div>
      </Link>
      
      <p className="product-card__eyebrow eyebrow">{product.category}</p>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 className="product-card__title">{product.title}</h3>
      </Link>
      <p className="product-card__price">
        {product.price.toLocaleString()} {product.currency}
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: 'var(--ink-soft)', fontSize: '12px' }}>
        <MapPin size={14} />
        {product.location}
      </div>
      
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
      >
        Contacter sur WhatsApp
      </a>
    </article>
  )
}
