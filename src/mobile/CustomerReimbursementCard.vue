<template>
  <div class="space-y-4">
    <div v-for="item in items" :key="item._id" 
      class="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-[#5B9717] relative">
      
      <div class="flex justify-between items-start">
        <div>
          <span class="text-[10px] uppercase font-bold text-gray-400">Customer ID</span>
          <h3 class="text-lg font-bold text-[#045B1B]">{{ item.customerId }}</h3>
        </div>
<div class="text-right">
  <span class="text-[10px] uppercase font-bold text-gray-400">Debt</span>
  <p class="text-lg font-bold text-rose-600">
    {{ item.totalDebt?.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
  </p>
</div>

      </div>

      <div class="mt-3 flex gap-4 text-xs text-gray-500">
        <span class="flex items-center gap-1">
          <i class="pi pi-file"></i> {{ item.invoiceIds?.length || 0 }} Invoices
        </span>
        <span class="flex items-center gap-1">
          <i class="pi pi-calendar"></i> {{ formatDate(item.createdAt) }}
        </span>
      </div>

      <div class="mt-4 flex justify-end gap-2 border-t pt-3">
        <button @click="$emit('onEdit', item)" class="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <i class="pi pi-pencil"></i>
        </button>
        <button @click="$emit('onDelete', item)" class="p-2 bg-rose-50 text-rose-600 rounded-lg">
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading" class="text-center py-10 bg-gray-100 rounded-xl">
      <p class="text-gray-400">No reimbursement records found.</p>
    </div>
  </div>
</template>

<script setup>
import formatDate from "@/composable/formatDate";
defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
</script>