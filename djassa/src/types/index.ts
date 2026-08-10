export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
  id: string
  phone: string
  role: UserRole
  name?: string
  location?: string
  verified: boolean
  rating: number
  totalReviews: number
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  location: string
  category: string
  subcategory?: string
  images: string[]
  seller_id: string
  seller_phone: string
  seller_name?: string
  status: 'active' | 'sold' | 'pending' | 'reserved'
  condition: 'new' | 'used-excellent' | 'used-good' | 'used-fair'
  negotiable: boolean
  views: number
  favoritesCount: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  content: string
  whatsapp_sent: boolean
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  rating: number
  comment: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface SearchHistory {
  id: string
  user_id: string
  query: string
  category?: string
  location?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'price_drop' | 'new_message' | 'product_liked' | 'verification' | 'system'
  title: string
  message: string
  read: boolean
  link?: string
  created_at: string
}
