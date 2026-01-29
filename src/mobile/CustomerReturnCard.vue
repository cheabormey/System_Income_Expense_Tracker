<template>
  <div class="space-y-4">
    <div v-for="item in items" :key="item._id" 
      class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-[#5B9717] relative hover:shadow-md transition-shadow">
      
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-tighter">Customer ID</h3>
          <p class="text-lg font-bold text-[#045B1B]">{{ item.customerId }}</p>
        </div>
<div class="text-right">
  <h3 class="text-sm font-bold text-gray-400 uppercase tracking-tighter">Amount</h3>
  <p class="text-xl font-black text-[#5B9717]">
    {{ item.amount?.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
  </p>
</div>

      </div>

      <div class="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
        <span class="flex items-center gap-1">
          <i class="pi pi-calendar"></i> {{ formatDate(item.returnDate) }}
        </span>
        <span class="flex items-center gap-1" :class="item.status ? 'text-green-600' : 'text-red-500'">
          <i class="pi" :class="item.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
          {{ item.status ? 'Active' : 'Inactive' }}
        </span>
      </div>

      <div class="absolute bottom-4 right-4 flex gap-2">
        <button @click="$emit('onEdit', item)" class="p-2 bg-blue-50 text-blue-600 rounded-full">
          <i class="pi pi-pencil text-sm"></i>
        </button>
        <button @click="$emit('onDelete', item)" class="p-2 bg-rose-50 text-rose-600 rounded-full">
          <i class="pi pi-trash text-sm"></i>
        </button>
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading" class="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
      <p class="text-gray-400 italic">No return records found.</p>
    </div>
  </div>
</template>

<script setup>
import formatDate from "@/composable/formatDate";
defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
</script>