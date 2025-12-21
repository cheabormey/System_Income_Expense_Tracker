<template>
  <div class="min-h-screen flex flex-col items-center p-4 bg-gray-50 overflow-x-hidden">
    <div class="w-full max-w-screen-xl relative px-2 sm:px-4">

      <!-- Profile Header Card -->
      <div @click="nav = true"
        class="flex items-center justify-between my-6 sm:my-8 bg-white/40 backdrop-blur-lg p-4 sm:p-6 rounded-3xl shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 border border-white max-w-2xl mx-auto ring-4 ring-[rgb(var(--primary-rgb))/0.2]">
        <div class="text-left flex-1 min-w-0 pr-4">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[rgb(var(--primary-rgb))] tracking-tight truncate">
            {{ user.name }}
          </h1>
          <p class="text-base sm:text-xl font-medium text-gray-600 mt-1">Branch: **{{ user.branch }}**</p>
        </div>
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-2xl overflow-hidden border-4 border-[rgb(var(--primary-rgb))] flex-shrink-0">
          <img v-if="user.imageURL" :src="user.imageURL" alt="Profile" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full bg-gradient-to-br from-[rgb(var(--primary-rgb)/0.8)] to-[rgb(var(--primary-rgb))] flex items-center justify-center">
            <span class="text-3xl sm:text-4xl font-bold text-white">{{ user.name.charAt(0) }}</span>
          </div>
        </div>
      </div>

      <!-- Settings Bottom Sheet -->
      <transition name="slide-up">
        <div v-if="nav" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click="nav = false">
          <div class="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="h-48 bg-[rgb(var(--primary-rgb))] rounded-t-3xl relative">
              <div class="absolute top-4 left-4 right-4 flex justify-between items-center">
                <button @click="nav = false" class="text-white text-5xl font-light leading-none">&times;</button>
                <h2 class="text-xl font-semibold text-white">Settings</h2>
              </div>

              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-center">
                <div class="w-28 h-28 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white">
                  <img v-if="user.imageURL" :src="user.imageURL" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-gradient-to-br from-[rgb(var(--primary-rgb)/0.8)] to-[rgb(var(--primary-rgb))] flex items-center justify-center text-5xl font-bold text-white">
                    {{ user.name.charAt(0) }}
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-[rgb(var(--primary-rgb))] mt-10">{{ user.name }}</h3>
                <p class="text-lg text-gray-500/80">{{ user.branch }}</p>
              </div>
            </div>

            <div class="pt-24 pb-8 px-4">
              <div class="space-y-3">
                <div v-for="item in menuItems" :key="item.label" @click="handleMenuClick(item.to)"
                  class="flex items-center gap-4 p-4 bg-white hover:bg-[rgb(var(--primary-rgb))/0.1] rounded-xl transition-all duration-200 cursor-pointer border border-gray-100 shadow-sm">
                  <component :is="item.icon" class="w-6 h-6 text-[rgb(var(--primary-rgb))]" />
                  <span class="text-lg font-semibold text-gray-700">{{ item.label }}</span>
                </div>
              </div>

              <!-- Themes Toggle -->
              <div @click="showThemes = !showThemes"
                class="flex items-center justify-between p-4 mt-6 bg-white hover:bg-[rgb(var(--primary-rgb))/0.1] rounded-xl transition-all cursor-pointer border border-gray-100 shadow-sm">
                <div class="flex items-center gap-4">
                  <SwatchIcon class="w-6 h-6 text-[rgb(var(--primary-rgb))]" />
                  <span class="text-lg font-semibold text-gray-700">Themes</span>
                </div>
                <ChevronDownIcon class="w-6 h-6 text-gray-500 transition-transform duration-300" :class="{ 'rotate-180': showThemes }" />
              </div>

              <transition name="fade">
                <div v-if="showThemes" class="mt-4 p-4 bg-gray-100 rounded-xl">
                  <div class="grid grid-cols-5 gap-3">
                    <button @click="setTheme('theme-blue')" class="w-10 h-10 rounded-xl bg-blue-600 ring-4 ring-blue-600/50 hover:scale-105 transition"></button>
                    <button @click="setTheme('theme-purple')" class="w-10 h-10 rounded-xl bg-purple-600 ring-4 ring-purple-600/50 hover:scale-105 transition"></button>
                    <button @click="setTheme('theme-green')" class="w-10 h-10 rounded-xl bg-green-500 ring-4 ring-green-500/50 hover:scale-105 transition"></button>
                    <button @click="setTheme('theme-red')" class="w-10 h-10 rounded-xl bg-red-500 ring-4 ring-red-500/50 hover:scale-105 transition"></button>
                    <button @click="setTheme('theme-orange')" class="w-10 h-10 rounded-xl bg-orange-500 ring-4 ring-orange-500/50 hover:scale-105 transition"></button>
                  </div>
                </div>
              </transition>

              <button @click="handleMenuClick('/logout')"
                class="mt-8 w-full py-4 text-center text-red-600 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition">
                Log Out
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Dashboard Content (Only on root /) -->
      <div v-if="isRootPath" class="w-full">

        <!-- Income & Expense Summary -->
        <div class="mt-8 max-w-2xl mx-auto w-full">
          <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div class="flex justify-around text-center divide-x divide-gray-200">
              <div class="pr-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-500">Income</h3>
                <p class="text-xl sm:text-2xl font-extrabold text-green-500 mt-1">${{ totalIncome }}</p>
              </div>
              <div class="pl-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-500">Expense</h3>
                <p class="text-xl sm:text-2xl font-extrabold text-red-500 mt-1">${{ totalExpense }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="mt-12 px-2 sm:px-4">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 max-w-2xl mx-auto">Quick Actions</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <router-link v-for="item in gridMenus" :key="item.label" :to="item.to" class="text-center group relative">
              <div class="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-[rgb(var(--primary-rgb))] hover:bg-[rgb(var(--primary-rgb))/0.1] transition-all duration-300 transform hover:scale-[1.03]">
                <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))/0.15] text-[rgb(var(--primary-rgb))] group-hover:bg-[rgb(var(--primary-rgb))] group-hover:text-white transition-all duration-300">
                  <component :is="item.icon" class="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p class="font-bold text-sm sm:text-base text-gray-700 group-hover:text-[rgb(var(--primary-rgb))]">
                  {{ item.label }}
                </p>
                <span v-if="item.badge" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                  {{ item.badge }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Child Views (for sub-routes) -->
      <div :class="{ 'mt-8': !isRootPath, 'mt-0': isRootPath }" class="w-full max-w-4xl mx-auto">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  UserCircleIcon,
  SwatchIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  CubeIcon,
  ChartBarSquareIcon,
  BuildingOfficeIcon,     // Suggested for Branch
  ReceiptPercentIcon      // Suggested for Invoice
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const nav = ref(false)
const showThemes = ref(false)

const isRootPath = computed(() => route.path === '/')

const user = ref({
  name: 'Bor Mey',
  branch: 'Phnom Penh Main',
  department: 'IT Solutions',
  imageURL: 'https://randomuser.me/api/portraits/men/32.jpg'
})

// Settings menu
const menuItems = ref([
  { label: 'My Profile', to: '/profile', icon: UserCircleIcon },
])

// Quick Actions - MUST match your router paths exactly!
const gridMenus = ref([
  { label: 'Customers', to: '/customer', icon: UsersIcon, badge: 12 },
  { label: 'Categories', to: '/category', icon: DocumentTextIcon, badge: 5 },
  { label: 'Produce', to: '/produce', icon: CubeIcon, badge: 0 },
  { label: 'Branch', to: '/branch', icon: BuildingOfficeIcon, badge: 0 }, // Note: path is 'barnch' as per your router
  { label: 'Invoice', to: '/invoice', icon: ReceiptPercentIcon, badge: 3 },
  { label: 'Report', to: '/report', icon: ChartBarSquareIcon, badge: 0 },
])

// Dummy financial data
const totalIncome = ref(12500)
const totalExpense = ref(8700)

// Theme handling
onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme') || 'theme-blue'
  document.documentElement.classList.add(savedTheme)
})

const setTheme = (theme) => {
  document.documentElement.classList.remove('theme-blue', 'theme-purple', 'theme-green', 'theme-red', 'theme-orange')
  document.documentElement.classList.add(theme)
  localStorage.setItem('app-theme', theme)
  showThemes.value = false
}

const handleMenuClick = (path) => {
  nav.value = false
  if (path === '/logout') {
    // Handle logout logic here
    console.log('Logging out...')
  } else {
    router.push(path)
  }
}
</script>

<style scoped>
.theme-blue { --primary-rgb: 93, 120, 248; }
.theme-purple { --primary-rgb: 168, 85, 247; }
.theme-green { --primary-rgb: 34, 197, 94; }
.theme-red { --primary-rgb: 239, 68, 68; }
.theme-orange { --primary-rgb: 251, 146, 60; }

:root { --primary-rgb: 93, 120, 248; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>