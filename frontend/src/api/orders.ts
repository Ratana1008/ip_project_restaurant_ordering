import { request } from './http'
import type { CartLine, Order, OrderStatus } from '@/types'

// With userId: that customer's orders. Without: every order (chef and admin).
export function listOrders(userId?: number) {
  const owner = userId === undefined ? '' : `&userId=${userId}`
  return request<Order[]>(`/orders?_embed=orderItems&_sort=createdAt&_order=desc${owner}`)
}

export function getOrder(id: number) {
  return request<Order>(`/orders/${id}?_embed=orderItems`)
}

// json-server keeps orders and orderItems in two arrays, so this makes several requests.
// The real server (weeks 6 and 7) will do this in one POST and calculate the total itself.
export async function createOrder(userId: number, lines: CartLine[]): Promise<Order> {
  const total = lines.reduce((sum, l) => sum + l.menuItem.price * l.quantity, 0)
  const order = await request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      status: 'pending',
      total: Math.round(total * 100) / 100,
      createdAt: new Date().toISOString(),
    }),
  })
  for (const line of lines) {
    await request('/orderItems', {
      method: 'POST',
      body: JSON.stringify({
        orderId: order.id,
        menuItemId: line.menuItem.id,
        quantity: line.quantity,
        unitPrice: line.menuItem.price,
      }),
    })
  }
  return getOrder(order.id)
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return request<Order>(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
}
