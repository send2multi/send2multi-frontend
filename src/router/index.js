import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Same from '../views/Same.vue'
import Diff from '../views/Diff.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/same',
    name: 'Same',
    component: Same
  },
  {
    path: '/diff',
    name: 'Diff',
    component: Diff
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
