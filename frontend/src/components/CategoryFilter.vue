<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{
  categories: Category[]
  selectedId: number | null
}>()

const emit = defineEmits<{ select: [categoryId: number | null] }>()
</script>

<template>
  <div class="chips" role="group" aria-label="Filter by category">
    <button type="button" :aria-pressed="selectedId === null" @click="emit('select', null)">
      All
    </button>
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      :aria-pressed="selectedId === category.id"
      @click="emit('select', category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>
