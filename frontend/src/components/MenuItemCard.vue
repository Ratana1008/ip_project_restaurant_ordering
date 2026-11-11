<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MenuItem } from '@/types'
import { formatPrice } from '@/utils/orderStatus'

defineProps<{ item: MenuItem }>()

const emit = defineEmits<{ add: [item: MenuItem] }>()
</script>

<template>
  <article class="item-card">
    <h3>{{ item.name }}</h3>
    <p class="muted">{{ item.description }}</p>
    <span class="price">{{ formatPrice(item.price) }}</span>
    <div class="actions">
      <button type="button" @click="emit('add', item)">Add to order</button>
      <RouterLink :to="{ name: 'menu-item', params: { id: item.id } }">Details</RouterLink>
    </div>
  </article>
</template>
