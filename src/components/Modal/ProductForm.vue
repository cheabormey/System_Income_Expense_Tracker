<template>
  <Dialog
    v-model:visible="open"
    modal
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :closable="false"
    class="rounded-2xl overflow-hidden"
  >
    <template #header>
      <div class="flex justify-between items-center w-full text-primary border-b border-dashed border-primary-border pb-2">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-semibold">{{ isEditDoc ? 'Edit Product' : 'Add New Product' }}</span>
        </div>

          <button type="button" class="text-red-500 hover:text-red-300" @click="handleClose">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 
                1.293a1 1 0 101.414 1.414L10 11.414l1.293 
                1.293a1 1 0 001.414-1.414L11.414 
                10l1.293-1.293a1 1 0 00-1.414-1.414L10 
                8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
      </div>
    </template>

    <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="font-medium block mb-1">Product Name <span class="text-red-500">*</span></label>
        <input
          v-model="name"
          class="input"
          :class="{ 'border-red-500 ring-1 ring-red-500': isNameInvalid || isNameDuplicate }"
          placeholder="Enter product name"
        />
        <p v-if="isNameInvalid" class="text-red-500 text-xs mt-1">Product name is required.</p>
        <p v-if="isNameDuplicate" class="text-red-500 text-xs mt-1">This name already exists.</p>
      </div>

      <div>
        <label class="font-medium block mb-1">Win Multiplier</label>
        <input
          v-model.number="winMultiplier"
          type="number"
          step="0.01"
          class="input"
          placeholder="Enter multiplier"
        />
      </div>

      <div>
        <label class="font-medium block mb-1">Description</label>
        <textarea
          v-model="description"
          class="input"
          rows="3"
          placeholder="Enter optional description"
        ></textarea>
      </div>

      <div class="flex items-center space-x-2">
        <ToggleSwitch v-model="status" inputId="statusSwitch" />
        <label for="statusSwitch">Active Status</label>
      </div>

      <div class="flex justify-end gap-4 pt-6 border-t">
        <button type="button" class="btn-cancel px-5 py-2" @click="handleClose">
          Cancel
        </button>

        <button type="submit" class="btn-add px-5 py-2" :disabled="loading || isNameDuplicate">
          {{ isEditDoc ? 'Update' : 'Save' }}
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script>
import { ref, watch } from 'vue';
// import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';
import debounce from 'lodash/debounce';
import { useBranchStore } from '@/store/branchStore';
import Dialog from 'primevue/dialog';
import ToggleSwitch from 'primevue/toggleswitch';

export default {
  name: 'ProductFormModal',
  components: { Dialog, ToggleSwitch },
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