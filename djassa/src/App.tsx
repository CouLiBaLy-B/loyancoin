import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { DjassaProvider } from './contexts/DjassaContext'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SellerDashboard } from './pages/SellerDashboard'
import { BuyerDashboard } from './pages/BuyerDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { EnhancedProductPage } from './components/EnhancedProductPage'
import { AdvancedSearch } from './pages/AdvancedSearch'
import type { Product } from './types'
import { useState, useEffect } from 'react'

function App() {
  return (
    <DjassaProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id" element={<ProductWrapper />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/dashboard/buyer" element={<BuyerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/categories" element={
              <div className="container-wide" style={{ padding: '80px 0' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px' }}>Catégories</h1>
                <p style={{ color: 'var(--ink-soft)', marginTop: '16px' }}>Parcourez toutes les catégories</p>
              </div>
            } />
          </Routes>
          
          {/* Footer */}
          <footer style={{ borderTop: '1px solid var(--line)', background: 'var(--white)', padding: '48px 0', marginTop: '80px' }}>
            <div className="container-wide">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '16px' }}>
                    Djassa.
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
                    La plateforme de petites annonces pour l'Afrique de l'Ouest.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Liens Utiles
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--ink-soft)' }}>
                    <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>À propos</a></li>
                    <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Sécurité</a></li>
                    <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Catégories
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--ink-soft)' }}>
                    <li><a href="/search?category=Téléphones" style={{ color: 'inherit', textDecoration: 'none' }}>Téléphones</a></li>
                    <li><a href="/search?category=Véhicules" style={{ color: 'inherit', textDecoration: 'none' }}>Véhicules</a></li>
                    <li><a href="/search?category=Immobilier" style={{ color: 'inherit', textDecoration: 'none' }}>Immobilier</a></li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Pays
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--ink-soft)' }}>
                    <li>Côte d'Ivoire</li>
                    <li>Sénégal</li>
                    <li>Bénin</li>
                    <li>Togo</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--line)', marginTop: '48px', paddingTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--ink-soft)' }}>
                © {new Date().getFullYear()} Djassa. Tous droits réservés.
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </DjassaProvider>
  )
}

// Wrapper component to fetch product data and pass to EnhancedProductPage
function ProductWrapper() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch from Supabase
    // For demo, return mock data
    setTimeout(() => {
      setProduct({
        id: id || '1',
        title: 'iPhone 14 Pro Max',
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
        views: 120,
        favoritesCount: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      setLoading(false)
    }, 100)
  }, [id])

  if (loading || !product) {
    return <div className="container-wide" style={{ padding: '80px 0', textAlign: 'center' }}>Chargement...</div>
  }

  return <EnhancedProductPage product={product} />
}

export default App
