<template>
  <div class="mx-5 font-noto">
    <button @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-4">Categories</h1>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3 flex-wrap">
          <input v-model="searchQuery" placeholder="Search by name or description"
            class="border rounded-md px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />

          <select v-model="pageSize"
            class="border rounded-md px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#5B9717]">
            <option v-for="size in optionPageSize" :key="size" :value="size">{{ size }} rows</option>
          </select>
        </div>

        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add New Category</span>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-x-auto border relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(category, index) in categoryData" :key="category._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-3 py-1 text-xs font-medium rounded-full"
                :class="category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ category.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#045B1B] hover:bg-[#f9faf5]"
                @click="openEditForm(category)">
                <i class="pi pi-pencil text-base" />
              </button>
              <button class="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:bg-red-50"
                @click="confirmDelete(category)">
                <i class="pi pi-trash text-base" />
              </button>
            </td>
          </tr>
          <tr v-if="categoryData.length === 0 && !isLoading">
            <td colspan="4" class="px-6 py-16 text-center text-gray-500">No categories found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-5">
      <Pagination :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchQuery"
        collectionName="Category" @onEmitDataFromPagination="handleListenToPagination"
        @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage" />
    </div>

    <CategoryFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedCategory" @onClose="closeForm" />


    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedCategory?.name || ''"
      collectionName="Category" displayLabel="Category" :isLastRecordOnPage="isLastRecordOnPage"
      @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import CategoryFormModal from '../components/Modal/CategoryForm.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';
import { useRouter } from 'vue-router';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'CategoryView',
  components: { CategoryFormModal, Pagination, DeleteConfirmation, ChevronLeftIcon },

  setup() {
    const router = useRouter();
    const categoryData = ref([]);
    const isLoading = ref(false);
    const isLastRecordOnPage = ref(false);

    const currentPage = ref(1);
    const pageSize = ref(50);
    const optionPageSize = ref([50, 100, 200, 500]);

    const searchQuery = ref('');
    const searchText = ref('');

    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedCategory = ref(null);

    // Delete states
    const showDeleteModal = ref(false);
    const deleteId = ref(null);

    const handleListenToPagination = (items) => {
      categoryData.value = items || [];
    };

    const handleListenIsLoading = (status) => {
      isLoading.value = status;
    };

    const handleListenIsLastRecordOnPage = (status) => {
      isLastRecordOnPage.value = status;
    };

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
        searchQuery.value = '';
      }
    };


    const confirmDelete = (item) => {
      deleteId.value = item._id;

      isLastRecordOnPage.value = (categoryData.value.length === 1 && currentPage.value > 1);
      showDeleteModal.value = true;
    };

    const handleCloseDelete = (status) => {
      showDeleteModal.value = false;
      if (status === 'delete') {
        searchQuery.value = '';
      }
    };

    watch(searchQuery, (newVal) => {
      searchText.value = newVal;
      currentPage.value = 1;
    });

    return {
      handleNavigateBack: () => router.push('/'),
      categoryData,
      isLoading,
      isLastRecordOnPage,
      currentPage,
      pageSize,
      optionPageSize,
      searchQuery,
      searchText,
      showFormModal,
      isEditDoc,
      selectedCategory,
      showDeleteModal,
      deleteId,
      handleListenToPagination,
      handleListenIsLoading,
      handleListenIsLastRecordOnPage,
      openAddForm,
      openEditForm,
      closeForm,
      confirmDelete, // Added this to the return object
      handleCloseDelete
    };
  }
};
</script>