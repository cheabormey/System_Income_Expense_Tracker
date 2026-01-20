<template>
  <div class="space-y-4 p-1">
    <div v-for="cust in items" :key="cust._id" class="bg-white border rounded-2xl shadow-sm overflow-hidden relative">
      <div class="absolute top-0 left-0 w-1.5 h-full" :class="cust.status ? 'bg-[#5B9717]' : 'bg-rose-500'"></div>

      <div class="p-4 pl-6">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold text-[#045B1B] text-lg">{{ cust.username }}</h3>
            <p class="text-sm text-gray-600">{{ cust.phoneNumber || 'No phone' }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-400 uppercase font-bold flex items-center justify-end gap-1">
              <i class="pi pi-wallet text-[10px]"></i>
              Balance
            </p>
            <p class="font-mono font-bold flex items-center justify-end gap-1"
              :class="cust.balance < 0 ? 'text-red-500' : 'text-green-600'">
              <i class="pi" :class="cust.balance < 0 ? 'pi-arrow-down' : 'pi-arrow-up'"></i>
              {{ cust.balance?.toLocaleString() || '0' }}
            </p>
          </div>

        </div>

        <div class="mt-3 text-xs text-gray-500">
          <p class="truncate"><i class="pi pi-map-marker mr-1"></i> {{ cust.address || 'No address provided' }}</p>
        </div>
        <div class="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
          <span class="flex items-center gap-1">
            <i class="pi pi-user"></i>
            {{ cust.createdBy ? 'User' : 'Unknown' }}
          </span>
          <span class="flex items-center gap-1">
            <i class="pi pi-calendar"></i>
            {{ formatDate(cust.createdAt) }}
          </span>
        </div>


        <div class="mt-4 pt-3 border-t flex justify-between items-center">
          <!-- <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="cust.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ cust.status ? 'ACTIVE' : 'INACTIVE' }}
          </span> -->
                    <button @click.stop="$emit('onStatusChange', cust)"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border"
            :class="cust.status
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'">
            <i class="pi" :class="cust.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
            {{ cust.status ? 'Active' : 'Inactive' }}
          </button>
          <div class="flex gap-3">
            <button @click.stop="$emit('onEdit', cust)"
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="pi pi-pencil text-sm"></i>
            </button>

            <button @click.stop="$emit('onDelete', cust)"
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
              <i class="pi pi-trash text-sm"></i>
            </button>
          </div>
        </div>
        
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading"
      class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <i class="pi pi-users text-4xl text-gray-300"></i>
      <p class="text-gray-500 mt-2">No customers found</p>
    </div>
  </div>
</template>

<script setup>
import formatDate from '@/composable/formatDate'

defineProps(['items', 'isLoading'])
defineEmits(['onEdit', 'onDelete'])
</script>
