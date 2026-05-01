<template>
  <div
    v-if="items && items._id"
    class="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-4 transition-all duration-300 hover:shadow-lg">

    <!-- Top Profile -->
    <div class="flex justify-between items-start gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div
          class="w-12 h-12 rounded-full bg-[#045B1B]/10 flex items-center justify-center text-[#045B1B] font-bold text-lg shrink-0">
          {{ getInitial(items.username) }}
        </div>

        <div class="min-w-0 flex-1">
          <h2 class="font-bold text-primary-dark text-base truncate">
            {{ items.username || '-' }}
          </h2>

          <p class="text-sm text-gray-500 truncate">
            {{ items.phoneNumber || '-' }}
          </p>

          <p class="text-xs text-gray-400 break-words">
            {{ items.address || '-' }}
          </p>
        </div>
      </div>

      <!-- Status -->
      <div>
        <span
          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
          :class="items.status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          <i class="pi text-[10px]" :class="items.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
          {{ items.status ? 'Active' : 'Inactive' }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <div v-if="items.description" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
      {{ items.description }}
    </div>

    <!-- Permissions -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
        Permission Details
      </div>

      <div v-if="(items.percentages || []).filter(r => r).length > 0" class="divide-y">
        <div
          v-for="(row, i) in (items.percentages || []).filter(r => r)"
          :key="i"
          class="grid grid-cols-4 text-[11px] sm:text-xs px-3 py-2 items-center">

          <div class="font-medium truncate">{{ row.productType || '-' }}</div>
          <div class="truncate text-center">{{ getProductName(row.productId) }}</div>
          <div class="font-bold text-center">{{ row.percentages || 0 }}%</div>
          <div class="font-mono text-center">x{{ row.winMultiplier || 0 }}</div>
        </div>
      </div>

      <div v-else class="px-3 py-4 text-center text-xs text-gray-400">
        No permission data
      </div>
    </div>

    <!-- Meta Information: Created By & Created At -->
    <div class=" gap-4 text-xs justify-between flex px-2 ">
      <div>
        <p class="text-gray-400">Created By</p>
        <p class="font-medium text-gray-700">{{ getUserName(items.createdBy) }}</p>
      </div>
      <div>
        <p class="text-gray-400">Created At</p>
        <p class="font-medium text-gray-700">{{ formatDateKhmer(items.createdAt) }}</p>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-end gap-2 pt-2">
      <!-- <button
        @click="$emit('onEdit', items)"
        class="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#045B1B]/10 text-[#045B1B] hover:bg-[#045B1B]/20 transition">
        <i class="pi pi-pencil text-xs"></i>
        <span class="text-xs font-medium">Edit</span>
      </button> -->

      <button
        @click="$emit('onDelete', items)"
        class="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
        <i class="pi pi-trash text-xs"></i>
        <span class="text-xs font-medium">Delete</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerCard',

  props: {
    items: {
      type: Object,
      default: () => ({})
    },
    getProductName: {
      type: Function,
      default: () => '-'
    },
    getUserName: {
      type: Function,
      default: () => 'Unknown User'
    },
    formatDateKhmer: {
      type: Function,
      default: () => '-'
    }
  },

  emits: ['onEdit', 'onDelete'],

  setup() {
    const getInitial = (name) => {
      if (!name) return '?'
      return name.charAt(0).toUpperCase()
    }

    return {
      getInitial
    }
  }
}
</script>