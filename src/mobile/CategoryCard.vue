<template>
  <div class="space-y-4 p-1">
    <div v-for="(item, index) in items" :key="item._id || index"
      class="relative bg-white border border-gray-100 shadow-md rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
      
      <div class="absolute top-0 left-0 w-1.5 h-full" :class="item.status ? 'bg-[#5B9717]' : 'bg-rose-500'"></div>

      <div class="p-4 pl-6">
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-[#045B1B] truncate">
              {{ item.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ item.description || t('No description provided') }}
            </p>
            
            <div class="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <i class="pi pi-user"></i>
                {{ item.createdBy ? t('User') : t('Unknown') }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-calendar"></i>
                {{ formatDate(item.createdAt) }}
              </span>
            </div>
          </div>

          <button @click.stop="$emit('onStatusChange', item)"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border"
            :class="item.status
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'">
            <i class="pi" :class="item.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
            {{ item.status ? t('Active') : t('Inactive') }}
          </button>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
          <span class="text-[10px] text-gray-400 font-mono">
            {{ t('ID') }}: {{ item._id ? item._id.substring(item._id.length - 6) : 'N/A' }}
          </span>

          <div class="flex gap-3">
            <button @click.stop="$emit('onEdit', item)"
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
              <i class="pi pi-pencil text-sm"></i>
            </button>

            <button @click.stop="$emit('onDelete', item)"
              class="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
              <i class="pi pi-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && items.length === 0"
      class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <i class="pi pi-folder-open text-4xl text-gray-300"></i>
      <p class="text-gray-500 mt-2 font-medium">{{ t('No Data Found') }}</p>
    </div>

    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
    </div>
  </div>
</template>



<script setup>
import { defineProps, defineEmits } from 'vue';
import formatDate from "@/composable/formatDate";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['onEdit', 'onDelete', 'onStatusChange']);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>