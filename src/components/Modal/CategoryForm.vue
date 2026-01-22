<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" :static="true" @close="() => { }">
      <!-- Overlay -->
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm " />
      </TransitionChild>

      <!-- Modal Wrapper -->
      <div class="fixed inset-0 overflow-y-auto scrollbar">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-lg bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
              <!-- Header -->
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-[#045B1B]">
                  {{ isEditDoc ? 'Edit Category' : 'Add New Category' }}
                </h3>

        <svg @click="handleClose" class="close cursor-pointer w-6 h-6" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
              </div>

              <!-- Form -->
              <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
                <!-- Category Name -->
                <div>
                  <label class="label font-medium block mb-1">
                    Category Name <span class="text-red-500">*</span>
                  </label>

                  <input v-model="name" class="input w-full"
                    :class="{ 'input-invalid': isNameInvalid || isNameDuplicate }" placeholder="Enter category name"
                    @blur="checkCategoryNameUnique" />

                  <p v-if="isNameInvalid" class="error-text">
                    Category name is required.
                  </p>

                  <p v-if="isNameDuplicate" class="error-text">
                    This category name already exists.
                  </p>
                </div>

                <!-- Description -->
                <div>
                  <label class="label font-medium block mb-1">Description</label>
                  <textarea v-model="description" class="input w-full" rows="3"
                    placeholder="Enter optional description"></textarea>
                </div>

                <!-- Status -->
                <div class="flex items-center gap-2">
                  <ToggleSwitch v-model="status" inputId="category-status" />
                  <label class="label" for="category-status">
                    Active Status
                  </label>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end gap-4 pt-6 border-t">
                  <button type="button" class="btn-cancel" @click="handleClose" :disabled="loading">
                    Cancel
                  </button>

                  <button type="submit" class="btn-add" :disabled="loading || isNameDuplicate">
                    <span v-if="loading" class="animate-spin">🌀</span>
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
import { ref, watch, onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';
import debounce from 'lodash/debounce';
import { useBranchStore } from '@/store/branchStore';

export default {
  name: 'CategoryFormModal',
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
    const description = ref('');
    const status = ref(true);
    const isNameInvalid = ref(false);
    const isNameDuplicate = ref(false);
    const loading = ref(false);

    const { insertDoc, updateDoc } = useDocument();
    const { getDocs } = getDocument();
    const branchStore = useBranchStore();

    // DUPLICATE CHECK LOGIC
    const checkCategoryNameUnique = debounce(async () => {
      const categoryName = name.value.trim();
      if (!categoryName) {
        isNameDuplicate.value = false;
        return;
      }

      try {
        const conditions = [{ field: 'name', operator: '=', value: categoryName }];
        if (props.isEditDoc && props.doc?._id) {
          conditions.push({ field: '_id', operator: '!=', value: props.doc._id });
        }

        const response = await getDocs("Category", {
          dynamicConditions: JSON.stringify(conditions)
        });

        const existingCategories = response.data?.data || response.data || [];
        isNameDuplicate.value = existingCategories.length > 0;
      } catch (error) {
        console.error('Error checking uniqueness:', error);
      }
    }, 300);

    const populateForm = () => {
      if (props.isEditDoc && props.doc) {
        name.value = props.doc.name || '';
        description.value = props.doc.description || '';
        status.value = props.doc.status !== undefined ? props.doc.status : true;
      }
    };

    const handleClear = () => {
      name.value = '';
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
      await checkCategoryNameUnique.flush();
      if (isNameDuplicate.value) return;

      loading.value = true;

      const formDoc = {
        fields: {
          name: name.value,
          description: description.value,
          status: status.value,
          ...(props.isEditDoc
            ? { updatedBy: branchStore.userId, updatedAt: new Date() }
            : { createdBy: branchStore.userId }
          )
        }
      };

      try {
        const response = props.isEditDoc
          ? await updateDoc('Category', props.doc._id || props.doc.id, formDoc)
          : await insertDoc('Category', formDoc);

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

    // WATCHERS
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
      if (val) checkCategoryNameUnique();
    });

    return {
      open, name, description, status, isNameInvalid, isNameDuplicate,
      loading, handleSubmit, handleClose
    };
  }
};
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82B215] focus:border-[#82B215] transition-all;
}
</style>