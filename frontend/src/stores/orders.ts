import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CartLine, LoadStatus, Order } from '@/types'
import { createOrder, listOrders, updateOrderStatus } from '@/api/orders'
import { canCancel, nextStatus } from '@/utils/orderStatus'
import { errorMessage } from '@/utils/errorMessage'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref('')
  // Errors from actions (place, cancel, advance), shown as a notice above the list.
  const actionError = ref('')
  const busy = ref(false)

  async function load(userId?: number) {
    status.value = 'loading'
    error.value = ''
    try {
      orders.value = await listOrders(userId)
      status.value = 'success'
    } catch (e) {
      error.value = errorMessage(e)
      status.value = 'error'
    }
  }

  async function place(userId: number, lines: CartLine[]): Promise<boolean> {
    actionError.value = ''
    busy.value = true
    try {
      const created = await createOrder(userId, lines)
      orders.value.unshift(created)
      return true
    } catch (e) {
      actionError.value = errorMessage(e)
      return false
    } finally {
      busy.value = false
    }
  }

  async function changeStatus(orderId: number, kind: 'cancel' | 'advance') {
    actionError.value = ''
    const order = orders.value.find((o) => o.id === orderId)
    if (!order) return
    const target = kind === 'cancel' ? (canCancel(order.status) ? 'cancelled' : null) : nextStatus(order.status)
    if (!target) return
    try {
      const updated = await updateOrderStatus(orderId, target)
      order.status = updated.status
    } catch (e) {
      actionError.value = errorMessage(e)
    }
  }

  const cancel = (orderId: number) => changeStatus(orderId, 'cancel')
  const advance = (orderId: number) => changeStatus(orderId, 'advance')

  return { orders, status, error, actionError, busy, load, place, cancel, advance }
})
