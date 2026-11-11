export type Role = 'customer' | 'chef' | 'admin'

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

// Used by every page that loads data: idle -> loading -> success or error.
export type LoadStatus = 'idle' | 'loading' | 'error' | 'success'

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Category {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  categoryId: number
  // Owned by the admin (see docs/proposal.md). Only available items are shown to customers.
  isAvailable: boolean
}

export interface OrderItem {
  id: number
  orderId: number
  menuItemId: number
  quantity: number
  // Price at the time of ordering, so old orders keep their original total.
  unitPrice: number
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  total: number
  createdAt: string
  // Filled by json-server with ?_embed=orderItems.
  orderItems: OrderItem[]
}

// Front-end only: a line in the cart before the order is placed.
export interface CartLine {
  menuItem: MenuItem
  quantity: number
}
