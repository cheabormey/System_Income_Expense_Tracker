<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-lg bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-[#045B1B]">
                  {{ isEditDoc ? 'Edit Product' : 'Add New Product' }}
                </h3>
                <svg @click="handleClose" class="close cursor-pointer w-6 h-6" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </div>

              <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
                <div>
                  <label class="label font-medium block mb-1">Product Name <span class="text-red-500">*</span></label>
                  <input v-model="name" class="input"
                    :class="{ 'border-red-500 ring-1 ring-red-500': isNameInvalid || isNameDuplicate }"
                    placeholder="Enter product name" />
                  <p v-if="isNameInvalid" class="text-red-500 text-xs mt-1">Product name is required.</p>
                  <p v-if="isNameDuplicate" class="text-red-500 text-xs mt-1">This name already exists.</p>
                </div>

                <div>
                  <label class="label font-medium block mb-1">Win Multiplier</label>
                  <input v-model.number="winMultiplier" type="number" step="0.01" class="input"
                    placeholder="Enter multiplier (e.g. 1.5)" />
                </div>

                <div>
                  <label class="label font-medium block mb-1">Description</label>
                  <textarea v-model="description" class="input" rows="3"
                    placeholder="Enter optional description"></textarea>
                </div>

                <div class="flex items-center space-x-2">
                  <ToggleSwitch v-model="status" inputId="statusSwitch" />
                  <label class="label" for="statusSwitch">Active Status</label>
                </div>

                <div class="flex justify-end gap-4 pt-6 border-t">
                  <button type="button" class="px-5 py-2 btn-cancel" @click="handleClose" :disabled="loading">
                    Cancel
                  </button>
                  <button type="submit" class="px-5 py-2 btn-add" :disabled="loading || isNameDuplicate">
                    <span v-if="loading" class="animate-spin mr-2">🌀</span>
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
import debounce from 'lodash/debounce';
import { useBranchStore } from '@/store/branchStore';

export default {
  name: 'ProductFormModal',
  components: { Dialog, DialogPanel, TransitionChild, TransitionRoot },
  props: {
    visible: { type: Boolean, default: false },
    isEditDoc: { type: Boolean, default: false },
    doc: { type: Object, default: null },
  },
  emits: ['onClose'],

  setup(props, { emit }) {
    const open = ref(props.visible);
    const name = ref('');
    const winMultiplier = ref(0); // Added for Model
    const description = ref('');
    const status = ref(true);
    const isNameInvalid = ref(false);
    const isNameDuplicate = ref(false);
    const loading = ref(false);

    const { insertDoc, updateDoc } = useDocument();
    const { getDocs } = getDocument();
    const branchStore = useBranchStore();

    // Check for duplicate names in "Product" collection
    const checkNameUnique = debounce(async () => {
      const val = name.value.trim();
      if (!val) return;

      try {
        const conditions = [{ field: 'name', operator: '=', value: val }];
        if (props.isEditDoc && props.doc?._id) {
          conditions.push({ field: '_id', operator: '!=', value: props.doc._id });
        }

        const response = await getDocs("Product", {
          dynamicConditions: JSON.stringify(conditions)
        });
        const existing = response.data?.data || [];
        isNameDuplicate.value = existing.length > 0;
      } catch (error) {
        console.error('Uniqueness check error:', error);
      }
    }, 300);

    const populateForm = () => {
      if (props.isEditDoc && props.doc) {
        name.value = props.doc.name || '';
        winMultiplier.value = props.doc.winMultiplier || 0;
        description.value = props.doc.description || '';
        status.value = props.doc.status !== undefined ? props.doc.status : true;
      }
    };

    const handleClear = () => {
      name.value = '';
      winMultiplier.value = 0;
      description.value = '';
      status.value = true;
      isNameInvalid.value = false;
      isNameDuplicate.value = false;
    };

    const handleClose = () => {
      open.value = false;
      emit('onClose', 'close');
      setTimeout(handleClear, 300); 
    };

    const handleSubmit = async () => {
      if (!name.value.trim()) {
        isNameInvalid.value = true;
        return;
      }
      await checkNameUnique.flush();
      if (isNameDuplicate.value) return;

      loading.value = true;

      // Mapping to match your Mongoose Model
      const formDoc = {
        fields: {
          name: name.value,
          winMultiplier: winMultiplier.value,
          description: description.value,
          status: status.value,
          ...(props.isEditDoc
            ? { updatedBy: branchStore.userId, updatedAt: new Date() }
            : { createdBy: branchStore.userId, createdAt: new Date() }
          )
        }
      };

      try {
        // Updated collection name to 'Product'
        const response = props.isEditDoc
          ? await updateDoc('Product', props.doc._id, formDoc)
          : await insertDoc('Product', formDoc);

        if (response) {
          emit('onClose', props.isEditDoc ? 'update' : 'add');
          handleClose();
        }
      } catch (err) {
        console.error('Submit failed', err);
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.visible, (val) => {
      open.value = val;
      if (val) {
        handleClear();
        populateForm();
      }
    });

    watch(name, (val) => {
      isNameInvalid.value = false;
      isNameDuplicate.value = false;
      if (val) checkNameUnique();
    });

    return {
      open, name, winMultiplier, description, status, isNameInvalid, isNameDuplicate,
      loading, handleSubmit, handleClose
    };
  }
};
</script>