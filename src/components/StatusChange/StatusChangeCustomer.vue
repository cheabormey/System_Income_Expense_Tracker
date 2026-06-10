<template>
  <Dialog
    :visible="visible"
    modal
    :closable="false"
    :style="{ width: '28rem' }"
    :breakpoints="{ '768px': '92vw' }"
    class="rounded-2xl overflow-hidden"
  >
    <!-- Header -->
    <template #header>
      <div class="w-full flex items-center justify-between px-2 py-1">
        <div class="flex items-center gap-3">
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center"
            :class="doc?.status ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
          >
            <i class="pi text-lg" :class="doc?.status ? 'pi-ban' : 'pi-check-circle'"></i>
          </div>

          <div>
            <h2 class="text-lg font-bold text-gray-800">
              {{ doc?.status ? 'Disable Customer' : 'Enable Customer' }}
            </h2>
            <p class="text-xs text-gray-400">
              Change customer account status
            </p>
          </div>
        </div>

        <button
          @click="handleClose"
          class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
        >
          <i class="pi pi-times text-sm"></i>
        </button>
      </div>
    </template>

    <!-- Body -->
    <div class="px-2 py-4">
      <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Customer Name</p>
        <p class="font-semibold text-gray-800 text-lg">
          {{ doc?.username || '-' }}
        </p>

        <div class="mt-4 flex items-center gap-2">
          <span class="text-sm text-gray-500">Current Status:</span>

          <span
            class="px-3 py-1 rounded-full text-xs font-semibold"
            :class="doc?.status
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'"
          >
            {{ doc?.status ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <div class="mt-5 text-center">
        <p class="text-gray-600 text-sm">
          Are you sure you want to
          <span class="font-bold" :class="doc?.status ? 'text-red-600' : 'text-green-600'">
            {{ doc?.status ? 'Disable' : 'Enable' }}
          </span>
          this customer account?
        </p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-3 px-2 pb-2">
        <button
          @click="handleClose"
          class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
          :disabled="loading"
        >
          Cancel
        </button>

        <button
          @click="handleSubmit"
          :disabled="loading"
          class="px-5 py-2 rounded-lg text-white text-sm font-medium shadow"
          :class="doc?.status
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'"
        >
          <span v-if="!loading">
            {{ doc?.status ? 'Disable Now' : 'Enable Now' }}
          </span>

          <span v-else class="flex items-center gap-2">
            <i class="pi pi-spin pi-spinner"></i>
            Updating...
          </span>
        </button>
      </div>
    </template>
  </Dialog>
</template>

<!-- StatusChangeCustomer.vue -->
<script>
import { ref } from 'vue'
import { getDocument } from '@/composable/getDocument'

export default {
  props: {
    visible: Boolean,
    doc: Object
  },

  // ✅ CHANGED HERE
  emits: ['onClose'],

  setup(props, { emit }) {
    const loading = ref(false)
    const { updateDocs } = getDocument()

    const handleClose = () => {
      emit('onClose', false)        // ✅ consistent
    }

    const handleSubmit = async () => {
      try {
        loading.value = true

        const newStatus = !props.doc.status

        await updateDocs('Customer', props.doc._id, {
          status: newStatus
        })

        emit('onClose', 'status')     // ✅ consistent
      } catch (err) {
        console.error(err)
        emit('onClose', false)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      handleClose,
      handleSubmit
    }
  }
}
</script>