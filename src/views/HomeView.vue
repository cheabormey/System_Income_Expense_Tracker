<template>
  <div
    class="min-h-screen flex flex-col items-center p-4 bg-gray-50 overflow-x-hidden"
  >
    <div class="w-full max-w-screen-xl relative px-2 sm:px-4">
      <div
        @click="nav = true"
        class="flex items-center justify-between my-6 sm:my-8 bg-white/40 backdrop-blur-lg p-4 sm:p-6 rounded-3xl shadow-xl hover:shadow-2xl cursor-pointer transition-all duration-300 border border-white max-w-2xl mx-auto ring-4 ring-[rgb(var(--primary-rgb))/0.2]"
      >
        <div class="text-left flex-1 min-w-0 pr-4">
          <h1
            class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[rgb(var(--primary-rgb))] tracking-tight truncate"
          >
            {{ user.name }}
          </h1>
          <p class="text-base sm:text-xl font-medium text-gray-600 mt-1">
            {{ t("Branch") }}: {{ user.branch }}
          </p>
        </div>
        <div
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-2xl overflow-hidden border-4 border-[rgb(var(--primary-rgb))] flex-shrink-0"
        >
          <img
            v-if="user.imageURL"
            :src="user.imageURL"
            alt="Profile"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-[rgb(var(--primary-rgb)/0.8)] to-[rgb(var(--primary-rgb))] flex items-center justify-center"
          >
            <span class="text-3xl sm:text-4xl font-bold text-white">{{
              user.name.charAt(0)
            }}</span>
          </div>
        </div>
      </div>

      <transition name="slide-up">
        <div
          v-if="nav"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          @click="nav = false"
        >
          <div
            class="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div
              class="h-48 bg-[rgb(var(--primary-rgb))] rounded-t-3xl relative"
            >
              <div
                class="absolute top-4 left-4 right-4 flex justify-between items-center"
              >
                <button
                  @click="nav = false"
                  class="text-white text-5xl font-light leading-none"
                >
                  &times;
                </button>
                <h2 class="text-xl font-semibold text-white">
                  {{ t("Settings") }}
                </h2>
              </div>
              <div
                class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-center"
              >
                <div
                  class="w-28 h-28 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white"
                >
                  <img
                    v-if="user.imageURL"
                    :src="user.imageURL"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-[rgb(var(--primary-rgb)/0.8)] to-[rgb(var(--primary-rgb))] flex items-center justify-center text-5xl font-bold text-white"
                  >
                    {{ user.name.charAt(0) }}
                  </div>
                </div>
                <h3
                  class="text-2xl font-bold text-[rgb(var(--primary-rgb))] mt-10"
                >
                  {{ user.name }}
                </h3>
                <p class="text-lg text-gray-500/80">{{ user.branch }}</p>
              </div>
            </div>

            <div class="pt-24 pb-8 px-4">
              <div class="space-y-3">
                <div
                  v-for="item in menuItems"
                  :key="item.label"
                  @click="handleMenuClick(item.to)"
                  class="flex items-center gap-4 p-4 bg-white hover:bg-[rgb(var(--primary-rgb))/0.1] rounded-xl transition-all duration-200 cursor-pointer border border-gray-100 shadow-sm"
                >
                  <component
                    :is="item.icon"
                    class="w-6 h-6 text-[rgb(var(--primary-rgb))]"
                  />
                  <span class="text-lg font-semibold text-gray-700">{{
                    item.label
                  }}</span>
                </div>

                <div
                  @click="toggleLanguage"
                  class="flex items-center justify-between p-4 bg-white hover:bg-[rgb(var(--primary-rgb))/0.1] rounded-xl transition-all cursor-pointer border border-gray-100 shadow-sm"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-6 h-6 flex items-center justify-center font-bold text-[rgb(var(--primary-rgb))]"
                    >
                      {{ locale === "kh" ? "EN" : "KH" }}
                    </div>
                    <span class="text-lg font-semibold text-gray-700">
                      {{ locale === "kh" ? "English Language" : "ភាសាខ្មែរ" }}
                    </span>
                  </div>
                  <span class="text-xs font-bold text-gray-400 uppercase">{{
                    locale
                  }}</span>
                </div>
              </div>

              <div
                @click="showThemes = !showThemes"
                class="flex items-center justify-between p-4 mt-3 bg-white hover:bg-[rgb(var(--primary-rgb))/0.1] rounded-xl transition-all cursor-pointer border border-gray-100 shadow-sm"
              >
                <div class="flex items-center gap-4">
                  <SwatchIcon class="w-6 h-6 text-[rgb(var(--primary-rgb))]" />
                  <span class="text-lg font-semibold text-gray-700">{{
                    t("themes")
                  }}</span>
                </div>
                <ChevronDownIcon
                  class="w-6 h-6 text-gray-500 transition-transform duration-300"
                  :class="{ 'rotate-180': showThemes }"
                />
              </div>

              <transition name="fade">
                <div v-if="showThemes" class="mt-4 p-4 bg-gray-100 rounded-xl">
                  <div class="grid grid-cols-5 gap-3">
                    <button
                      v-for="color in [
                        'blue',
                        'purple',
                        'green',
                        'red',
                        'orange',
                      ]"
                      :key="color"
                      @click="setTheme('theme-' + color)"
                      :class="[
                        'w-10 h-10 rounded-xl transition hover:scale-105 ring-4',
                        `bg-${color}-500 ring-${color}-500/50`,
                      ]"
                    ></button>
                  </div>
                </div>
              </transition>

              <button
                @click="handleMenuClick('/logout')"
                class="mt-8 w-full py-4 text-center text-red-600 font-bold bg-red-50 rounded-xl hover:bg-red-100 transition"
              >
                {{ t("Logout") }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="isRootPath" class="w-full">
        <div class="mt-8 max-w-2xl mx-auto w-full">
          <div
            class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
          >
            <div
              class="flex justify-around text-center divide-x divide-gray-200"
            >
              <div class="pr-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-500">
                  {{ t("Income") }}
                </h3>
                <p
                  class="text-xl sm:text-2xl font-extrabold text-green-500 mt-1"
                >
                  {{ formatCurrency(totalIncome) }}
                </p>
              </div>
              <div class="pl-4 flex-1">
                <h3 class="text-lg font-semibold text-gray-500">
                  {{ t("Expense") }}
                </h3>
                <p class="text-xl sm:text-2xl font-extrabold text-red-500 mt-1">
                  {{ formatCurrency(totalExpense) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-12 px-2 sm:px-4">
          <div
            class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            <router-link
              v-for="item in gridMenus"
              :key="item.label"
              :to="item.to"
              class="text-center group relative"
            >
              <div
                class="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-[rgb(var(--primary-rgb))] hover:bg-[rgb(var(--primary-rgb))/0.1] transition-all duration-300 transform hover:scale-[1.03]"
              >
                <div
                  class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-[rgb(var(--primary-rgb))/0.15] text-[rgb(var(--primary-rgb))] group-hover:bg-[rgb(var(--primary-rgb))] group-hover:text-white transition-all duration-300"
                >
                  <component :is="item.icon" class="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p
                  class="font-bold text-sm sm:text-base text-gray-700 group-hover:text-[rgb(var(--primary-rgb))]"
                >
                  {{ item.label }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div
        :class="{ 'mt-8': !isRootPath, 'mt-0': isRootPath }"
        class="w-full max-w-4xl mx-auto"
      >
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import API_CONFIGS from "@/api/config";
import { useBranchStore } from "@/store/branchStore";
import defaultProfile from "@/assets/profile.png";
import { useI18n } from "vue-i18n";
import { getDocument } from "@/composable/getDocument"; // Added to fetch totals
import {
  // UI & Settings
  UserCircleIcon,
  SwatchIcon,
  ChevronDownIcon,

  // Dashboard Grid Icons
  UsersIcon, // Customers
  BuildingOfficeIcon, // Branch
  UserIcon, // User
  ReceiptPercentIcon, // Invoice
  Squares2X2Icon, // Categories
  CubeIcon, // Product
  BanknotesIcon, // Reimbursement (Money handled)
  ArrowUturnLeftIcon, // Return Money (Back arrow)
  WalletIcon, // Chief Balance (Storage of funds)
  CreditCardIcon, // Chief Expense (Payment/Outgoing)
  ChartPieIcon, // Report (Visual data)
} from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();
const branchStore = useBranchStore();
const { t, locale } = useI18n();
const { getDocs } = getDocument(); // Initialize the composable

const nav = ref(false);
const showThemes = ref(false);
const isRootPath = computed(() => route.path === "/");
const user = ref({
  name: "Loading...",
  branch: "...",
  imageURL: defaultProfile,
});

const totalIncome = ref(0);
const totalExpense = ref(0);

const formatCurrency = (val) => {
  if (val === null || val === undefined) return "0 ៛";
  return val.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " ៛";
};

const toggleLanguage = () => {
  locale.value = locale.value === "kh" ? "en" : "kh";
  localStorage.setItem("locale", locale.value);
};

const menuItems = computed(() => [
  { label: t("myProfile"), to: "/profile", icon: UserCircleIcon },
]);

const gridMenus = computed(() => [
  { label: t("Customers"), to: "/customer", icon: UsersIcon },
  { label: t("Branch"), to: "/branch", icon: BuildingOfficeIcon },
  { label: t("User"), to: "/user", icon: UserIcon },
  { label: t("Invoice"), to: "/invoice", icon: ReceiptPercentIcon },
  { label: t("Categories"), to: "/category", icon: Squares2X2Icon },
  { label: t("Product"), to: "/produce", icon: CubeIcon },
  {
    label: t("Reimbursement"),
    to: "/customer-reimburstment",
    icon: BanknotesIcon,
  },
  {
    label: t("Return Money"),
    to: "/customer-return-money",
    icon: ArrowUturnLeftIcon,
  },
  { label: t("Chief Balance"), to: "/lottery-chief-balance", icon: WalletIcon },
  { label: t("Chief Expense"), to: "/chief-expense", icon: CreditCardIcon },
  { label: t("Report"), to: "/report", icon: ChartPieIcon },
]);

const fetchUserData = async () => {
  try {
    const userId = branchStore.userId || localStorage.getItem("userId");
    if (!userId) return router.push("/login");
    const conditions = JSON.stringify([
      { field: "_id", operator: "==", value: userId },
    ]);
    const res = await axios.get(`${API_CONFIGS.BASE_URL}/api/getAllDocs/User`, {
      params: { dynamicConditions: conditions },
    });
    const userData = res.data.data?.[0];
    if (userData) {
      user.value = {
        name: userData.username,
        branch:
          userData.mainRole === "Super Admin"
            ? "System Admin"
            : branchStore.branchName || "Branch",
        imageURL: userData.profilePicture || defaultProfile,
      };
    }
  } catch (e) {
    console.error(e);
  }
};

const fetchDashboardTotals = async () => {
  try {
    const currentBranch = branchStore.branchId || "";

    // 1. Fetch Income from Invoices
    const invoiceRes = await getDocs("Invoice");
    if (invoiceRes?.data) {
      const branchInvoices = invoiceRes.data.filter(
        (item) =>
          (item.branchId || "") === currentBranch && item.isUnchanged === true,
      );

      // Only sum the invoices where Chief won money (totalAmount > 0)
      totalIncome.value = branchInvoices.reduce((sum, item) => {
        const amount = Number(item.totalAmount) || 0;
        return amount > 0 ? sum + amount : sum;
      }, 0);
    }

    // 2. Fetch Expenses from ChiefExpense
    const expenseRes = await getDocs("ChiefExpense");
    if (expenseRes?.data) {
      const branchExpenses = expenseRes.data.filter(
        (item) => (item.branchId || "") === currentBranch,
      );

      // Sum all recorded payouts/expenses
      totalExpense.value = branchExpenses.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0,
      );
    }

    // OPTIONAL: If you also have a totalNetBalance variable, you can fetch it like this:
    /*
    const balanceRes = await getDocs("LotteryChiefBalance");
    if (balanceRes?.data) {
      const activeBalance = balanceRes.data.find(
        (b) => (b.branchId || "") === currentBranch && b.status === true
      );
      totalNetBalance.value = activeBalance ? Number(activeBalance.amount) : 0;
    }
    */
  } catch (error) {
    console.error("Failed to fetch dashboard totals", error);
  }
};

onMounted(() => {
  document.documentElement.classList.add(
    localStorage.getItem("app-theme") || "theme-blue",
  );
  locale.value = localStorage.getItem("locale") || "en";
  fetchUserData();
  fetchDashboardTotals(); // Call to fetch dynamic totals
});

const setTheme = (theme) => {
  document.documentElement.classList.remove(
    "theme-blue",
    "theme-purple",
    "theme-green",
    "theme-red",
    "theme-orange",
  );
  document.documentElement.classList.add(theme);
  localStorage.setItem("app-theme", theme);
  showThemes.value = false;
};

const handleMenuClick = (path) => {
  nav.value = false;
  if (path === "/logout") {
    localStorage.clear();
    branchStore.logoutClear();
    router.push("/login");
  } else router.push(path);
};
</script>

<style scoped>
.theme-blue {
  --primary-rgb: 93, 120, 248;
}
.theme-purple {
  --primary-rgb: 168, 85, 247;
}
.theme-green {
  --primary-rgb: 34, 197, 94;
}
.theme-red {
  --primary-rgb: 239, 68, 68;
}
.theme-orange {
  --primary-rgb: 251, 146, 60;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
