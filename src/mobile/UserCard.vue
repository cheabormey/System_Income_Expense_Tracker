<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <!-- User Card Container -->
    <div
      v-for="user in items"
      :key="user._id"
      class="relative overflow-hidden bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgb(4,91,27,0.02)] border border-gray-100/90 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(4,91,27,0.06)] hover:-translate-y-0.5 group"
    >
      <!-- Top Dynamic Color Strip (Changes depending on user status) -->
      <div 
        class="absolute top-0 left-0 right-0 h-[4px]"
        :class="user.status ? 'bg-gradient-to-r from-[#045B1B] via-[#5B9717] to-[#82b215]' : 'bg-gradient-to-r from-rose-500 to-orange-400'">
      </div>

      <!-- User Header -->
      <div class="flex items-start gap-4">
        <!-- Modernized Avatar Box with Status Ring Indicator -->
        <div
          class="h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/80 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200/60 shadow-inner ring-2 ring-offset-2 transition-all duration-300"
          :class="user.status ? 'ring-[#5B9717]/10 group-hover:ring-[#5B9717]/30' : 'ring-rose-100 group-hover:ring-rose-200'"
        >
          <img
            v-if="user.profilePicture"
            :src="user.profilePicture"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            alt="Profile"
          />
          <i v-else class="pi pi-user text-2xl text-gray-400" />
        </div>

        <!-- Profile Metadata -->
        <div class="flex-1 min-w-0 space-y-1">
          <div class="flex items-start justify-between gap-2">
            <h2 class="font-bold text-gray-900 text-base tracking-tight truncate group-hover:text-[#045B1B] transition-colors duration-200">
              {{ user.username }}
            </h2>
            
            <!-- Dynamic Role Badge -->
            <span
              class="shrink-0 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border shadow-sm"
              :class="user.mainRole === 'Super Admin' 
                ? 'bg-purple-50/50 border-purple-200 text-purple-700' 
                : 'bg-blue-50/50 border-blue-200 text-blue-700'"
            >
              {{ user.mainRole }}
            </span>
          </div>

          <!-- Gender Subtext Badge -->
          <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 text-[11px] font-medium text-gray-500 border border-gray-100">
            <i class="pi text-[9px]" :class="user.gender === 'Female' ? 'pi-percentage' : 'pi-info-circle'" />
            <span>{{ user.gender || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Informational Grid Container -->
      <div class="mt-5 bg-gray-50/50 border border-gray-100/70 rounded-xl p-3 space-y-2 text-xs sm:text-sm">
        <div class="flex justify-between items-center">
          <span class="text-gray-400 font-mono text-[11px] font-bold uppercase tracking-wider">Phone</span>
          <span class="font-semibold text-gray-700 font-sans">{{ user.phoneNumber || '-' }}</span>
        </div>
      </div>

      <!-- Interactive Status Action Box -->
      <div class="mt-4 flex items-center justify-between p-2 rounded-xl bg-gray-50/30 border border-gray-100/50">
        <div class="flex items-center gap-2 pl-1">
          <span class="text-gray-400 font-mono text-[10px] font-bold uppercase tracking-wider">Account Status</span>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm"
            :class="user.status 
              ? 'bg-emerald-50/40 border-[#5B9717]/20 text-[#045B1B]' 
              : 'bg-rose-50/60 border-rose-100 text-rose-700'"
          >
            <span class="w-1.5 h-1.5 rounded-full relative flex">
              <span v-if="user.status" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82b215] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5" :class="user.status ? 'bg-[#5B9717]' : 'bg-rose-500'"></span>
            </span>
            {{ user.status ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <!-- Dynamic Status Toggle Button Trigger -->
        <button
          @click="$emit('onStatusChange', user)"
          class="inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
          :class="user.status 
            ? 'text-[#045B1B] bg-emerald-50/60 border-[#5B9717]/20 hover:bg-[#82b215]/10' 
            : 'text-rose-600 bg-rose-50/60 border-rose-100 hover:bg-rose-100'"
          :title="user.status ? 'Deactivate User' : 'Activate User'"
        >
          <i
            class="pi text-sm"
            :class="user.status ? 'pi-lock-open' : 'pi-lock'"
          />
        </button>
      </div>

      <!-- Operational Action Buttons Footer -->
      <div class="flex gap-3 mt-5 pt-1">
        <!-- Edit Action using Corporate Color Scheme -->
        <button
          @click="$emit('onEdit', user)"
          class="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-[#82b215]/5 hover:text-[#045B1B] hover:border-[#5B9717]/30 transition-all duration-200 font-semibold text-xs shadow-sm active:scale-95"
        >
          <i class="pi pi-pencil text-[11px]" />
          <span>Edit User</span>
        </button>

        <!-- Danger Zone Delete Action -->
        <button
          @click="$emit('onDelete', user)"
          class="flex-1 flex items-center justify-center gap-1.5 bg-rose-50 text-rose-600 py-2.5 rounded-xl hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 font-semibold text-xs shadow-sm active:scale-95 border border-rose-100/30"
        >
          <i class="pi pi-trash text-[11px]" />
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Redesigned High-End Empty State Grid Element -->
    <div
      v-if="items.length === 0 && !isLoading"
      class="col-span-2 py-16 flex flex-col items-center justify-center bg-gray-50/30 border border-dashed border-gray-200 rounded-2xl shadow-inner text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200/60 shadow-sm text-gray-400 mb-4 transition-transform duration-300 hover:rotate-6">
        <i class="pi pi-inbox text-2xl" />
      </div>
      <h3 class="text-gray-800 font-bold text-base tracking-tight mb-1">No profiles allocated</h3>
      <p class="text-xs text-gray-400 max-w-[260px] leading-relaxed">We couldn't track any records here. Try expanding your dynamic filters.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['onEdit', 'onDelete', 'onStatusChange'])
</script>