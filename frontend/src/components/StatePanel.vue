<script setup lang="ts">
import type { LoadStatus } from '@/types'

defineProps<{
  status: LoadStatus
  error: string
  isEmpty: boolean
  emptyText: string
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <p v-if="status === 'idle' || status === 'loading'" class="state" role="status">Loading…</p>
  <div v-else-if="status === 'error'" class="state error" role="alert">
    <p>{{ error }}</p>
    <button type="button" @click="emit('retry')">Try again</button>
  </div>
  <p v-else-if="isEmpty" class="empty">{{ emptyText }}</p>
  <slot v-else />
</template>
