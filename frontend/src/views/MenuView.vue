<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { CartLine, MenuItem } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { useOrdersStore } from '@/stores/orders'
import CategoryFilter from '@/components/CategoryFilter.vue'
import MenuItemCard from '@/components/MenuItemCard.vue'
import CartSummary from '@/components/CartSummary.vue'
import StatePanel from '@/components/StatePanel.vue'

const auth = useAuthStore()
const menu = useMenuStore()
const orders = useOrdersStore()
const router = useRouter()

// State owned here: the selected category and the cart. Menu data lives in the menu store.
const selectedCategoryId = ref<number | null>(null)
const cart = ref<CartLine[]>([])
const confirmation = ref('')

const visibleItems = computed(() =>
  menu.items.filter(
    (item) =>
      item.isAvailable &&
      (selectedCategoryId.value === null || item.categoryId === selectedCategoryId.value),
  ),
)

onMounted(() => {
  orders.actionError = ''
  menu.load()
})

function addToCart(item: MenuItem) {
  confirmation.value = ''
  const line = cart.value.find((l) => l.menuItem.id === item.id)
  if (line) line.quantity += 1
  else cart.value.push({ menuItem: item, quantity: 1 })
}

function removeFromCart(menuItemId: number) {
  cart.value = cart.value.filter((l) => l.menuItem.id !== menuItemId)
}

async function placeOrder() {
  if (!auth.user) {
    router.push({ name: 'login', query: { redirect: '/menu' } })
    return
  }
  const ok = await orders.place(auth.user.id, cart.value)
  if (ok) {
    cart.value = []
    confirmation.value = 'Order placed. Follow it under My orders.'
  }
}
</script>

<template>
  <h1>Menu</h1>
  <p v-if="confirmation" class="notice" role="status">{{ confirmation }}</p>
  <p v-if="orders.actionError" class="notice error" role="alert">{{ orders.actionError }}</p>
  <div class="menu-layout">
    <section>
      <CategoryFilter
        :categories="menu.categories"
        :selected-id="selectedCategoryId"
        @select="selectedCategoryId = $event"
      />
      <StatePanel
        :status="menu.status"
        :error="menu.error"
        :is-empty="visibleItems.length === 0"
        empty-text="No items in this category."
        @retry="menu.load()"
      >
        <div class="item-grid">
          <MenuItemCard v-for="item in visibleItems" :key="item.id" :item="item" @add="addToCart" />
        </div>
      </StatePanel>
    </section>
    <CartSummary :lines="cart" :busy="orders.busy" @remove="removeFromCart" @place="placeOrder" />
  </div>
</template>
