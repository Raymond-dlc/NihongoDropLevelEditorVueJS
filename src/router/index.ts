import { createRouter, createWebHistory } from 'vue-router'
import WordsView from '../views/WordsView.vue'
import ExportView from '@/views/ExportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'words',
      component: WordsView
    },
    {
      path: '/data-export',
      name: 'data-export',
      component: ExportView
    },
    {
      path: '/chapters/:id',
      name: 'chapter-details',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ChapterView.vue')
    }
  ]
})

export default router
