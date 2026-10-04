export interface Product {
  id: string
  name: string
  description: string
  category: string
  priceMinor: number
  originalPriceMinor: number
  rating: number
  ratingCount: number
  stock: number
  image: string
  images?: string[]
  createdAt?: Date
}

export interface CartItem {
  productId: string
  quantity: number
  priceMinor?: number
}

export interface Cart {
  items: CartItem[]
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface DeliveryAddress {
  fullName: string
  phoneNumber: string
  addressLine: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  address: DeliveryAddress
  status: 'pending' | 'success' | 'failed'
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email?: string
  isLoggedIn: boolean
}
