<template>
  <div v-if="items && items._id"
    class="relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg border border-gray-100/90 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(4,91,27,0.07)] hover:-translate-y-0.5 group">
    
    <!-- Top Brand Gradient Indicator Line -->
    <div 
      class="absolute top-0 left-0 right-0 h-[4px]"
      :class="items.status ? 'bg-gradient-to-r from-[#045B1B] via-[#5B9717] to-[#82b215]' : 'bg-gradient-to-r from-rose-500 to-orange-400'">
    </div>
    

    <!-- Top Profile Header Section -->
    <div class="flex justify-between items-start gap-4">
      <div class="flex items-center gap-3.5 min-w-0">
        <!-- Brand Colored Custom Avatar with Layered Depth -->
        <!-- <div
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#045B1B]/5 to-[#82b215]/5 flex items-center justify-center text-[#045B1B] font-bold text-base shrink-0 border border-[#5B9717]/10 shadow-[inset_0_2px_4px_rgba(4,91,27,0.03)] ring-2 ring-offset-2 transition-all duration-300 group-hover:ring-[#5B9717]/20"
          :class="items.status ? 'ring-[#045B1B]/5' : 'ring-rose-500/5'">
          {{ getInitial(items.username) }}
        </div> -->
        <div
  class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold text-base shrink-0 border border-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] ring-2 ring-offset-2 transition-all duration-300 group-hover:ring-gray-400/30"
  :class="items.status ? 'ring-gray-300' : 'ring-gray-200'"
>
  {{ getInitial(items.username) }}
</div>

        <div class="min-w-0 space-y-1">
          <!-- Main Heading swapping to main brand identity on card focus/hover -->
          <h2 class="font-bold text-gray-900 text-base tracking-tight truncate group-hover:text-[#045B1B] transition-colors duration-200">
            {{ items.username || '-' }}
          </h2>

          <!-- Meta Contact Details Grid -->
          <div class="flex flex-col gap-0.5 text-xs text-gray-500">
            <div class="flex items-center gap-1.5 min-w-0">
              <i class="pi pi-phone text-[10px] text-[#5B9717] shrink-0"></i>
              <span class="truncate tracking-wide font-medium text-gray-600">{{ items.phoneNumber || '-' }}</span>
            </div>
            <div class="flex items-center gap-1.5 min-w-0 text-gray-400">
              <i class="pi pi-map-marker text-[10px] text-gray-400 shrink-0"></i>
              <span class="truncate text-[11px]">{{ items.address || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pill Style Status Badge -->
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm border transition-all duration-200"
        :class="items.status 
          ? 'bg-emerald-50/40 border-[#5B9717]/20 text-[#045B1B]' 
          : 'bg-rose-50/60 border-rose-100 text-rose-700'">
        <span class="w-1.5 h-1.5 rounded-full relative flex">
          <span v-if="items.status" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82b215] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-1.5 w-1.5" :class="items.status ? 'bg-[#5B9717]' : 'bg-rose-500'"></span>
        </span>
        {{ items.status ? 'Active' : 'Inactive' }}
      </span>
    </div>

    <!-- Dynamic Description/Remarks Block -->
    <div v-if="items.description"
      class="mt-4 text-xs sm:text-sm text-gray-600 bg-gray-50/40 p-3.5 rounded-xl border border-gray-100/70 leading-relaxed break-words shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
      <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 font-mono">Description</span>
      {{ items.description }}
    </div>

    <!-- Product Permissions Wrapper -->
    <div class="mt-4 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <!-- Container Header Row -->
      <div class="bg-gray-100 text-gray-600 border-b border-gray-100 px-3.5 py-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider font-mono">
        <div class="flex items-center gap-2 text-gray-500">
          <i class="pi pi-shield text-[11px] text-gray-500"></i>
          <span class="text-gray-500 font-sans tracking-normal capitalize font-semibold">Allocated Permissions</span>
        </div>
      </div>

      <!-- Item Matrix Layout -->
      <div v-if="(items.percentages || []).filter(r => r).length > 0" class="divide-y divide-gray-50 bg-white">
        <div v-for="(row, i) in (items.percentages || []).filter(r => r)" :key="i"
          class="grid grid-cols-12 gap-2 text-xs px-3.5 py-3 items-center hover:bg-[#82b215]/5 transition-colors duration-150">
          
          <!-- Product Tag -->
          <div class="col-span-6 font-semibold text-gray-700 truncate pr-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0 group-hover:text-[#5B9717] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="truncate text-gray-800 font-medium">{{ getProductName(row.productId) }}</span>
          </div>

          <!-- Percentage Allocation with Custom Palette Glow -->
          <div class="col-span-3 text-right">
            <span class="inline-block font-bold text-[#045B1B] bg-[#82b215]/10 px-2 py-0.5 rounded-md text-[11px] border border-[#5B9717]/10 tracking-tight">
              {{ row.percentages || 0 }}%
            </span>
          </div>

          <!-- Win Weight Configuration -->
          <div class="col-span-3 text-right font-mono font-bold text-gray-600 text-[11px]">
            <span class="text-gray-400 text-[10px] font-normal mr-0.5">×</span>{{ row.winMultiplier || 0 }}
          </div>
        </div>
      </div>

      <!-- Empty Permissions State -->
      <div v-else class="px-4 py-6 text-center text-xs text-gray-400 italic bg-gray-50/20">
        No permission metrics allocated.
      </div>
    </div>

    <!-- Auditing Meta Information Matrix -->
    <div class="mt-4 grid grid-cols-2 gap-4 bg-gray-50/30 p-3 rounded-xl border border-gray-100 text-[11px]">
      <div class="space-y-0.5 min-w-0">
        <p class="text-gray-400 font-bold text-[9px] uppercase tracking-wider font-mono">Created By</p>
        <p class="font-semibold text-gray-700 truncate">{{ getUserName(items.createdBy) }}</p>
      </div>
      <div class="space-y-0.5 min-w-0 text-right">
        <p class="text-gray-400 font-bold text-[9px] uppercase tracking-wider font-mono">Created At</p>
        <p class="font-semibold text-gray-600 truncate">{{ formatDateKhmer(items.createdAt) }}</p>
      </div>
    </div>

    <!-- Call-To-Action Operations Footer -->
    <div class="mt-4 flex justify-end gap-2 pt-2 border-t border-gray-100/50">
      <button
        @click="$emit('onDelete', items)"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 font-semibold text-xs shadow-sm active:scale-95">
        <i class="pi pi-trash text-[11px]"></i>
        <span>Delete</span>
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