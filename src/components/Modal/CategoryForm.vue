<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-[#045B1B]">
                  {{ isEditDoc ? ('Edit Category') : ('Add New Category') }}
                </h3>
                <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
                  <span class="text-2xl">×</span>
                </button>
              </div>

              <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
                <div>
                  <label class="label font-medium block mb-1">Category Name <span class="text-red-500">*</span></label>
                  <input 
                    v-model="name" 
                    class="input" 
                    :class="{ 'border-red-500 ring-1 ring-red-500': isNameInvalid || isNameDuplicate }"
                    placeholder="Enter category name" 
                  />
                  <p v-if="isNameInvalid" class="text-red-500 text-xs mt-1">Category name is required.</p>
                  <p v-if="isNameDuplicate" class="text-red-500 text-xs mt-1">This category name already exists.</p>
                </div>

                <div>
                  <label class="label font-medium block mb-1">Description</label>
                  <textarea 
                    v-model="description" 
                    class="input" 
                    rows="3" 
                    placeholder="Enter optional description"
                  ></textarea>
                </div>

                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="status" id="status" class="accent-[#82B215] h-4 w-4" />
                  <label for="status" class="text-sm text-gray-700">Active Status</label>
                </div>

                <div class="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    @click="handleClose"
                    :disabled="loading"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-5 py-2 bg-[#82B215] text-white rounded-md hover:bg-[#6e9a12] transition flex items-center gap-2 disabled:bg-gray-400"
                    :disabled="loading || isNameDuplicate"
                  >
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
      setTimeout(handleClear, 300); // Clear after transition
    };

   const handleSubmit = async () => {
      if (!name.value.trim()) {
        isNameInvalid.value = true;
        return;
      }
      await checkCategoryNameUnique.flush();
      if (isNameDuplicate.value) return;

      loading.value = true;

      // UPDATED TO MATCH YOUR MONGOOSE SCHEMA
      const formDoc = {
        fields: {
          name: name.value,
          description: description.value,
          status: status.value,
          // Handle createdBy/updatedBy logic
          ...(props.isEditDoc 
            ? { updatedBy: 'user_id_here', updatedAt: new Date() } 
            : { createdBy: 'user_id_here' }
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