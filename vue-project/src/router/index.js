import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RegistroCliente from '../views/RegistroCliente.vue'
import AdminPanel from '../views/AdminPanel.vue'
import Login from '../views/Login.vue'
import { isAdmin, checkSession } from '../services/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegistroCliente
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  checkSession()
  if (to.meta.requiresAdmin && !isAdmin.value) {
    next('/login')
  } else {
    next()
  }
})

export default router