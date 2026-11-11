<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItem, Order } from '@/types'
import StatusBadge from './StatusBadge.vue'
import { canCancel, formatPrice, nextStatus } from '@/utils/orderStatus'

const props = defineProps<{
  order: Order
  menuItems: MenuItem[]
  mode: 'customer' | 'chef'
}>()

const emit = defineEmits<{
  cancel: [orderId: number]
  advance: [orderId: number]
}>()

const next = computed(() => nextStatus(props.order.status))

function itemName(menuItemId: number): string {
  return props.menuItems.find((m) => m.id === menuItemId)?.name ?? 'Removed item'
}
</script>

<template>
  <article class="order-card">
    <header>
      <h3>Order #{{ order.id }}</h3>
      <StatusBadge :status="order.status" />
    </header>
    <ul>
      <li v-for="item in order.orderItems" :key="item.id">
        {{ item.quantity }} × {{ itemName(item.menuItemId) }}
      </li>
    </ul>
    <footer>
      <strong>{{ formatPrice(order.total) }}</strong>
      <button
        v-if="mode === 'customer' && canCancel(order.status)"
        type="button"
        class="danger"
        @click="emit('cancel', order.id)"
      >
        Cancel order
      </button>
      <button
        v-if="mode === 'chef' && next"
        type="button"
        @click="emit('advance', order.id)"
      >
        Mark as {{ next }}
      </button>
    </footer>
  </article>
</template>
