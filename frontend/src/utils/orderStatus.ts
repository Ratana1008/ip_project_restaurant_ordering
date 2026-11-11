import type { OrderStatus } from '@/types'

// Story 5: status only moves in this order.
export const STATUS_FLOW: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed']

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(status)
  if (i === -1 || i === STATUS_FLOW.length - 1) return null
  return STATUS_FLOW[i + 1]
}

// Story 7: only a pending order can be cancelled.
export function canCancel(status: OrderStatus): boolean {
  return status === 'pending'
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`
}
