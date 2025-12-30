<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
            <div class="flex items-center justify-between p-5 border-b">
              <h3 class="text-xl font-semibold text-[#045B1B]">
                {{ isEditDoc ? 'Edit Branch' : 'Add New Branch' }}
              </h3>
              <i class="pi pi-times cursor-pointer text-gray-400 hover:text-black" @click="handleClose"></i>
            </div>

            <form class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium mb-1">Branch Name *</label>
                <input v-model="form.name" type="text" class="w-full border rounded-md p-2" required />
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium mb-1">Abbreviation (Code) *</label>
                <input v-model="form.abbreviation" type="text" class="w-full border rounded-md p-2" placeholder="e.g. HQ, BR01" required />
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium mb-1">Contact Number *</label>
                <input v-model="form.contact" type="text" class="w-full border rounded-md p-2" required />
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium mb-1">Director Name</label>
                <input v-model="form.directorName" type="text" class="w-full border rounded-md p-2" />
              </div>

              <div class="col-span-2 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="col-span-1">
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">Invoice Prefix</label>
                  <input v-model="form.invoicePrefix" type="text" class="w-full border rounded-md p-2" placeholder="INV-" />
                </div>
                <div class="col-span-1">
                  <label class="block text-xs font-bold uppercase text-gray-500 mb-1">ID Length</label>
                  <input v-model.number="form.invoiceIdLength" type="number" class="w-full border rounded-md p-2" />
                </div>
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1">Address</label>
                <textarea v-model="form.address" rows="2" class="w-full border rounded-md p-2"></textarea>
              </div>

              <div class="col-span-2 flex items-center gap-2">
                <input type="checkbox" v-model="form.status" id="branch-status" class="accent-[#82B215] h-4 w-4" />
                <label for="branch-status" class="text-sm font-medium">Active Branch</label>
              </div>

              <div class="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button type="button" @click="handleClose" class="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                <button type="submit" class="px-6 py-2 bg-[#5B9717] text-white rounded-md" :disabled="loading">
                  <span v-if="loading" class="animate-spin mr-2">🌀</span>
                  {{ isEditDoc ? 'Update Branch' : 'Save Branch' }}
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
import { ref, watch, reactive } from 'vue';
import { Dialog, DialogPanel, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';

const props = defineProps(['visible', 'isEditDoc', 'doc']);
const emit = defineEmits(['onClose']);
const { insertDoc, updateDoc } = useDocument();

const loading = ref(false);
const form = reactive({
  name: '',
  abbreviation: '',
  directorName: '',
  contact: '',
  address: '',
  status: true,
  invoiceIdLength: 6,
  invoicePrefix: ''
});

const handleClose = () => emit('onClose');

watch(() => props.visible, (val) => {
  if (val && props.doc) {
    Object.assign(form, { ...props.doc });
  } else if (val) {
    Object.assign(form, { name: '', abbreviation: '', directorName: '', contact: '', address: '', status: true, invoiceIdLength: 6, invoicePrefix: '' });
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const payload = { fields: { ...form } };
    const res = props.isEditDoc 
      ? await updateDoc('Branch', props.doc._id, payload)
      : await insertDoc('Branch', payload);
    if (res) handleClose();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>