<template>
    <div class="flex justify-center fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-50">
        <Dialog v-model:visible="open" modal :style="{ width: '50rem', top: '6%' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable="false" class="rounded-md">
            <template #header>
                <div
                    class="flex justify-between items-center w-full text-primary border-b border-dashed border-primary-border pb-2">
                    <div class="flex items-center space-x-2">
                        <Coins />
                        <span class="text-lg font-semibold">{{ isEditDoc ? t('Edit Category') :
                            t('Create Category') }}</span>
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

            <form @submit.prevent="handleSubmit" class="mt-4">
                <div class="">

                    <!-- Name Field -->
                    <div class="space-y-2">
                        <div class="flex space-x-2">
                            <label for="name" class="label">{{ $t("Category Name") }}</label>
                            <span class="rq-label"></span>
                        </div>
                        <InputText v-model="name" :invalid="isNameInvalid || isNameDuplicate" id="name" class="w-full"
                            :placeholder="t('Category Name')" autocomplete="off" @blur="checkCategoryNameUnique" />
                        <Message class="text-red-500" v-if="isNameInvalid" severity="error">{{ $t("Category name is required") }}</Message>
                        <Message class="text-red-500" v-if="!isNameInvalid && isNameDuplicate" severity="error">
                            {{ $t("This category name already exists")}}</Message>
                    </div>
                    <!-- Description Field -->
                    <div class="space-y-2">
                        <div class="flex space-x-2">
                            <label for="description" class="label">{{ $t("Description") }}</label>
                        </div>
                        <Textarea v-model="description" id="description" class="w-full"
                            ::placeholder="t('Description type')" rows="3" />
                    </div>



                    <!-- Status Toggle -->
                    <div class="flex items-center space-x-2 col-span-2">
                        <ToggleSwitch v-model="status" inputId="switch1" />
                        <label class="label" for="switch1">{{ $t("Actions") }}</label>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-2 mt-6">
                    <button type="button" class="btn-cancel" @click="handleClose">{{ $t("Cancel") }}</button>
                    <button type="submit" class="btn-sub flex items-center justify-center">
                        <span v-if="!loading">{{ $t("Save") }}</span>
                        <span v-else
                            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </button>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useDocument } from '@/composable/useDocument';
import { useI18n } from "vue-i18n";
import { getDocument } from '@/composable/getDocument'; // ✅ Import getDocument
import debounce from 'lodash/debounce'; // ✅ Import debounce

export default {
    props: ['visible', 'isEditDoc', 'doc'],
    emits: ['onClose'],
    setup(props, { emit }) {
        const { t } = useI18n();
        const open = ref(props.visible);
        const name = ref('');
        const description = ref('');
        const status = ref(true);
        const isNameInvalid = ref(false);
        const isNameDuplicate = ref(false); // ✅ NEW STATE FOR DUPLICATE CHECK
        const loading = ref(false);


        // Composables
        const { insertDoc, updateDoc, loading: documentLoading } = useDocument();
        const { getDocs } = getDocument(); // ✅ Use getDocument composable

        // ✅ DEBOUNCED FUNCTION FOR DUPLICATE CHECK
        const checkCategoryNameUnique = debounce(async () => {
            const categoryName = name.value.trim();
            if (!categoryName) {
                isNameDuplicate.value = false;
                return;
            }

            try {
                const conditions = [
                    { field: 'name', operator: '=', value: categoryName },
                ];

                // Exclude the current document when editing
                if (props.isEditDoc && props.doc?._id) {
                    conditions.push({ field: '_id', operator: '!=', value: props.doc._id });
                }

                // Fetch from the 'Category' collection
                const response = await getDocs("Category", {
                    dynamicConditions: JSON.stringify(conditions)
                });

                const existingCategories = response.data?.data || response.data || [];
                isNameDuplicate.value = existingCategories.length > 0;

            } catch (error) {
                console.error('Error checking category name uniqueness:', error);
                isNameDuplicate.value = false;
            }
        }, 300); // 300ms debounce time

        const populateForm = () => {
            if (props.isEditDoc && props.doc) {
                name.value = props.doc.name;
                description.value = props.doc.description || '';
                status.value = props.doc.status;
            }
        };

        watch(() => props.visible, val => {
            open.value = val;
            if (val) {
                handleClear(); // Clear on open
                populateForm();
            }
        });

        onMounted(() => {
            if (props.visible) {
                populateForm();
            }
        });

        const handleClose = () => {
            open.value = false;
            handleClear();
            emit('onClose', 'close');
        };

        const handleClear = () => {
            name.value = '';
            description.value = '';
            status.value = true;
            isNameInvalid.value = false;
            isNameDuplicate.value = false; // ✅ Clear duplicate status
        };

        const handleSubmit = async () => {
            // 1. Basic required field validation
            if (!name.value.trim()) {
                isNameInvalid.value = true;
                return;
            } else {
                isNameInvalid.value = false;
            }

            // 2. Wait for uniqueness check to finish
            await checkCategoryNameUnique.flush();

            // 3. Check for uniqueness error
            if (isNameDuplicate.value) { // ✅ Block submission if duplicate
                return;
            }

            loading.value = true;

            const formDoc = {
                fields: {
                    name: name.value,
                    description: description.value,
                    status: status.value
                }
            };

            try {
                const collectionName = 'Category';
                const response = props.isEditDoc
                    ? await updateDoc(collectionName, props.doc._id, formDoc)
                    : await insertDoc(collectionName, formDoc);

                if (response.message || response.success) {
                    const action = props.isEditDoc ? 'update' : 'add';
                    emit('onClose', action);
                    handleClear();
                }
                open.value = false;
            } catch (err) {
                console.error('Submit failed', err);
                // Fallback for database-level unique constraint error (e.g., MongoDB 11000)
                if (err.code === 11000) {
                    isNameDuplicate.value = true;
                }
            } finally {
                loading.value = false;
            }
        };

        watch(name, val => {
            if (val) {
                isNameInvalid.value = false;
                isNameDuplicate.value = false; // Clear duplicate status immediately
                checkCategoryNameUnique(); // ✅ Trigger debounced check
            } else {
                isNameDuplicate.value = false;
            }
        });

        return {
            open,
            name,
            description,
            status,
            isNameInvalid,
            isNameDuplicate, // ✅ Expose new state
            documentLoading,
            loading, // ✅ Expose loading state
            handleSubmit,
            handleClose,
            checkCategoryNameUnique, // ✅ Expose new function
            t
        };
    }
}
</script>
