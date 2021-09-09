import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Allowance from '../views/Allowance.vue'
import Same from '../views/Same.vue'
import Holders from '../views/Holders.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/approve',
    component: Allowance
  },
  {
    path: '/holders',
    component: Holders
  },
  {
    path: '/approve/:sep20Address',
    component: Allowance
  },
  {
    path: '/send',
    component: Same
  },
  {
    path: '/send/:sep20Address',
    component: Same
  //},
  //{
  //  path: '/diff',
  //  name: 'Diff',
  //  component: Diff
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
