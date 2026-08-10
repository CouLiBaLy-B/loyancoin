import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Users, Package, AlertCircle, Settings, LogOut } from 'lucide-react'

export function AdminDashboard() {
  const { user, logout } = useAuth()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />
  }

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>
          Espace Gestionnaire
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" className="sidebar-link active">
            <AlertCircle size={18} style={{ marginRight: '12px' }} />
            Tableau de Bord
          </a>
          <a href="#" className="sidebar-link">
            <Users size={18} style={{ marginRight: '12px' }} />
            Utilisateurs
          </a>
          <a href="#" className="sidebar-link">
            <Package size={18} style={{ marginRight: '12px' }} />
            Annonces
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
            Tableau de Bord
          </h1>
          <p style={{ color: 'var(--ink-soft)' }}>Gérez la plateforme et les utilisateurs</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', margin: '40px 0' }}>
          <div className="card">
            <p className="eyebrow">Utilisateurs</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>1,234</p>
          </div>
          <div className="card">
            <p className="eyebrow">Annonces Actives</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>5,678</p>
          </div>
          <div className="card">
            <p className="eyebrow">Vendeurs</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>890</p>
          </div>
          <div className="card">
            <p className="eyebrow">Signalements</p>
            <p style={{ fontSize: '36px', fontFamily: 'var(--font-display)', marginTop: '8px' }}>12</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '24px' }}>
            Activité Récente
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: i < 5 ? '1px solid var(--line)' : 'none'
              }}>
                <div>
                  <p style={{ fontWeight: '700' }}>Nouvelle inscription vendeur</p>
                  <p style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Il y a {i * 2} heures</p>
                </div>
                <span className="badge badge--pending">À vérifier</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
