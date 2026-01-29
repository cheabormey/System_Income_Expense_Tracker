<template>
  <div class="space-y-4 p-1">
    <div v-for="item in items" :key="item._id" 
      class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-[#045B1B] relative hover:shadow-md transition-all">
      
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <p class="text-[10px] uppercase font-bold text-gray-400">Chief/Customer</p>
          <h3 class="text-lg font-bold text-[#045B1B]">{{ item.customerId }}</h3>
        </div>
<div class="text-right">
  <p class="text-[10px] uppercase font-bold text-gray-400">Amount</p>
  <h3 class="text-xl font-black text-red-600">
    {{ item.amount?.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
  </h3>
</div>

      </div>

      <div class="space-y-2 text-xs text-gray-500 border-t pt-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar text-blue-500"></i>
          <span>Paid: {{ formatDate(item.paymentDate) }}</span>
        </div>
        <div v-if="item.description" class="flex items-start gap-2">
          <i class="pi pi-info-circle text-gray-400 mt-0.5"></i>
          <span class="italic">{{ item.description }}</span>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-3 pt-3 border-t border-gray-50">
        <button @click="$emit('onEdit', item)" 
          class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-1">
          <i class="pi pi-pencil text-[10px]"></i> EDIT
        </button>
        <button @click="$emit('onDelete', item)" 
          class="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center gap-1">
          <i class="pi pi-trash text-[10px]"></i> DELETE
        </button>
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading" class="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed">
      <i class="pi pi-receipt text-4xl text-gray-200"></i>
      <p class="text-gray-400 mt-2 font-medium">No records found</p>
    </div>
  </div>
</template>

<script setup>
import formatDate from "@/composable/formatDate";
defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
</script>