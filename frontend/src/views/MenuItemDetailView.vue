<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { LoadStatus, MenuItem } from '@/types'
import { ApiError } from '@/api/http'
import { getMenuItem } from '@/api/menuItems'
import { useMenuStore } from '@/stores/menu'
import { errorMessage } from '@/utils/errorMessage'
import { formatPrice } from '@/utils/orderStatus'
import StatePanel from '@/components/StatePanel.vue'

// The route param arrives as a prop (props: true in the router).
const props = defineProps<{ id: string }>()

const menu = useMenuStore()
const item = ref<MenuItem | null>(null)
const status = ref<LoadStatus>('idle')
const error = ref('')

const categoryName = computed(
  () => menu.categories.find((c) => c.id === item.value?.categoryId)?.name ?? '',
)

async function load() {
  status.value = 'loading'
  error.value = ''
  try {
    item.value = await getMenuItem(Number(props.id))
    status.value = 'success'
  } catch (e) {
    error.value =
      e instanceof ApiError && e.status === 404
        ? 'This menu item does not exist.'
        : errorMessage(e)
    status.value = 'error'
  }
}

onMounted(() => {
  load()
  if (menu.status === 'idle') menu.load()
})
watch(() => props.id, load)
</script>

<template>
  <RouterLink to="/menu" class="back">← Back to menu</RouterLink>
  <StatePanel :status="status" :error="error" :is-empty="item === null" empty-text="Nothing here." @retry="load">
    <article v-if="item" class="item-card detail">
      <h1>{{ item.name }}</h1>
      <p class="muted">{{ categoryName }}</p>
      <p>{{ item.description }}</p>
      <span class="price">{{ formatPrice(item.price) }}</span>
      <p v-if="!item.isAvailable" class="notice">Currently unavailable.</p>
    </article>
  </StatePanel>
</template>
