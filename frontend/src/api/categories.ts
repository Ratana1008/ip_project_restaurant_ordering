import { request } from './http'
import type { Category } from '@/types'

export function listCategories() {
  return request<Category[]>('/categories')
}
