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
                {{ isEditDoc ? 'Edit Return' : 'New Return Money' }}
              </h3>
              <i class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500" @click="handleClose"></i>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer <span class="text-red-500">*</span></label>
                <input v-model="form.customerId" required type="text" class="input-field" placeholder="Search or Enter Customer ID" />
              </div>

<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">
    Amount <span class="text-red-500">*</span>
  </label>
  <InputNumber
    v-model="form.amount"
    :min="0"
    mode="decimal"
    :minFractionDigits="0"
    :maxFractionDigits="0"
    useGrouping
    required
    placeholder="0"
    class=" w-full"
  />
</div>


              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <input v-model="form.returnDate" type="date" class="input-field" />
              </div>

              <div class="flex items-center gap-3 py-2">
                <ToggleSwitch v-model="form.status" inputId="status" />
                <label for="status" class="text-sm font-medium text-gray-700">Active Record</label>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t">
                <button type="button" @click="handleClose" class="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" :disabled="loading" class="bg-[#5B9717] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#4a7c13]">
                  {{ loading ? 'Processing...' : 'Save Record' }}
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
      amount: 0,
      returnDate: new Date().toISOString().substr(0, 10),
      status: true,
      branchId: branchStore.branchId || ''
    });

    watch(() => props.visible, (isOpen) => {
      if (isOpen) {
        if (props.isEditDoc && props.doc) {
          form.value = { 
            ...props.doc,
            returnDate: props.doc.returnDate ? new Date(props.doc.returnDate).toISOString().substr(0, 10) : ''
          };
        } else {
          form.value = { customerId: '', amount: 0, returnDate: new Date().toISOString().substr(0, 10), status: true, branchId: branchStore.branchId };
        }
      }
    });

    const handleClose = () => emit('onClose');

    const handleSubmit = async () => {
      loading.value = true;
      try {
        const payload = {
          fields: {
            ...form.value,
            createdBy: props.isEditDoc ? props.doc.createdBy : branchStore.userId,
            updatedAt: props.isEditDoc ? new Date() : undefined
          }
        };

        const res = props.isEditDoc 
          ? await updateDoc('CustomerReturnMoney', props.doc._id, payload)
          : await insertDoc('CustomerReturnMoney', payload);

        if (res) {
          emit('onClose', props.isEditDoc ? 'update' : 'add');
          handleClose();
        }
      } catch (err) {
        console.error(err);
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