<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-lg bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-[#045B1B]">
                  {{ isEditDoc ? 'Edit Account' : 'Add New Account' }}
                </h3>
                <svg @click="handleClose" class="w-6 h-6 cursor-pointer text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Account Name <span class="text-red-500">*</span></label>
                  <input v-model="name" class="input" :class="{ 'border-red-500 ring-1 ring-red-500': isNameInvalid || isNameDuplicate }" placeholder="Enter account name" />
                  <p v-if="isNameInvalid" class="text-red-500 text-xs mt-1">Name is required.</p>
                  <p v-if="isNameDuplicate" class="text-red-500 text-xs mt-1">This account already exists.</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select v-model="type" class="input">
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="Receivable">Accounts Receivable</option>
                    <option value="Payable">Accounts Payable</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                  <input v-model.number="balance" type="number" step="0.01" class="input" placeholder="0.00" />
                </div>

                <div class="flex items-center space-x-3">
                  <ToggleSwitch v-model="status" inputId="accStatus" />
                  <label for="accStatus" class="text-sm font-medium text-gray-700">Active Status</label>
                </div>

                <div class="flex justify-end gap-4 pt-6 border-t">
                  <button type="button" class="btn-cancel px-5 py-2" @click="handleClose" :disabled="loading">Cancel</button>
                  <button type="submit" class="btn-add px-5 py-2 flex items-center gap-2" :disabled="loading || isNameDuplicate">
                    <span v-if="loading" class="animate-spin text-sm">🌀</span>
                    {{ isEditDoc ? 'Update' : 'Save' }}
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
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';
import { useBranchStore } from '@/store/branchStore';
import debounce from 'lodash/debounce';

export default {
  name: 'AccountFormModal',
  components: { Dialog, DialogPanel, TransitionChild, TransitionRoot },
  props: { 
    visible: { type: Boolean, default: false }, 
    isEditDoc: { type: Boolean, default: false }, 
    doc: { type: Object, default: null } 
  },
  emits: ['onClose'],

  setup(props, { emit }) {
    const name = ref('');
    const type = ref('Cash');
    const balance = ref(0);
    const status = ref(true);
    const loading = ref(false);
    const isNameInvalid = ref(false);
    const isNameDuplicate = ref(false);

    const { insertDoc, updateDoc } = useDocument();
    const { getDocs } = getDocument();
    const branchStore = useBranchStore();

    const checkUnique = debounce(async () => {
      if (!name.value.trim()) return;
      try {
        const conditions = [{ field: 'name', operator: '=', value: name.value.trim() }];
        if (props.isEditDoc) conditions.push({ field: '_id', operator: '!=', value: props.doc._id });
        const res = await getDocs("Account", { dynamicConditions: JSON.stringify(conditions) });
        const data = res.data?.data || res.data || [];
        isNameDuplicate.value = data.length > 0;
      } catch (err) { console.error(err); }
    }, 300);

    const handleClose = () => { emit('onClose', 'close'); };

    const handleSubmit = async () => {
      if (!name.value.trim()) { isNameInvalid.value = true; return; }
      if (isNameDuplicate.value) return;
      
      loading.value = true;
      const payload = {
        fields: {
          name: name.value.trim(),
          type: type.value,
          balance: balance.value || 0,
          status: status.value,
          branchId: branchStore.branchId,
          [props.isEditDoc ? 'updatedBy' : 'createdBy']: branchStore.userId
        }
      };
      try {
        const res = props.isEditDoc 
          ? await updateDoc('Account', props.doc._id, payload) 
          : await insertDoc('Account', payload);
        if (res) emit('onClose', props.isEditDoc ? 'update' : 'add');
      } catch (err) { console.error(err); } finally { loading.value = false; }
    };

    watch(() => props.visible, (val) => {
      if (val) {
        isNameInvalid.value = false;
        isNameDuplicate.value = false;
        if (props.isEditDoc && props.doc) {
          name.value = props.doc.name;
          type.value = props.doc.type || 'Cash';
          balance.value = props.doc.balance || 0;
          status.value = props.doc.status !== undefined ? props.doc.status : true;
        } else {
          name.value = ''; type.value = 'Cash'; balance.value = 0; status.value = true;
        }
      }
    });

    watch(name, () => { isNameInvalid.value = false; checkUnique(); });

    return { name, type, balance, status, loading, isNameInvalid, isNameDuplicate, handleClose, handleSubmit };
  }
};
</script>

<style scoped>
.input { @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82B215] focus:border-[#82B215] transition-all; }
.btn-add { @apply bg-[#5B9717] text-white rounded-md hover:bg-[#4a7c13] transition disabled:bg-gray-300; }
.btn-cancel { @apply bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition; }
</style>