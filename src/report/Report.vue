<template>
  <div
    class="min-h-screen flex flex-col items-center p-4 bg-gray-50 overflow-x-hidden font-noto"
  >
    <div class="w-full max-w-screen-xl relative px-2 sm:px-4">
      <!-- Back Button -->
      <button
        @click="handleNavigateBack"
        class="flex items-center gap-2 px-4 py-2 mb-2 text-gray-700 bg-white shadow-sm hover:bg-green-50 hover:text-[#045B1B] rounded-full transition-all duration-300 w-fit"
      >
        <ChevronLeftIcon class="w-5 h-5" />
        <span class="font-semibold">Back to Main Dashboard</span>
      </button>

      <!-- Header Banner -->

      <!-- Reports Grid (Matched to Home Dashboard Style) -->
      <div class="mt-8 px-2 sm:px-4">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          <router-link
            v-for="report in reportMenus"
            :key="report.label"
            :to="report.to"
            class="text-center group relative"
          >
            <div
              class="bg-white p-4 sm:p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-[#5B9717] hover:bg-[#f0fdf4] transition-all duration-300 transform hover:scale-[1.03]"
            >
              <div
                class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#5B9717]/10 text-[#5B9717] group-hover:bg-[#5B9717] group-hover:text-white transition-all duration-300"
              >
                <component :is="report.icon" class="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <p
                class="font-bold text-sm sm:text-base text-gray-700 group-hover:text-[#045B1B]"
              >
                {{ report.label }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
  ChevronLeftIcon,
  ChartPieIcon,
  DocumentChartBarIcon,
  ArrowPathRoundedSquareIcon,
  WalletIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();

const handleNavigateBack = () => {
  router.push("/");
};

// Simplified report definitions (Name & Icon only)
const reportMenus = computed(() => [
  {
    label: "Customer Debt",
    to: "/debt-report",
    icon: DocumentChartBarIcon,
  },
  {
    label: "Customer Returns",
    to: "/returns-report",
    icon: ArrowPathRoundedSquareIcon,
  },
  // Placeholder for future reports
  /*
  { 
    label: "Financials", 
    to: "/financial-summary", 
    icon: WalletIcon,
  }
  */
]);
</script>

<style scoped>
.group {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
