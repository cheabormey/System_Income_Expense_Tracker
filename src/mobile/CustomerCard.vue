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
            <p class="text-[10px] text-gray-400 uppercase font-bold">Balance</p>
            <p class="font-mono font-bold" :class="cust.balance < 0 ? 'text-red-500' : 'text-green-600'">
              {{ cust.balance?.toLocaleString() || '0' }}
            </p>
          </div>
        </div>

        <div class="mt-3 text-xs text-gray-500">
          <p class="truncate"><i class="pi pi-map-marker mr-1"></i> {{ cust.address || 'No address provided' }}</p>
        </div>

        <div class="mt-4 pt-3 border-t flex justify-between items-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="cust.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ cust.status ? 'ACTIVE' : 'INACTIVE' }}
          </span>
          <div class="flex gap-2">
            <button @click="$emit('onEdit', cust)" class="p-2 bg-blue-50 text-blue-600 rounded-lg"><i class="pi pi-pencil"></i></button>
            <button @click="$emit('onDelete', cust)" class="p-2 bg-rose-50 text-rose-600 rounded-lg"><i class="pi pi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading" class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <i class="pi pi-users text-4xl text-gray-300"></i>
      <p class="text-gray-500 mt-2">No customers found</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
</script>