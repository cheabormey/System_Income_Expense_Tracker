<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-blue-600">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-blue-800">Deposit Funds</h3>
                <XMarkIcon @click="handleClose" class="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-600" />
              </div>

              <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                  <div class="text-lg font-bold text-gray-900">{{ doc?.name }}</div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">Current Balance</label>
                  <div class="text-lg font-mono text-green-600">${{ doc?.balance?.toLocaleString() }}</div>
                </div>

                <div class="border-t pt-4">
                  <label class="block text-sm font-bold text-gray-700 mb-1">Deposit Amount <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">$</span>
                    <input 
                      v-model.number="amount" 
                      type="number" 
                      step="0.01" 
                      min="0.01"
                      required
                      class="input pl-8 bg-blue-50 focus:ring-blue-500 border-blue-200" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div class="flex justify-end gap-4 pt-6">
                  <button type="button" class="btn-cancel px-5 py-2" @click="handleClose" :disabled="loading">Cancel</button>
                  <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2" :disabled="loading || amount <= 0">
                    <span v-if="loading" class="animate-spin text-sm">🌀</span>
                    Confirm Deposit
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { useDocument } from '@/composable/useDocument';
import { useBranchStore } from '@/store/branchStore';

export default {
  name: 'DepositForm',
  components: { Dialog, DialogPanel, TransitionChild, TransitionRoot, XMarkIcon },
  props: {
    visible: { type: Boolean, default: false },
    doc: { type: Object, default: null } // The selected account
  },
  emits: ['onClose'],

  setup(props, { emit }) {
    const amount = ref(0);
    const loading = ref(false);
    const { updateDoc } = useDocument();
    const branchStore = useBranchStore();

    const handleClose = () => {
      amount.ref = 0;
      emit('onClose', 'close');
    };

    const handleSubmit = async () => {
      if (amount.value <= 0) return;
      loading.value = true;

      // Calculate new balance
      const newBalance = (props.doc.balance || 0) + amount.value;

      const payload = {
        fields: {
          balance: newBalance,
          updatedBy: branchStore.userId,
          updatedAt: new Date()
        }
      };

      try {
        const res = await updateDoc('Account', props.doc._id, payload);
        if (res) {
          emit('onClose', 'update'); // Refresh data in View
        }
      } catch (err) {
        console.error("Deposit failed", err);
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.visible, (val) => {
      if (val) amount.value = 0;
    });

    return { amount, loading, handleClose, handleSubmit };
  }
};
</script>

<style scoped>
.input { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-all; }
.btn-cancel { @apply bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition; }
</style>