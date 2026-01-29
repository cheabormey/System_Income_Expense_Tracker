<template>
  <div class="space-y-4">
    <div v-for="item in items" :key="item._id" 
      class="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-[#045B1B] relative hover:shadow-md transition-all">
      
      <div class="flex justify-between items-start mb-3">
<div class="flex-1">
  <p class="text-[10px] uppercase font-bold text-gray-400">Total Balance</p>
  <h3 class="text-xl font-black text-[#5B9717]">
    {{ item.amount?.toLocaleString('en-US', { maximumFractionDigits: 0 }) }}
  </h3>
</div>

        <div class="text-right">
          <span :class="item.status ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'" 
            class="text-[10px] font-bold px-2 py-1 rounded-full border">
            {{ item.status ? 'ACTIVE' : 'INACTIVE' }}
          </span>
        </div>
      </div>

      <div class="space-y-2 text-xs text-gray-500 border-t pt-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-file-edit text-blue-500"></i>
          <span>Expense Ref: {{ item.lastChiefExpenseId || 'None' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-tags text-purple-500"></i>
          <span>Linked Invoices: {{ item.invoiceIds?.length || 0 }} total</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-clock text-gray-400"></i>
          <span>Created: {{ formatDate(item.createdAt) }}</span>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-3">
        <button @click="$emit('onEdit', item)" class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-colors">
          EDIT
        </button>
        <button @click="$emit('onDelete', item)" class="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-600 hover:text-white transition-colors">
          DELETE
        </button>
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading" class="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed">
      <i class="pi pi-wallet text-4xl text-gray-200"></i>
      <p class="text-gray-400 mt-2 font-medium">No Chief Balance Records</p>
    </div>
  </div>
</template>

<script setup>
import formatDate from "@/composable/formatDate";
defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
</script>