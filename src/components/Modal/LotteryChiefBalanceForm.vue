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
                {{ isEditDoc ? 'Edit Chief Balance' : 'New Chief Balance' }}
              </h3>
              <i class="pi pi-times cursor-pointer hover:text-red-500" @click="handleClose"></i>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
 <div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Balance Amount</label>
  <InputNumber
    v-model="form.amount"
    :min="0"
    mode="decimal"
    :minFractionDigits="0"
    :maxFractionDigits="0"
    useGrouping
    placeholder="0"
    class="input-field w-full"
  />
</div>


              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Chief Expense ID</label>
                <input v-model="form.lastChiefExpenseId" type="text" class="input-field" placeholder="Enter expense reference ID" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Linked Invoice IDs (Comma separated)</label>
                <textarea v-model="invoiceString" rows="2" class="input-field" placeholder="inv_001, inv_002..."></textarea>
                <p class="text-[10px] text-gray-400 mt-1 italic">Internal array storage: {{ form.invoiceIds.length }} items</p>
              </div>

              <div class="flex items-center gap-3">
                <ToggleSwitch v-model="form.status" inputId="balance-status" />
                <label for="balance-status" class="text-sm font-medium text-gray-700">Active Status</label>
              </div>

              <div class="flex justify-end gap-3 pt-5 border-t">
                <button type="button" @click="handleClose" class="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" :disabled="loading" class="bg-[#5B9717] text-white px-6 py-2 rounded-lg font-bold">
                  {{ loading ? 'Saving...' : (isEditDoc ? 'Update' : 'Save') }}
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
    const invoiceString = ref('');

    const form = ref({
      amount: 0,
      lastChiefExpenseId: '',
      invoiceIds: [],
      status: true,
      branchId: branchStore.branchId || ''
    });

    watch(() => props.visible, (val) => {
      if (val) {
        if (props.isEditDoc && props.doc) {
          form.value = { ...props.doc };
          invoiceString.value = props.doc.invoiceIds?.join(', ') || '';
        } else {
          form.value = { amount: 0, lastChiefExpenseId: '', invoiceIds: [], status: true, branchId: branchStore.branchId };
          invoiceString.value = '';
        }
      }
    });

    const handleClose = () => emit('onClose', 'close');

    const handleSubmit = async () => {
      loading.value = true;
      // Convert comma string to array
      form.value.invoiceIds = invoiceString.value.split(',').map(s => s.trim()).filter(s => s !== '');

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
          ? await updateDoc('LotteryChiefBalance', props.doc._id, payload)
          : await insertDoc('LotteryChiefBalance', payload);

        if (res) {
          emit('onClose', props.isEditDoc ? 'update' : 'add');
        }
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    return { form, loading, invoiceString, handleClose, handleSubmit };
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#82B215] outline-none transition-all text-sm;
}
</style>