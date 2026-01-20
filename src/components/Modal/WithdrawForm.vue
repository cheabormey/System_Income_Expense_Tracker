<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-orange-500">
              <div class="p-5 border-b font-semibold text-orange-800">Withdraw Funds</div>
              <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
                <div>Customer: <strong>{{ doc?.name }}</strong></div>
                <div>Balance: <strong class="text-blue-600">${{ doc?.balance }}</strong></div>
                <input v-model.number="amount" type="number" step="0.01" class="w-full border p-2 rounded" placeholder="Enter Amount" required />
                <p v-if="amount > doc?.balance" class="text-red-500 text-xs">Insufficient funds.</p>
                <div class="flex justify-end gap-2 pt-4">
                  <button type="button" @click="handleClose" class="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  <button type="submit" class="px-4 py-2 bg-orange-600 text-white rounded" :disabled="amount <= 0 || amount > doc?.balance || loading">Confirm</button>
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
import { ref } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';

export default {
  props: { visible: Boolean, doc: Object },
  emits: ['onClose'],
  setup(props, { emit }) {
    const amount = ref(0);
    const loading = ref(false);
    const { updateDoc } = useDocument();
    const handleClose = () => emit('onClose', 'close');
    const handleSubmit = async () => {
      loading.value = true;
      try {
        const newBalance = props.doc.balance - amount.value;
        await updateDoc('Account', props.doc._id, { fields: { balance: newBalance } });
        emit('onClose', 'update');
      } finally { loading.value = false; }
    };
    return { amount, loading, handleClose, handleSubmit };
  }
};
</script>