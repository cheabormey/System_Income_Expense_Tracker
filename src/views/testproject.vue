<template>
  <div class="mx-5 font-noto">
    <ToastedVue 
      :showToast="toast.show" 
      :informMessage="toast.message" 
      :isFailed="toast.isFailed" 
      @onClose="toast.show = false" 
    />

    <button @click="handleNavigateBack" class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">{{ t('Back') }}</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">{{ t('Categories') }}</h1>

      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-700 mb-1">{{ t('Page rows') }}</span>
            <select v-model="pageSize" class="border rounded px-2 py-2 text-sm focus:ring-[#5B9717] outline-none">
              <option v-for="size in optionPageSize" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>

          <div class="w-full md:w-80">
            <span class="text-sm font-medium text-gray-700 mb-1 block">{{ t('Search') }}</span>
            <input v-model="searchQuery" type="text" :placeholder="t('Search by category name...')"
              class="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#5B9717] outline-none" />
          </div>
        </div>

        <button class="btn-add-new" @click="openAddForm">
          <i class="pi pi-plus mr-2"></i>
          <span>{{ t('Add New Category') }}</span>
        </button>
      </div>
    </div>

    <div v-if="!isMobileScreen" class="bg-white rounded-lg shadow overflow-x-auto border relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">{{ t('Name') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">{{ t('Description') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">{{ t('Created At') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">{{ t('Status') }}</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase">{{ t('Actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(category, index) in categoryData" :key="category._id" :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 text-gray-700">{{ formatDate(category.createdAt) }}</td>
            <td class="px-6 py-4">
              <button @click="handleStatusToggle(category)" :class="category.status ? 'text-green-600' : 'text-red-600'">
                <i class="pi" :class="category.status ? 'pi-check-circle' : 'pi-times-circle'" />
              </button>
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="openEditForm(category)" class="text-[#045B1B] mr-3"><i class="pi pi-pencil"/></button>
              <button @click="confirmDelete(category)" class="text-red-600"><i class="pi pi-trash"/></button>
            </td>
          </tr>
          <tr v-if="categoryData.length === 0 && !isLoading">
            <td colspan="5" class="px-6 py-16 text-center text-gray-500">{{ t('No Data Found') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <CategoryCard :items="categoryData" :is-loading="isLoading" @onEdit="openEditForm" @onDelete="confirmDelete" @onStatusChange="handleStatusToggle" />
    </div>

    <div class="mt-5">
      <Pagination 
        :currentPage="currentPage" 
        :limitedPerPage="pageSize" 
        :searchQuery="searchQuery"
        collectionName="Category" 
        @onEmitDataFromPagination="handleListenToPagination"
        @onEmitIsLoading="isLoading = $event" 
      />
    </div>

    <CategoryFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedCategory" @onClose="closeForm" />
    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedCategory?.name || ''" collectionName="Category" @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import formatDate from "@/composable/formatDate";

// Components
import ToastedVue from '@/components/ToastedVue.vue';
import CategoryFormModal from '../components/Modal/CategoryForm.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';
import CategoryCard from '@/mobile/CategoryCard.vue';

export default {
  name: 'CategoryView',
  components: { ToastedVue, CategoryFormModal, Pagination, DeleteConfirmation, CategoryCard, ChevronLeftIcon },
  setup() {
    const router = useRouter();
    const { t } = useI18n();

    // UI State
    const isLoading = ref(false);
    const isMobileScreen = ref(false);
    const toast = reactive({ show: false, message: '', isFailed: false });

    // Data State
    const categoryData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(50);
    const searchQuery = ref('');
    const optionPageSize = [50, 100, 200, 500];

    // Modals State
    const showFormModal = ref(false);
    const showDeleteModal = ref(false);
    const isEditDoc = ref(false);
    const selectedCategory = ref(null);
    const deleteId = ref(null);

    const triggerToast = (msg, failed = false) => {
      toast.message = msg;
      toast.isFailed = failed;
      toast.show = true;
    };

    const handleCheckScreenSize = () => { isMobileScreen.value = window.innerWidth < 768; };

    onMounted(() => {
      handleCheckScreenSize();
      window.addEventListener('resize', handleCheckScreenSize);
    });

    onBeforeUnmount(() => { window.removeEventListener('resize', handleCheckScreenSize); });

    const handleListenToPagination = (items) => { categoryData.value = items || []; };

    const openAddForm = () => {
      isEditDoc.value = false;
      selectedCategory.value = null;
      showFormModal.value = true;
    };

    const openEditForm = (category) => {
      isEditDoc.value = true;
      selectedCategory.value = category;
      showFormModal.value = true;
    };

    const closeForm = (status) => {
      showFormModal.value = false;
      if (status === 'add' || status === 'update') {
        searchQuery.value = ''; // Reset search to see new items
        triggerToast(status === 'add' ? 'Category Created!' : 'Category Updated!');
      }
    };

    const confirmDelete = (item) => {
      deleteId.value = item._id;
      selectedCategory.value = item;
      showDeleteModal.value = true;
    };

    const handleCloseDelete = (status) => {
      showDeleteModal.value = false;
      if (status === 'delete') {
        triggerToast('Category Deleted Successfully');
        searchQuery.value = '';
      }
    };

    const handleStatusToggle = (category) => {
      category.status = !category.status;
      triggerToast(`Status changed to ${category.status ? 'Active' : 'Inactive'}`);
    };

    watch(searchQuery, () => { currentPage.value = 1; });

    return {
      t, formatDate, isLoading, isMobileScreen, toast,
      categoryData, currentPage, pageSize, searchQuery, optionPageSize,
      showFormModal, showDeleteModal, isEditDoc, selectedCategory, deleteId,
      handleNavigateBack: () => router.push('/'),
      handleListenToPagination,
      openAddForm, openEditForm, closeForm,
      confirmDelete, handleCloseDelete, handleStatusToggle
    };
  }
};
</script>

<style scoped>
.btn-add-new {
  @apply bg-[#5B9717] text-white px-5 py-2.5 rounded-md hover:bg-[#4a7c13] transition flex items-center font-semibold shadow-sm;
}
</style>