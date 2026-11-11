<script setup lang="ts">
import type { OrderStatus } from '@/types'

defineProps<{ status: OrderStatus }>()
</script>

<template>
  <span class="badge" :class="status">{{ status }}</span>
</template>
