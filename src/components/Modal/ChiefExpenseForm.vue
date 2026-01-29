<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-lg bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
            <div class="flex items-center justify-between p-5 border-b">
              <h3 class="text-xl font-bold text-[#045B1B]">
                {{ isEditDoc ? 'Edit Chief Expense' : 'New Chief Expense' }}
              </h3>
              <i class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500" @click="handleClose"></i>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Customer/Chief ID <span class="text-red-500">*</span></label>
                <input v-model="form.customerId" required type="text" class="input-field" placeholder="Enter ID" />
              </div>

<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Amount <span class="text-red-500">*</span></label>
  <InputNumber
    v-model="form.amount"
    :min="0"
    mode="decimal"
    :minFractionDigits="0"
    :maxFractionDigits="0"
    useGrouping
    required
    placeholder="0"
    class="input-field w-full"
  />
</div>


              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input v-model="form.paymentDate" type="date" class="input-field" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="form.description" rows="3" class="input-field" placeholder="What is this expense for?"></textarea>
              </div>

              <div class="flex justify-end gap-3 pt-5 border-t">
                <button type="button" @click="handleClose" class="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" :disabled="loading" class="bg-[#5B9717] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#4a7c13] transition-colors">
                  {{ loading ? 'Saving...' : 'Save Record' }}
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
      paymentDate: new Date().toISOString().substr(0, 10),
      description: '',
      branchId: branchStore.branchId || ''
    });

    watch(() => props.visible, (isOpen) => {
      if (isOpen) {
        if (props.isEditDoc && props.doc) {
          form.value = { 
            ...props.doc,
            paymentDate: props.doc.paymentDate ? new Date(props.doc.paymentDate).toISOString().substr(0, 10) : ''
          };
        } else {
          form.value = { 
            customerId: '', 
            amount: 0, 
            paymentDate: new Date().toISOString().substr(0, 10), 
            description: '', 
            branchId: branchStore.branchId 
          };
        }
      }
    });

    const handleClose = () => emit('onClose', 'close');

    const handleSubmit = async () => {
      loading.value = true;
      try {
        const payload = {
          fields: {
            ...form.value,
            createdBy: props.isEditDoc ? props.doc.createdBy : branchStore.userId,
          }
        };

        const res = props.isEditDoc 
          ? await updateDoc('ChiefExpense', props.doc._id, payload)
          : await insertDoc('ChiefExpense', payload);

        if (res) {
          emit('onClose', props.isEditDoc ? 'update' : 'add');
          handleClose();
        }
      } catch (err) {
        console.error("Submission error:", err);
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
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#82B215] outline-none transition-all text-sm;
}
</style>