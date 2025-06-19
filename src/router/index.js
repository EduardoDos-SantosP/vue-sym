import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (to) => {
        localStorage.removeItem('token')
        return {path: '/login'}
      },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/movimentacao',
      name: 'movimentacao',
      component: () => import('../views/MovimentacaoView.vue'),
      beforeEnter: (to) => {
        if (to.path !== '/login') {
          const token = localStorage.getItem('token')
          if (!token)
            return {
              path: '/login?next=' + (to.path ?? ''),
              query: {next: to.path}
            }
        }
      }
    },
    {
      path: '/movimentacao/:id/itens',
      name: 'movimentacaoItens',
      component: () => import('../views/MovimentacaoItemView.vue'),
      props: true,
      beforeEnter: (to) => {
        const token = localStorage.getItem('token');
        if (!token) {
          return {path: '/login', query: {next: to.fullPath}};
        }
      }
    }
  ],
})

export default router
