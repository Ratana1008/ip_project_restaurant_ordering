import { request } from './http'
import type { MenuItem } from '@/types'

export function listMenuItems() {
  return request<MenuItem[]>('/menuItems')
}

export function getMenuItem(id: number) {
  return request<MenuItem>(`/menuItems/${id}`)
}
