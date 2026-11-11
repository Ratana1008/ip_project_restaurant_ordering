import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category, LoadStatus, MenuItem } from '@/types'
import { listMenuItems } from '@/api/menuItems'
import { listCategories } from '@/api/categories'
import { errorMessage } from '@/utils/errorMessage'

export const useMenuStore = defineStore('menu', () => {
  const items = ref<MenuItem[]>([])
  const categories = ref<Category[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref('')

  async function load() {
    status.value = 'loading'
    error.value = ''
    try {
      const [menuItems, cats] = await Promise.all([listMenuItems(), listCategories()])
      items.value = menuItems
      categories.value = cats
      status.value = 'success'
    } catch (e) {
      error.value = errorMessage(e)
      status.value = 'error'
    }
  }

  return { items, categories, status, error, load }
})
