<template>
  <Dialog
    :visible="visible"
    @update:visible="emitClose"
    modal
    header="Customer Details"
    :style="{ width: '650px' }"
    class="rounded-xl overflow-hidden"
  >
    <div v-if="customer" class="space-y-6">

      <!-- BASIC INFO -->
      <div class="border-b pb-4">
        <h2 class="text-lg font-bold text-[#045B1B] mb-3">
          Basic Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-gray-500">Customer Name</p>
            <p class="font-semibold text-lg">{{ customer.username || '-' }}</p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Phone Number</p>
            <p class="font-medium">{{ customer.phoneNumber || '-' }}</p>
          </div>

          <div class="md:col-span-2">
            <p class="text-xs text-gray-500">Address</p>
            <p class="text-gray-700">{{ customer.address || '-' }}</p>
          </div>

          <div>
            <p class="text-xs text-gray-500">Status</p>
            <span
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              :class="customer.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            >
              <i
                class="pi"
                :class="customer.status ? 'pi-check-circle' : 'pi-times-circle'"
              />
              {{ customer.status ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>

      <!-- PERMISSIONS -->
      <div>
        <h2 class="text-lg font-bold text-[#045B1B] mb-3">
          Permissions & Commission
        </h2>

        <div v-if="customer.percentages && customer.percentages.length">
          <table class="w-full border text-sm rounded-lg overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-2 text-left">Type</th>
                <th class="p-2 text-left">Product</th>
                <th class="p-2 text-center">%</th>
                <th class="p-2 text-center">Multiplier</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in customer.percentages"
                :key="index"
                class="border-t hover:bg-gray-50"
              >
                <td class="p-2">{{ item.productType || '-' }}</td>
                <td class="p-2">{{ getProductName(item.productId) }}</td>
                <td class="p-2 text-center font-bold text-green-600">
                  {{ item.percentages }}%
                </td>
                <td class="p-2 text-center font-mono text-blue-600">
                  x{{ item.winMultiplier }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center text-gray-400 py-6 italic">
          No permission data found
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          @click="emitEdit"
          class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Edit
        </button>

        <button
          @click="emitClose"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  customer: Object,
  getProductName: Function
})

const emit = defineEmits(['update:visible', 'onEdit'])

const emitClose = () => {
  emit('update:visible', false)
}

const emitEdit = () => {
  if (props.customer) {
    emit('onEdit', props.customer)
  }
  emitClose()
}
</script>

<style scoped>
:deep(.p-dialog-header) {
  background: #045b1b;
  color: white;
}
</style>