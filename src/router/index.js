import { createRouter, createWebHistory } from 'vue-router'
// import MainLayout from '@/layouts/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
// import CustomerView from '@/views/CustomerView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import Customer from '@/views/Customer.vue'
import Category from '@/views/Category.vue'
// import Barnch from '@/views/Barnch.vue'
import Invoice from '@/views/Invoice.vue'
import Produce from '@/views/Produce.vue'
import BranchView from '@/views/BranchView.vue'

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
        component: Customer
      },
      {
        path: 'category',
        component: Category
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
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
