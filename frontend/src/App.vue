<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'menu' })
}
</script>

<template>
  <header class="topbar">
    <span class="brand">Table Ticket</span>
    <nav aria-label="Main">
      <RouterLink to="/menu">Menu</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/my-orders">My orders</RouterLink>
      <RouterLink v-if="auth.role === 'chef' || auth.role === 'admin'" to="/chef">
        Chef queue
      </RouterLink>
      <RouterLink v-if="!auth.isLoggedIn" to="/login">Log in</RouterLink>
      <template v-else>
        <span class="who">{{ auth.user?.name }} ({{ auth.role }})</span>
        <button type="button" class="secondary light" @click="logout">Log out</button>
      </template>
    </nav>
  </header>
  <main class="page">
    <RouterView />
  </main>
</template>
