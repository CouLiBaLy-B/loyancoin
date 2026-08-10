export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
  id: string
  phone: string
  role: UserRole
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
  images: string[]
  seller_id: string
  seller_phone: string
  status: 'active' | 'sold' | 'pending'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  product_id: string
  buyer_id: string
  seller_id: string
  content: string
  created_at: string
}
