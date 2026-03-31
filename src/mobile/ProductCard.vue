<template>
  <div class="space-y-4 p-1">
    <!-- CARD -->
    <div
      v-for="(item, index) in items"
      :key="item._id || index"
      class="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
    >
      <!-- STATUS BAR -->
      <div
        class="absolute left-0 top-0 w-1.5 h-full"
        :class="item.status ? 'bg-green-500' : 'bg-rose-500'"
      ></div>

      <div class="p-4 pl-6">
        <!-- TOP -->
        <div class="flex justify-between items-start gap-3">
          <!-- LEFT -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-green-800 truncate">
              {{ item.name }}
            </h3>

            <!-- MULTIPLIER BADGE -->
            <div class="mt-1">
              <span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                x{{ item.winMultiplier || 0 }}
              </span>
            </div>

            <!-- DESCRIPTION -->
            <p class="text-sm text-gray-500 mt-2 line-clamp-2">
              {{ item.description || 'No description' }}
            </p>

            <!-- DATE -->
            <p class="text-xs text-gray-400 mt-2">
              {{ formatDate(item.createdAt) }}
            </p>
          </div>

          <!-- STATUS BUTTON -->
          <button
            @click.stop="$emit('onStatusChange', item)"
            class="px-3 py-1 rounded-full text-xs font-bold border transition"
            :class="
              item.status
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            "
          >
            {{ item.status ? 'Active' : 'Inactive' }}
          </button>
        </div>

        <!-- ACTIONS -->
        <div class="mt-4 pt-3 border-t flex justify-between items-center">
          <!-- ID -->
          <span class="text-[10px] text-gray-400 font-mono">
            ID: {{ item._id ? item._id.slice(-6) : 'N/A' }}
          </span>

          <!-- BUTTONS -->
          <div class="flex gap-2">
            <!-- EDIT -->
            <button
              @click.stop="$emit('onEdit', item)"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              ✏️
            </button>

            <!-- DELETE -->
            <button
              @click.stop="$emit('onDelete', item)"
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div
      v-if="!isLoading && items.length === 0"
      class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed"
    >
      <p class="text-gray-500 font-medium">No Products Found</p>
    </div>

    <!-- LOADING SKELETON -->
    <div v-if="isLoading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-32 bg-gray-100 animate-pulse rounded-2xl"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import formatDate from "@/composable/formatDate";

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
});

defineEmits(["onEdit", "onDelete", "onStatusChange"]);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>