import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, MessageCircle } from 'lucide-react'

export function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { loginWithPhone, verifyCode } = useAuth()
  const navigate = useNavigate()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!phone || phone.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide')
      setLoading(false)
      return
    }

    const { error } = await loginWithPhone(phone)
    
    if (error) {
      setError('Erreur lors de l\'envoi du code')
      setLoading(false)
      return
    }

    setStep('code')
    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await verifyCode(phone, code)

    if (error) {
      setError('Code invalide. Veuillez réessayer.')
      setLoading(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="auth-container">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--ink-soft)', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={16} />
        Retour
      </Link>

      <h2 className="auth-title">Connexion avec WhatsApp</h2>
      <p className="auth-subtitle">
        Recevez un code de validation par WhatsApp pour vous connecter
      </p>

      {step === 'phone' ? (
        <form onSubmit={handleSendCode}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 07 07 07 07 07"
              className="input-field"
              disabled={loading}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
          )}

          <button 
            type="submit" 
            className="button button--clay"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            disabled={loading}
          >
            <MessageCircle size={16} />
            {loading ? 'Envoi en cours...' : 'Recevoir le code'}
          </button>

          <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center' }}>
            Un code à 6 chiffres vous sera envoyé sur WhatsApp
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px' }}>
              Code de validation
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="input-field"
              maxLength={6}
              disabled={loading}
              style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
            />
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
          )}

          <button 
            type="submit" 
            className="button button--clay"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Vérification...' : 'Se connecter'}
          </button>

          <button
            type="button"
            onClick={() => setStep('phone')}
            style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', marginTop: '16px', fontSize: '12px' }}
          >
            Changer de numéro
          </button>
        </form>
      )}

      <div style={{ marginTop: '32px', padding: '20px', background: 'var(--paper-deep)', borderRadius: '4px' }}>
        <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: '1.6' }}>
          <strong>Note:</strong> Pour la démo, utilisez n'importe quel code à 6 chiffres. 
          En production, le code sera envoyé via l'API WhatsApp Business.
        </p>
      </div>
    </div>
  )
}
