import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Role, User } from '@/types'
import { findUserByEmail } from '@/api/users'

const STORAGE_KEY = 'table-ticket-user'

function readSavedUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(readSavedUser())
  const isLoggedIn = computed(() => user.value !== null)
  const role = computed<Role | null>(() => user.value?.role ?? null)

  // Mock login for json-server: finds the user by email. The real password check
  // (hashed password, token) comes with the backend in weeks 6 and 7.
  async function login(email: string): Promise<void> {
    const found = await findUserByEmail(email.trim().toLowerCase())
    if (!found) throw new Error('Wrong email or password.')
    user.value = { id: found.id, name: found.name, email: found.email, role: found.role }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    } catch {
      // storage can be blocked; the login still works for this session
    }
  }

  function logout() {
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return { user, isLoggedIn, role, login, logout }
})
