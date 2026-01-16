// Composables
import { createRouter, createWebHistory } from 'vue-router'

// Components (Manual Import)
import Index from '@/pages/index.vue'
import Historial from '@/pages/historial.vue'
import NuevaApuesta from '@/pages/nueva-apuesta.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/historial', component: Historial },
  { path: '/nueva-apuesta', component: NuevaApuesta },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router;

