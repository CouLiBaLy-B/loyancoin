import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Heart, MessageCircle, Clock, Settings, LogOut } from 'lucide-react'

export function BuyerDashboard() {
  const { user, logout } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>
          Espace Acheteur
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" className="sidebar-link active">
            <Clock size={18} style={{ marginRight: '12px' }} />
            Historique
          </a>
          <a href="#" className="sidebar-link">
            <Heart size={18} style={{ marginRight: '12px' }} />
            Favoris
          </a>
          <a href="#" className="sidebar-link">
            <MessageCircle size={18} style={{ marginRight: '12px' }} />
            Messages
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
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px' }}>
            Mon Espace Acheteur
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>Suivez vos recherches et favoris</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', margin: '40px 0' }}>
          <div className="card">
            <p className="eyebrow">Annonces Vues</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>47</p>
          </div>
          <div className="card">
            <p className="eyebrow">Favoris</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>12</p>
          </div>
          <div className="card">
            <p className="eyebrow">Contacts WhatsApp</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>8</p>
          </div>
        </div>

        {/* Recent Views */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '24px' }}>
            Annonces Récentes Consultées
          </h2>
          <p style={{ color: 'var(--ink-soft)', textAlign: 'center', padding: '40px 0' }}>
            Vos annonces consultées apparaîtront ici
          </p>
        </div>

        {/* Saved Searches */}
        <div className="card" style={{ marginTop: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '24px' }}>
            Recherches Enregistrées
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px',
              background: 'var(--paper-deep)',
              borderRadius: '4px'
            }}>
              <div>
                <p style={{ fontWeight: '700' }}>iPhone - Abidjan</p>
                <p style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>5 nouvelles annonces cette semaine</p>
              </div>
              <button className="button button--light" style={{ padding: '8px 16px' }}>
                Voir
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
