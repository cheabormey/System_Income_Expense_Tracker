import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import HomeView from '@/views/HomeView.vue'
import Invoice from '@/views/Invoice.vue'
import Produce from '@/views/Produce.vue'
import BranchView from '@/views/BranchView.vue'
import UserView from '@/views/UserView.vue'
import CategoryView from '@/views/CategoryView.vue'
import CustomerView from '@/views/CustomerView.vue'
import testinvoce from '@/views/testinvoce.vue'
import Login from '@/views/auth/Login.vue'
import AccountView from '@/views/AccountView.vue'
import ChiefExpenseView from '@/views/ChiefExpense.vue'
import CustomerReimburstmentView from '@/views/CustomerReimburstment.vue'
import CustomerReturnMoneyView from '@/views/CustomerReturnMoney.vue'
import LotteryChiefBalanaceView from '@/views/LotteryChiefBalance.vue'
import SuperAdminView from '@/views/SuperAdminView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView },
      { path: 'customer', component: CustomerView },
      { path: 'category', component: CategoryView },
      { path: 'produce', component: Produce },
      { path: 'invoice', component: Invoice },
      { path: 'branch', component: BranchView },
      { path: 'user', component: UserView },
      { path: 'testinvoce', component: testinvoce },
      { path: 'account', component: AccountView },
      { path: 'chief-expense', component: ChiefExpenseView },
      { path: 'customer-reimburstment', component: CustomerReimburstmentView },
      { path: 'customer-return-money', component: CustomerReturnMoneyView },
      { path: 'lottery-chief-balance', component: LotteryChiefBalanaceView },
    ],
  },
  {
    path: "/super-admin", 
    name: "SuperAdmin",
    component: SuperAdminView,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes, 
})

export default router