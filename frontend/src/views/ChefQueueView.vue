<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/menu'
import { useOrdersStore } from '@/stores/orders'
import OrderCard from '@/components/OrderCard.vue'
import StatePanel from '@/components/StatePanel.vue'

const menu = useMenuStore()
const orders = useOrdersStore()

// The chef sees orders that are still active.
const activeOrders = computed(() =>
  orders.orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)),
)

function load() {
  orders.load()
  if (menu.status !== 'success') menu.load()
}

onMounted(() => {
  orders.actionError = ''
  load()
})
</script>

<template>
  <h1>Chef queue</h1>
  <p v-if="orders.actionError" class="notice error" role="alert">{{ orders.actionError }}</p>
  <StatePanel
    :status="orders.status"
    :error="orders.error"
    :is-empty="activeOrders.length === 0"
    empty-text="No orders to cook right now."
    @retry="load"
  >
    <div class="order-list">
      <OrderCard
        v-for="order in activeOrders"
        :key="order.id"
        :order="order"
        :menu-items="menu.items"
        mode="chef"
        @advance="orders.advance"
      />
    </div>
  </StatePanel>
</template>
