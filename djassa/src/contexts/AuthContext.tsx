import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithPhone: (phone: string) => Promise<{ error: any }>
  verifyCode: (phone: string, code: string) => Promise<{ error: any }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('djassa_user')
    if (session) {
      setUser(JSON.parse(session))
    }
    setLoading(false)
  }, [])

  const loginWithPhone = async (phone: string) => {
    try {
      console.log('Sending code to:', phone)
      
      const { error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        const { error: createError } = await supabase
          .from('users')
          .insert([{ phone, role: 'buyer' }])
          .select()
          .single()

        if (createError) throw createError
      }

      localStorage.setItem('djassa_pending_phone', phone)
      return { error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { error }
    }
  }

  const verifyCode = async (phone: string, code: string) => {
    try {
      if (code.length !== 6) {
        return { error: new Error('Code must be 6 digits') }
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (error) {
        return { error }
      }

      const userData: User = data
      localStorage.setItem('djassa_user', JSON.stringify(userData))
      setUser(userData)
      localStorage.removeItem('djassa_pending_phone')
      
      return { error: null }
    } catch (error) {
      console.error('Verify error:', error)
      return { error }
    }
  }

  const logout = async () => {
    localStorage.removeItem('djassa_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithPhone, verifyCode, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
