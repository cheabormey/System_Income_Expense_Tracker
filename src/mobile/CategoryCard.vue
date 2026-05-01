<template>
  <div
    v-if="floor && floor._id"
    class="bg-white rounded-2xl shadow-md border border-gray-100 p-4 space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >

    <!-- Top Header -->
    <div class="flex justify-between items-start gap-3">
      <div class="flex items-start gap-3 min-w-0">
        
        <!-- Floor Icon -->
        <div
          class="w-12 h-12 rounded-full bg-[#045B1B]/10 flex items-center justify-center text-[#045B1B] shrink-0 font-bold text-lg"
        >
          <Ticket class="w-6 h-6" />
        </div>

        <!-- Floor Info -->
        <div class="min-w-0">
          <h2 class="font-bold text-primary-dark text-base truncate">
            {{ floor.name || $t('N/A') }}
          </h2>

          <!-- <p class="text-sm text-gray-500 truncate">
            {{ $t('Created By') }} : {{ getUserName(floor.createdBy) }}
          </p> -->

          <p class="text-xs text-gray-400 break-words">
            {{ formatDate(floor.createdAt) }}
          </p>
        </div>
      </div>

      <!-- Status Badge -->
      <div>
        <span
          @click="$emit('onCardAction', { action: 'changeStatus', item: floor })"
          class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition"
          :class="floor.status
            ? 'bg-green-50 text-green-700 hover:bg-green-100'
            : 'bg-red-50 text-red-700 hover:bg-red-100'"
        >
          <i
            class="pi text-[10px]"
            :class="floor.status ? 'pi-check-circle' : 'pi-times-circle'"
          ></i>
          {{ floor.status ? $t('Active') : $t('Inactive') }}
        </span>
      </div>
    </div>

    <!-- Detail Box -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
        {{ $t('Floor Details') }}
      </div>

      <div class="divide-y text-sm">
        <div class="grid grid-cols-3 px-3 py-2 items-center">
          <div class="font-medium text-gray-500">{{ $t('Name') }}</div>
          <div class="col-span-2 text-primary-dark truncate">
            {{ floor.name || '-' }}
          </div>
        </div>

        <div class="grid grid-cols-3 px-3 py-2 items-center">
          <div class="font-medium text-gray-500">{{ $t('Description') }}</div>
          <div class="col-span-2 text-gray-600 break-words">
            {{ floor.description || '-' }}
          </div>
        </div>

        <div class="grid grid-cols-3 px-3 py-2 items-center">
          <div class="font-medium text-gray-500">{{ $t('Created By') }}</div>
          <div class="col-span-2 text-gray-600 truncate">
            {{ getUserName(floor.createdBy) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="flex justify-end gap-2 pt-1">
      <button
        @click="$emit('onCardAction', { action: 'edit', item: floor })"
        class="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#045B1B]/10 text-[#045B1B] hover:bg-[#045B1B]/20 transition"
      >
        <Edit class="w-4 h-4" />
        <span class="text-xs font-medium">{{ $t('Edit') }}</span>
      </button>

      <button
        @click="$emit('onCardAction', { action: 'delete', item: floor })"
        class="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
      >
        <Trash2 class="w-4 h-4" />
        <span class="text-xs font-medium">{{ $t('Delete') }}</span>
      </button>
    </div>
  </div>
</template>
<script>
import { Edit, Trash2, Ticket } from 'lucide-vue-next';

export default {
  name: 'CategoryCard',
  props: {
    floor: { type: Object, required: true },
    getUserName: { type: Function, required: true },
    formatDate: { type: Function, required: true },
  },
  components: { Edit, Trash2, Ticket },
};
</script>