<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { useOrdersStore } from '@/stores/orders'
import OrderCard from '@/components/OrderCard.vue'
import StatePanel from '@/components/StatePanel.vue'

const auth = useAuthStore()
const menu = useMenuStore()
const orders = useOrdersStore()

// Story 4: a customer sees only their own orders (the API call filters by userId).
function load() {
  if (auth.user) orders.load(auth.user.id)
  if (menu.status !== 'success') menu.load()
}

onMounted(() => {
  orders.actionError = ''
  load()
})
</script>

<template>
  <h1>My orders</h1>
  <p v-if="orders.actionError" class="notice error" role="alert">{{ orders.actionError }}</p>
  <StatePanel
    :status="orders.status"
    :error="orders.error"
    :is-empty="orders.orders.length === 0"
    empty-text="You have not placed an order yet."
    @retry="load"
  >
    <div class="order-list">
      <OrderCard
        v-for="order in orders.orders"
        :key="order.id"
        :order="order"
        :menu-items="menu.items"
        mode="customer"
        @cancel="orders.cancel"
      />
    </div>
  </StatePanel>
</template>
