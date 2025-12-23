import { createRouter, createWebHistory } from 'vue-router'
// import MainLayout from '@/layouts/MainLayout.vue'  
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layout/MainLayout.vue'

import Invoice from '@/views/Invoice.vue'
import Produce from '@/views/Produce.vue'
import BranchView from '@/views/BranchView.vue'
import UserView from '@/views/UserView.vue'
import CategoryView from '@/views/CategoryView.vue'
import CustomerView from '@/views/CustomerView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component:
          HomeView
      },
      {
        path: 'customer',
        component: CustomerView
      },
      {
        path: 'category',
        component: CategoryView
      },
      {
        path: 'produce',
        component: Produce
      },
      // {
      //   path: 'barnch',
      //   component: Barnch
      // },
      {
        path: 'invoice',
        component: Invoice
      },
            {
        path: 'branch',
        component: BranchView
      },
                  {
        path: 'user',
        component: UserView
      },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
