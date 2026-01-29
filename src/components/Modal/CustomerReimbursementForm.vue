<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
            <div class="flex justify-between items-center p-5 border-b">
              <h3 class="text-xl font-bold text-[#045B1B]">
                {{ isEditDoc ? 'Edit Reimbursement' : 'New Reimbursement' }}
              </h3>
              <i class="pi pi-times cursor-pointer" @click="handleClose"></i>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Customer ID <span class="text-red-500">*</span></label>
                <input v-model="form.customerId" required type="text" class="input-field" placeholder="Enter Customer ID" />
              </div>

              <!-- <div>
                <label class="block text-sm font-medium mb-1">Total Debt Amount</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-400">$</span>
                  <input v-model.number="form.totalDebt" type="number" step="0.01" class="input-field pl-7" placeholder="0.00" />
                   
                </div>
              </div> -->
<div>
  <label class="block text-sm font-medium mb-1">Total Debt Amount</label>
  <div class="relative">
    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
    <InputNumber
      v-model="form.totalDebt"
      :min="0"
      mode="decimal"
      :minFractionDigits="0"
      :maxFractionDigits="0"
      useGrouping
      class="w-full pl-7"
      placeholder="0"
    />
  </div>
</div>




              <div>
                <label class="block text-sm font-medium mb-1">Branch ID</label>
                <input v-model="form.branchId" type="text" class="input-field bg-gray-50" placeholder="Branch identifier" />
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button type="button" @click="handleClose" class="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" :disabled="loading" class="bg-[#5B9717] text-white px-6 py-2 rounded-lg font-bold">
                  {{ loading ? 'Saving...' : 'Confirm Save' }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';
import { useBranchStore } from '@/store/branchStore';

export default {
  components: { Dialog, DialogPanel, TransitionChild, TransitionRoot },
  props: ['visible', 'isEditDoc', 'doc'],
  emits: ['onClose'],
  setup(props, { emit }) {
    const { insertDoc, updateDoc } = useDocument();
    const branchStore = useBranchStore();
    const loading = ref(false);

    const form = ref({
      customerId: '',
      totalDebt: 0,
      branchId: '',
      invoiceIds: [],
    });

    watch(() => props.visible, (newVal) => {
      if (newVal && props.doc) {
        form.value = { ...props.doc };
      } else {
        form.value = { customerId: '', totalDebt: 0, branchId: branchStore.branchId || '', invoiceIds: [] };
      }
    });

    const handleClose = () => emit('onClose');

    const handleSubmit = async () => {
      loading.value = true;
      try {
        const payload = {
          fields: {
            ...form.value,
            updatedBy: branchStore.userId,
            updatedAt: props.isEditDoc ? new Date() : null,
            ...(props.isEditDoc ? {} : { createdBy: branchStore.userId })
          }
        };

        const res = props.isEditDoc 
          ? await updateDoc('CustomerReimburstment', props.doc._id, payload)
          : await insertDoc('CustomerReimburstment', payload);

        if (res) handleClose();
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    return { form, loading, handleClose, handleSubmit };
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#82B215] outline-none transition-all;
}
</style>