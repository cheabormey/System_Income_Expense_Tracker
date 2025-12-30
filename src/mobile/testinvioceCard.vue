<template>
  <div class="grid grid-cols-1 gap-4">
    <div v-for="inv in items" :key="inv._id" class="bg-white p-5 rounded-2xl shadow-sm border-t-4"
      :class="inv.isDebt ? 'border-red-500' : 'border-[#5B9717]'">
      
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="font-bold text-[#045B17]">{{ inv.customerId?.username || 'Unknown Customer' }}</h3>
          <p class="text-xs text-gray-400">{{ formatDate(inv.playDate) }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="$emit('onEdit', inv)" class="p-2 bg-blue-50 text-blue-600 rounded-xl"><i class="pi pi-pencil text-sm"></i></button>
          <button @click="$emit('onDelete', inv)" class="p-2 bg-red-50 text-red-600 rounded-xl"><i class="pi pi-trash text-sm"></i></button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
        <div>
          <p class="text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
          <p class="font-mono font-bold">{{ inv.totalAmount?.toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-gray-400">Debt</p>
          <p class="font-mono font-bold text-red-500">{{ inv.deptAmount?.toLocaleString() }}</p>
        </div>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <span v-if="inv.isChiefLotteryWin" class="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">CHIEF WIN</span>
        <span v-else></span>
        <span class="text-xs font-bold" :class="inv.isDebt ? 'text-red-600' : 'text-green-600'">
          {{ inv.isDebt ? 'UNPAID' : 'PAID' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';
</script>