<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="$emit('onClose')">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div class="fixed inset-0 overflow-y-auto p-4 flex items-center justify-center">
        <DialogPanel class="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
          <div class="p-5 border-b bg-gray-50 flex justify-between items-center">
            <h3 class="font-bold text-lg">{{ isEditDoc ? 'Edit Invoice' : 'New Invoice' }}</h3>
            <button @click="$emit('onClose')"><i class="pi pi-times"></i></button>
          </div>
          
          <form @submit.prevent="handleSubmit" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase">Branch</label>
              <select v-model="form.branchId" class="w-full border rounded p-2 mt-1" required>
                <option v-for="b in branches" :key="b._id" :value="b._id">{{ b.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase">Customer</label>
              <select v-model="form.customerId" class="w-full border rounded p-2 mt-1" required>
                <option v-for="c in customers" :key="c._id" :value="c._id">{{ c.username }}</option>
              </select>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase">Play Date</label>
              <input v-model="form.playDate" type="date" class="w-full border rounded p-2 mt-1" required />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-500 uppercase">Total Amount</label>
              <input v-model.number="form.totalAmount" type="number" class="w-full border rounded p-2 mt-1" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-500 uppercase">Debt Amount</label>
              <input v-model.number="form.deptAmount" type="number" class="w-full border rounded p-2 mt-1" />
            </div>

            <div class="col-span-2 flex flex-wrap gap-4 pt-2">
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="form.isDebt" /> Is Debt
              </label>
              <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" v-model="form.isChiefLotteryWin" /> Chief Win
              </label>
            </div>

            <div class="col-span-2 pt-4 flex justify-end gap-2 border-t">
              <button type="button" @click="$emit('onClose')" class="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-[#5B9717] text-white rounded shadow-md" :disabled="loading">
                {{ loading ? 'Processing...' : 'Save Invoice' }}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';

const props = defineProps(['visible', 'isEditDoc', 'doc']);
const emit = defineEmits(['onClose']);
const { insertDoc, updateDoc } = useDocument();
const { getDocs } = getDocument();

const loading = ref(false);
const branches = ref([]);
const customers = ref([]);

const form = reactive({
  branchId: '', customerId: '', playDate: '',
  totalAmount: 0, deptAmount: 0,
  isDebt: false, isChiefLotteryWin: false
});

onMounted(async () => {
  const [bRes, cRes] = await Promise.all([getDocs('Branch'), getDocs('Customer')]);
  branches.value = bRes.data?.data || [];
  customers.value = cRes.data?.data || [];
});

watch(() => props.visible, (val) => {
  if (val && props.doc) {
    Object.assign(form, props.doc);
    if (props.doc.playDate) form.playDate = new Date(props.doc.playDate).toISOString().split('T')[0];
  } else if (val) {
    Object.assign(form, { branchId: '', customerId: '', totalAmount: 0, deptAmount: 0, isDebt: false });
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = props.isEditDoc 
      ? await updateDoc('Invoice', props.doc._id, { fields: form }) 
      : await insertDoc('Invoice', { fields: form });
    if (res) emit('onClose');
  } finally { loading.value = false; }
};
</script>