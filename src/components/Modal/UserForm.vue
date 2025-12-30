<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
            <div class="flex items-center justify-between p-5 border-b">
              <h3 class="text-xl font-semibold text-[#045B1B]">{{ isEditDoc ? 'Edit User' : 'Add New User' }}</h3>
              <i class="pi pi-times cursor-pointer" @click="handleClose"></i>
            </div>

            <form class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
              <div class="col-span-1">
                <label class="block text-sm font-medium mb-1">Username *</label>
                <input v-model="form.username" type="text" class="w-full border rounded-md p-2 focus:ring-[#82B215]" required />
              </div>

              <div class="col-span-1">
                <label class="block text-sm font-medium mb-1">{{ isEditDoc ? 'New Password (Optional)' : 'Password *' }}</label>
                <input v-model="form.password" type="password" class="w-full border rounded-md p-2 focus:ring-[#82B215]" :required="!isEditDoc" />
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Main Role</label>
                <select v-model="form.mainRole" class="w-full border rounded-md p-2">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">Gender</label>
                <select v-model="form.gender" class="w-full border rounded-md p-2">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div class="col-span-1">
                <label class="block text-sm font-medium mb-1">Phone Number</label>
                <input v-model="form.phoneNumber" type="text" class="w-full border rounded-md p-2" />
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1">Address</label>
                <textarea v-model="form.address" rows="2" class="w-full border rounded-md p-2"></textarea>
              </div>

              <div class="col-span-2 flex items-center gap-2">
                <input type="checkbox" v-model="form.status" id="user-status" class="accent-[#82B215]" />
                <label for="user-status" class="text-sm">Active Account</label>
              </div>

              <div class="col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button type="button" @click="handleClose" class="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                <button type="submit" class="px-6 py-2 bg-[#5B9717] text-white rounded-md" :disabled="loading">
                  {{ loading ? 'Saving...' : 'Save' }}
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
  username: '',
  password: '',
  mainRole: 'User',
  gender: '',
  phoneNumber: '',
  address: '',
  status: true
});

const handleClose = () => emit('onClose');

watch(() => props.visible, (newVal) => {
  if (newVal && props.doc) {
    Object.assign(form, { ...props.doc, password: '' });
  } else if (newVal) {
    Object.assign(form, { username: '', password: '', mainRole: 'User', status: true, phoneNumber: '', address: '', gender: '' });
  }
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    const payload = { fields: { ...form } };
    if (props.isEditDoc && !form.password) delete payload.fields.password;

    const res = props.isEditDoc 
      ? await updateDoc('User', props.doc._id, payload)
      : await insertDoc('User', payload);

    if (res) handleClose();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>