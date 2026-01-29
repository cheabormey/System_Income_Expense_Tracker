<template>
  <div class="space-y-4 p-1">
    <div
      v-for="cust in items"
      :key="cust._id"
      class="bg-white border rounded-2xl shadow-sm overflow-hidden relative"
    >
      <!-- Status bar -->
      <div
        class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl"
        :class="cust.status ? 'bg-[#5B9717]' : 'bg-rose-500'"
      ></div>

      <div class="p-4 pl-6">
        <!-- Header -->
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold text-[#045B1B] text-lg truncate">
              {{ cust.username }}
            </h3>
            <p class="text-sm text-gray-600 truncate">
              {{ cust.phoneNumber || 'No phone' }}
            </p>
          </div>

          <!-- Balance -->
          <div class="text-right ml-4">
            <p class="text-[10px] text-gray-400 uppercase font-bold">Balance</p>
            <p
              class="font-mono font-bold text-lg"
              :class="(cust.balance ?? 0) < 0 ? 'text-red-500' : 'text-green-600'"
            >
              {{ (cust.balance ?? 0).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Address -->
        <div class="mt-3 text-xs text-gray-500 flex items-center gap-1">
          <i class="pi pi-map-marker"></i>
          <p class="truncate">{{ cust.address || 'No address provided' }}</p>
        </div>

        <!-- Permissions Table -->
        <div v-if="cust.percentages?.length" class="mt-3 overflow-x-auto">
          <table class="w-full text-xs border rounded-md">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-2 py-1">Type</th>
                <th class="px-2 py-1">Product</th>
                <th class="px-2 py-1">%</th>
                <th class="px-2 py-1">x</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(perm, i) in cust.percentages"
                :key="i"
                class="border-t"
              >
                <td class="px-2 py-1">{{ perm.productType }}</td>
                <td class="px-2 py-1">{{ getProductName(perm.productId) }}</td>
                <td class="px-2 py-1 font-bold">{{ perm.percentages }}%</td>
                <td class="px-2 py-1 font-mono">x{{ perm.winMultiplier }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Meta info -->
        <div class="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
          <span class="flex items-center gap-1">
            <i class="pi pi-user"></i>
            {{ cust.createdBy ? 'Staff' : 'System' }}
          </span>
          <span class="flex items-center gap-1">
            <i class="pi pi-calendar"></i>
            {{ cust.createdAt ? formatDate(cust.createdAt) : '-' }}
          </span>
        </div>

        <!-- Actions -->
        <div class="mt-4 pt-3 border-t flex justify-end gap-3">
          <button
            @click.stop="$emit('onEdit', cust)"
            class="flex items-center justify-center w-9 h-9 rounded-xl
                   bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>

          <button
            @click.stop="$emit('onDelete', cust)"
            class="flex items-center justify-center w-9 h-9 rounded-xl
                   bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="items.length === 0 && !isLoading"
      class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200"
    >
      <i class="pi pi-users text-4xl text-gray-300"></i>
      <p class="text-gray-500 mt-2">No customers found</p>
    </div>
  </div>
</template>

<script setup>
import formatDate from '@/composable/formatDate'

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  getProductName: {
    type: Function,
    default: () => (id) => '-' // fallback function if not provided
  }
})


defineEmits(['onEdit', 'onDelete'])
</script>
