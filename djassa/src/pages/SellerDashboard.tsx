import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { Plus, Package, MessageCircle, DollarSign, Settings, LogOut } from 'lucide-react'
import type { Product } from '../types'
import { AddProductModal } from '../components/AddProductModal'

export function SellerDashboard() {
  const { user, logout } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" />
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (productId: string, newStatus: 'active' | 'sold' | 'pending') => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId)

      if (error) throw error
      
      setProducts(products.map(p => 
        p.id === productId ? { ...p, status: newStatus } : p
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error
      
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>
          Espace Vendeur
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" className="sidebar-link active">
            <Package size={18} style={{ marginRight: '12px' }} />
            Mes Annonces
          </a>
          <a href="#" className="sidebar-link" onClick={() => setShowAddModal(true)}>
            <Plus size={18} style={{ marginRight: '12px' }} />
            Nouvelle Annonce
          </a>
          <a href="#" className="sidebar-link">
            <MessageCircle size={18} style={{ marginRight: '12px' }} />
            Messages
          </a>
          <a href="#" className="sidebar-link">
            <DollarSign size={18} style={{ marginRight: '12px' }} />
            Statistiques
          </a>
          <a href="#" className="sidebar-link">
            <Settings size={18} style={{ marginRight: '12px' }} />
            Paramètres
          </a>
        </nav>

        <button 
          onClick={logout}
          style={{ 
            marginTop: 'auto', 
            background: 'none', 
            border: 'none', 
            color: 'var(--clay-light)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            fontSize: '14px'
          }}
        >
          <LogOut size={18} style={{ marginRight: '12px' }} />
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>
              Mes Annonces
            </h1>
            <p style={{ color: 'var(--ink-soft)' }}>Gérez vos produits et suivez vos ventes</p>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="button button--clay"
          >
            <Plus size={16} />
            Ajouter un produit
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
          <div className="card">
            <p className="eyebrow">Total Annonces</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>{products.length}</p>
          </div>
          <div className="card">
            <p className="eyebrow">Annonces Actives</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>
              {products.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className="card">
            <p className="eyebrow">Vendus</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>
              {products.filter(p => p.status === 'sold').length}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="card" style={{ padding: '0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Produit</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prix</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Statut</th>
                <th style={{ padding: '16px 24px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink-soft)' }}>
                    Chargement...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--ink-soft)' }}>
                    Aucune annonce. Créez votre première annonce !
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={product.images[0] || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100'}
                          alt={product.title}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <p style={{ fontWeight: '700' }}>{product.title}</p>
                          <p style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>{product.location}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {product.price.toLocaleString()} {product.currency}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge badge--${product.status}`}>
                        {product.status === 'active' ? 'Actif' : product.status === 'sold' ? 'Vendu' : 'En attente'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                          value={product.status}
                          onChange={(e) => handleStatusChange(product.id, e.target.value as 'active' | 'sold' | 'pending')}
                          style={{ padding: '8px 12px', border: '1px solid var(--line)', background: 'var(--white)', cursor: 'pointer' }}
                        >
                          <option value="active">Actif</option>
                          <option value="pending">En attente</option>
                          <option value="sold">Vendu</option>
                        </select>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{ padding: '8px 12px', border: '1px solid var(--line)', background: 'var(--white)', cursor: 'pointer', color: '#dc2626' }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  )
}
