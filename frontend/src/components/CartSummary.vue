<script setup lang="ts">
import { computed } from 'vue'
import type { CartLine } from '@/types'
import { formatPrice } from '@/utils/orderStatus'

const props = defineProps<{ lines: CartLine[]; busy?: boolean }>()

const emit = defineEmits<{
  remove: [menuItemId: number]
  place: []
}>()

// Display only. The server recalculates the real total from current prices (story 3).
const total = computed(() =>
  props.lines.reduce((sum, line) => sum + line.menuItem.price * line.quantity, 0),
)
</script>

<template>
  <aside class="cart" aria-label="Your order">
    <h2>Your order</h2>
    <p v-if="lines.length === 0" class="muted">Add an item from the menu to start.</p>
    <ul v-else>
      <li v-for="line in lines" :key="line.menuItem.id">
        <span>{{ line.quantity }} × {{ line.menuItem.name }}</span>
        <button type="button" class="secondary" @click="emit('remove', line.menuItem.id)">
          Remove
        </button>
      </li>
    </ul>
    <div class="total">
      <span>Total</span>
      <span>{{ formatPrice(total) }}</span>
    </div>
    <button type="button" :disabled="lines.length === 0 || busy" @click="emit('place')">
      {{ busy ? 'Placing…' : 'Place order' }}
    </button>
  </aside>
</template>
