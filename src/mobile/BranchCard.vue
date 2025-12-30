<template>
  <div class="space-y-4 p-1">
    <div v-for="branch in items" :key="branch._id" class="bg-white border rounded-2xl shadow-sm overflow-hidden relative transition-active active:scale-95">
      <div class="absolute top-0 left-0 w-1.5 h-full" :class="branch.status ? 'bg-[#5B9717]' : 'bg-rose-500'"></div>
      
      <div class="p-4 pl-6">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold text-[#045B1B] text-lg">{{ branch.name }}</h3>
            <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-mono tracking-tighter">
              CODE: {{ branch.abbreviation }}
            </span>
          </div>
          <div :class="branch.status ? 'text-green-600' : 'text-rose-600'">
            <i class="pi" :class="branch.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <p class="text-[10px] text-gray-400 uppercase font-bold">Director</p>
            <p class="truncate">{{ branch.directorName || '-' }}</p>
          </div>
          <div>
            <p class="text-[10px] text-gray-400 uppercase font-bold">Contact</p>
            <p class="truncate">{{ branch.contact }}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t flex justify-between items-center">
          <div class="text-[11px] text-gray-400">
            Prefix: <span class="font-mono text-gray-700">{{ branch.invoicePrefix || 'N/A' }}</span>
          </div>
          <div class="flex gap-2">
            <button @click="$emit('onEdit', branch)" class="p-2 bg-blue-50 text-blue-600 rounded-lg active:bg-blue-100">
              <i class="pi pi-pencil"></i>
            </button>
            <button @click="$emit('onDelete', branch)" class="p-2 bg-rose-50 text-rose-600 rounded-lg active:bg-rose-100">
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="items.length === 0 && !isLoading" class="text-center py-12 text-gray-400">
      <i class="pi pi-map text-4xl mb-2"></i>
      <p>No branches found</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['items', 'isLoading']);
defineEmits(['onEdit', 'onDelete']);
</script>