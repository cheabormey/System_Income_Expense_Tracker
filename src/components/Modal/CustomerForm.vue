<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-xl bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
            <div class="flex items-center justify-between p-5 border-b">
              <h3 class="text-xl font-semibold text-[#045B1B]">{{ isEditDoc ? 'Edit Customer' : 'Add New Customer' }}</h3>
              <i class="pi pi-times cursor-pointer" @click="handleClose"></i>
            </div>

            <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium mb-1">Branch Reference</label>
                  <select v-model="form.branchId" class="w-full border rounded-md p-2 focus:ring-[#82B215]">
                    <option value="">Select Branch (Optional)</option>
                    <option v-for="branch in branchOptions" :key="branch._id" :value="branch._id">
                      {{ branch.name }}
                    </option>
                  </select>
                </div>

                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium mb-1">Customer Name *</label>
                  <input v-model="form.username" type="text" class="w-full border rounded-md p-2" required />
                </div>

                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium mb-1">Phone Number</label>
                  <input v-model="form.phoneNumber" type="text" class="w-full border rounded-md p-2" />
                </div>

                <div class="col-span-2 md:col-span-1">
                  <label class="block text-sm font-medium mb-1">Initial Balance</label>
                  <input v-model.number="form.balance" type="number" step="0.01" class="w-full border rounded-md p-2" />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium mb-1">Address</label>
                  <input v-model="form.address" type="text" class="w-full border rounded-md p-2" />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium mb-1">Description/Notes</label>
                  <textarea v-model="form.description" rows="2" class="w-full border rounded-md p-2"></textarea>
                </div>

                <div class="col-span-2 flex items-center gap-2">
                  <input type="checkbox" v-model="form.status" id="cust-status" class="accent-[#82B215]" />
                  <label for="cust-status" class="text-sm">Active Customer</label>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t">
                <button type="button" @click="handleClose" class="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                <button type="submit" class="px-6 py-2 bg-[#5B9717] text-white rounded-md" :disabled="loading">
                  {{ loading ? 'Saving...' : 'Save Customer' }}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';

const props = defineProps(['visible', 'isEditDoc', 'doc']);
const emit = defineEmits(['onClose']);
const { insertDoc, updateDoc } = useDocument();
const { getDocs } = getDocument();

const loading = ref(false);
const branchOptions = ref([]);
const form = reactive({
  branchId: '',
  username: '',
  phoneNumber: '',
  address: '',
  description: '',
  balance: 0,
  status: true
});

onMounted(async () => {
  const res = await getDocs('Branch', { limit: 100 });
  branchOptions.value = res.data?.data || [];
});

const handleClose = () => emit('onClose');

watch(() => props.visible, (val) => {
  if (val && props.doc) {
    Object.assign(form, { ...props.doc });
  } else if (val) {
    Object.assign(form, { branchId: '', username: '', phoneNumber: '', address: '', description: '', balance: 0, status: true });
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const payload = { fields: { ...form } };
    const res = props.isEditDoc 
      ? await updateDoc('Customer', props.doc._id, payload)
      : await insertDoc('Customer', payload);
    if (res) handleClose();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>