import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Product, Notification } from '../types'

interface DjassaContextType {
  user: User | null
  loading: boolean
  favorites: string[]
  notifications: Notification[]
  loginWithPhone: (phone: string) => Promise<{ error: any }>
  verifyCode: (phone: string, code: string) => Promise<{ error: any }>
  logout: () => Promise<void>
  toggleFavorite: (productId: string) => Promise<void>
  markNotificationRead: (notificationId: string) => Promise<void>
  incrementView: (productId: string) => Promise<void>
}

const DjassaContext = createContext<DjassaContextType | undefined>(undefined)

export function DjassaProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('djassa_user')
    if (session) {
      setUser(JSON.parse(session))
      loadUserFavorites(JSON.parse(session).id)
      loadUserNotifications(JSON.parse(session).id)
    }
    setLoading(false)
  }, [])

  const loadUserFavorites = async (userId: string) => {
    try {
      const stored = localStorage.getItem(`djassa_favorites_${userId}`)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const loadUserNotifications = async (userId: string) => {
    try {
      const stored = localStorage.getItem(`djassa_notifications_${userId}`)
      if (stored) {
        setNotifications(JSON.parse(stored))
      } else {
        // Demo notifications
        const demoNotifications: Notification[] = [
          {
            id: '1',
            user_id: userId,
            type: 'system',
            title: 'Bienvenue sur Djassa !',
            message: 'Commencez à explorer les annonces ou publiez la vôtre.',
            read: false,
            created_at: new Date().toISOString()
          }
        ]
        setNotifications(demoNotifications)
        localStorage.setItem(`djassa_notifications_${userId}`, JSON.stringify(demoNotifications))
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const loginWithPhone = async (phone: string) => {
    try {
      console.log('Sending code to:', phone)
      
      // Simulate sending WhatsApp code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      console.log('📱 WhatsApp Code (demo):', code)
      
      // In production, send via WhatsApp Business API
      // await sendWhatsAppCode(phone, code)
      
      localStorage.setItem('djassa_pending_phone', phone)
      localStorage.setItem('djassa_temp_code', code) // Demo only
      
      return { error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { error }
    }
  }

  const verifyCode = async (phone: string, code: string) => {
    try {
      const storedCode = localStorage.getItem('djassa_temp_code')
      
      if (code.length !== 6) {
        return { error: new Error('Le code doit contenir 6 chiffres') }
      }

      // Demo mode: accept any 6-digit code or the stored code
      if (storedCode && code !== storedCode) {
        return { error: new Error('Code invalide') }
      }

      let userData: User | null = null
      
      // Try to fetch from Supabase
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone)
          .single()

        if (error && error.code !== 'PGRST116') throw error
        userData = data
      } catch (e) {
        console.log('Supabase not configured, using local storage')
      }

      // Create user if not exists
      if (!userData) {
        userData = {
          id: crypto.randomUUID(),
          phone,
          role: 'buyer',
          name: '',
          location: '',
          verified: true,
          rating: 0,
          totalReviews: 0,
          created_at: new Date().toISOString()
        }
        
        // Save to Supabase if available
        try {
          await supabase.from('users').insert([userData]).select().single()
        } catch (e) {
          console.log('Could not save to Supabase')
        }
      }

      localStorage.setItem('djassa_user', JSON.stringify(userData))
      setUser(userData)
      localStorage.removeItem('djassa_pending_phone')
      localStorage.removeItem('djassa_temp_code')
      
      return { error: null }
    } catch (error) {
      console.error('Verify error:', error)
      return { error }
    }
  }

  const logout = async () => {
    if (user) {
      localStorage.removeItem(`djassa_favorites_${user.id}`)
      localStorage.removeItem(`djassa_notifications_${user.id}`)
    }
    localStorage.removeItem('djassa_user')
    setUser(null)
    setFavorites([])
    setNotifications([])
  }

  const toggleFavorite = async (productId: string) => {
    if (!user) return
    
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId]
    
    setFavorites(newFavorites)
    localStorage.setItem(`djassa_favorites_${user.id}`, JSON.stringify(newFavorites))
    
    // Update product favorite count
    try {
      const { data, error } = await supabase
        .from('products')
        .select('favoritesCount')
        .eq('id', productId)
        .single()
      
      if (!error && data) {
        const newCount = favorites.includes(productId) 
          ? Math.max(0, data.favoritesCount - 1) 
          : data.favoritesCount + 1
        
        await supabase
          .from('products')
          .update({ favoritesCount: newCount })
          .eq('id', productId)
      }
    } catch (e) {
      console.log('Could not update favorites count')
    }
  }

  const markNotificationRead = async (notificationId: string) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    setNotifications(updated)
    if (user) {
      localStorage.setItem(`djassa_notifications_${user.id}`, JSON.stringify(updated))
    }
  }

  const incrementView = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('views')
        .eq('id', productId)
        .single()
      
      if (!error && data) {
        await supabase
          .from('products')
          .update({ views: data.views + 1 })
          .eq('id', productId)
      }
    } catch (e) {
      console.log('Could not increment view count')
    }
  }

  return (
    <DjassaContext.Provider value={{ 
      user, 
      loading, 
      favorites,
      notifications,
      loginWithPhone, 
      verifyCode, 
      logout,
      toggleFavorite,
      markNotificationRead,
      incrementView
    }}>
      {children}
    </DjassaContext.Provider>
  )
}

export function useDjassa() {
  const context = useContext(DjassaContext)
  if (context === undefined) {
    throw new Error('useDjassa must be used within a DjassaProvider')
  }
  return context
}

// Helper to format WhatsApp message
export const formatWhatsAppMessage = (product: Product) => {
  const message = `Bonjour, je suis intéressé par votre annonce "${product.title}" sur Djassa. Prix: ${product.price.toLocaleString()} ${product.currency}. Est-ce toujours disponible ?`
  return encodeURIComponent(message)
}

// Helper to generate WhatsApp link
export const getWhatsAppLink = (phone: string, message: string) => {
  // Remove leading zeros and add country code if needed
  const cleanPhone = phone.replace(/^0+/, '')
  return `https://wa.me/${cleanPhone}?text=${message}`
}
