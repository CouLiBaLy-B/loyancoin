import { Link } from 'react-router-dom'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header style={{ borderBottom: '1px solid var(--line)', background: 'var(--white)' }}>
      <div className="container-wide">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
            <h1 className="wordmark" style={{ fontSize: '32px', fontWeight: 'bold' }}>
              Djassa<span style={{ color: 'var(--clay)' }}>.</span>
            </h1>
          </Link>

          <nav className="desktop-nav" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link to="/search" className="underlined-link" style={{ border: 'none' }}>
              Parcourir
            </Link>
            <Link to="/categories" className="underlined-link" style={{ border: 'none' }}>
              Catégories
            </Link>
            
            {user ? (
              <>
                <Link to={`/dashboard/${user.role}`} className="button button--dark">
                  <User size={16} />
                  Espace {user.role === 'admin' ? 'Gestionnaire' : user.role === 'seller' ? 'Vendeur' : 'Acheteur'}
                </Link>
                <button onClick={logout} className="button button--light">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/login" className="button button--clay">
                <User size={16} />
                Connexion
              </Link>
            )}
          </nav>

          <button 
            className="mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav style={{ 
            padding: '24px 0', 
            borderTop: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--ink)' }}>
              Parcourir
            </Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--ink)' }}>
              Catégories
            </Link>
            
            {user ? (
              <>
                <Link to={`/dashboard/${user.role}`} onClick={() => setMobileMenuOpen(false)} className="button button--dark">
                  <User size={16} />
                  Espace {user.role === 'admin' ? 'Gestionnaire' : user.role === 'seller' ? 'Vendeur' : 'Acheteur'}
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="button button--light">
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="button button--clay">
                <User size={16} />
                Connexion
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
