import { createRouter, createWebHistory } from 'vue-router'
import type { Role } from '@/types'
import { useAuthStore } from '@/stores/auth'
import MenuView from '@/views/MenuView.vue'
import MenuItemDetailView from '@/views/MenuItemDetailView.vue'
import MyOrdersView from '@/views/MyOrdersView.vue'
import ChefQueueView from '@/views/ChefQueueView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: Role[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/menu' },
    { path: '/menu', name: 'menu', component: MenuView },
    { path: '/menu/:id', name: 'menu-item', component: MenuItemDetailView, props: true },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/my-orders', name: 'my-orders', component: MyOrdersView, meta: { requiresAuth: true } },
    {
      path: '/chef',
      name: 'chef',
      component: ChefQueueView,
      meta: { requiresAuth: true, roles: ['chef', 'admin'] },
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

// Guard: logged-out visitors go to the login page; the wrong role goes back to the menu.
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.roles && (!auth.role || !to.meta.roles.includes(auth.role))) {
    return { name: 'menu' }
  }
})

export default router
