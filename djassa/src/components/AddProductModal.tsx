import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { X, Upload, MapPin, Tag, DollarSign, MessageSquare } from 'lucide-react'

interface AddProductModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'FCFA',
    location: '',
    category: '',
    images: [] as string[]
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      navigate('/login')
      return
    }

    if (!formData.title || !formData.price || !formData.location || !formData.category) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          location: formData.location,
          category: formData.category,
          images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'],
          seller_id: user.id,
          seller_phone: user.phone,
          status: 'active'
        }])

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Erreur lors de la création de l\'annonce')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // In production, upload to Supabase Storage
      // For demo, use placeholder URLs
      const newImages = Array.from(files).map(() => 
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'
      )
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        background: 'var(--white)', 
        padding: '40px', 
        maxWidth: '700px', 
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px' }}>
            Nouvelle Annonce
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Titre de l'annonce *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: iPhone 14 Pro Max 256GB"
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre produit en détail..."
              className="input-field"
              rows={5}
            />
          </div>

          {/* Price & Currency */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
                Prix *
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="50000"
                  className="input-field"
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
                Devise
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="input-field"
              >
                <option value="FCFA">FCFA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Catégorie *
            </label>
            <div style={{ position: 'relative' }}>
              <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="input-field"
                style={{ paddingLeft: '40px' }}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Localisation *
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
              <select
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="input-field"
                style={{ paddingLeft: '40px' }}
                required
              >
                <option value="">Sélectionner une ville</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Photos
            </label>
            <div style={{ 
              border: '2px dashed var(--line)', 
              padding: '24px', 
              textAlign: 'center',
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                id="image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <Upload size={24} style={{ color: 'var(--clay)' }} />
                <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
                  Cliquez pour ajouter des photos
                </span>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {formData.images.map((img, index) => (
                  <div key={index} style={{ position: 'relative', aspectRatio: '1/1' }}>
                    <img 
                      src={img} 
                      alt={`Photo ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{ 
                        position: 'absolute', 
                        top: '4px', 
                        right: '4px', 
                        background: 'var(--white)', 
                        border: 'none', 
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div style={{ 
            padding: '16px', 
            background: 'var(--paper-deep)', 
            borderRadius: '4px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <MessageSquare size={20} style={{ color: 'var(--clay)', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
              Les acheteurs vous contacteront directement sur WhatsApp au <strong>{user?.phone}</strong>. 
              Assurez-vous que ce numéro est correct et actif sur WhatsApp.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={onClose}
              className="button button--light"
              disabled={loading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="button button--clay"
              disabled={loading}
            >
              {loading ? 'Publication...' : 'Publier l\'annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
