import { request } from './http'
import type { User } from '@/types'

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await request<User[]>(`/users?email=${encodeURIComponent(email)}`)
  return users[0] ?? null
}
