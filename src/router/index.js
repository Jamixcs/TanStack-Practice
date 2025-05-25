import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/authorList1',
      name: 'page1',
      component: () => import('../views/AuthorList1.vue'),
    },
    {
      path: '/authorList2',
      name: 'page2',
      component: () => import('../views/AuthorList2.vue'),
    },
  ],
})

export default router
