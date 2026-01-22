<template>
  <div class="mx-5 font-noto">
    <!-- Back Button -->
    <button @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <!-- Main Container -->
    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Categories</h1>

      <!-- Controls: Responsive Layout -->
      <!-- Desktop / Tablet -->
      <div v-if="!isMobileScreen" class="hidden md:flex flex-wrap items-end justify-between gap-4">
        <!-- Page Rows -->
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Rows</span>
          <Select v-model="pageSize" :options="optionPageSize" placeholder="Select size"
            class="w-24 custom-row-select" />
        </div>

        <!-- Search -->
        <div class="w-full md:w-96">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search</span>
          <input v-model="searchQuery" type="text" placeholder="Search by name or description"
            class="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />
        </div>

        <!-- Add Button -->
        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add New Category</span>
        </button>
      </div>

      <!-- Mobile Controls -->
      <div v-else class="block md:hidden space-y-4">
        <!-- Search -->
        <div>
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search</span>
          <input v-model="searchQuery" type="text" placeholder="Search by name or description"
            class="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />
        </div>

        <!-- Page Rows + Add Button -->
        <div class="flex justify-between items-end gap-4">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Rows</span>
          <Select v-model="pageSize" :options="optionPageSize" placeholder="Select size"
            class="w-24 custom-row-select" />
        </div>

          <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
              <path
                d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span>Add New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div v-if="!isMobileScreen" class="bg-white rounded-lg shadow overflow-x-auto border relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Created By</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Created At</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(category, index) in categoryData" :key="category._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 text-center text-gray-700">
              {{ getUserName(category.createdBy) }}
            </td>
            <td class="px-6 py-4 text-center text-gray-700">
              {{ formatDate(category.createdAt) }}
            </td>




            <!-- Status Toggle Button -->
            <td class="px-3 py-2 whitespace-nowrap">
              <button
                class="inline-flex items-center justify-center w-6 h-6 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82B215] focus-visible:ring-offset-2"
                :class="{
                  'text-green-600 hover:bg-green-50': category.status,
                  'text-red-600 hover:bg-red-50': !category.status,
                }" @click="handlePopStatusChange(category)">
                <i class="pi" :class="{ 'pi-check-circle': category.status, 'pi-times-circle': !category.status }" />
              </button>
            </td>

            <!-- Actions -->
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

    <!-- Mobile Card View -->
    <div v-else class="block md:hidden">
      <div class="grid grid-cols-1 gap-4">
        <CategoryCard :items="categoryData" :is-loading="isLoading" @onEdit="openEditForm" @onDelete="confirmDelete"
          @onStatusChange="handlePopStatusChange" />
      </div>

      <!-- Empty State for Mobile -->
      <div v-if="categoryData.length === 0 && !isLoading" class="text-center py-10 text-gray-500">
        No categories found.
      </div>
    </div>

    <!-- Pagination (always visible) -->
    <div class="mt-5">
      <Pagination :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchQuery"
        collectionName="Category" @onEmitDataFromPagination="handleListenToPagination"
        @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage" />
    </div>

    <!-- Modals -->
    <CategoryFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedCategory" @onClose="closeForm" />

    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedCategory?.name || ''"
      collectionName="Category" displayLabel="Category" :isLastRecordOnPage="isLastRecordOnPage"
      @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import CategoryFormModal from '../components/Modal/CategoryForm.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';
import CategoryCard from '@/mobile/CategoryCard.vue';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import formatDate from "@/composable/formatDate";

export default {
  name: 'CategoryView',
  components: {
    CategoryFormModal,
    Pagination,
    DeleteConfirmation,
    CategoryCard,
    ChevronLeftIcon,
  },

  setup() {
    const router = useRouter();

    // Reactive state
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

    const userData = ref([]);

    const showDeleteModal = ref(false);
    const deleteId = ref(null);

    // Mobile screen detection
    const isMobileScreen = ref(false);

    const handleCheckScreenSize = () => {
      if (typeof window !== 'undefined') {
        isMobileScreen.value = window.innerWidth < 768; // md breakpoint
      }
    };

    onMounted(() => {
      handleCheckScreenSize();
      window.addEventListener('resize', handleCheckScreenSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleCheckScreenSize);
    });

    // Pagination listeners
    const handleListenToPagination = (items) => {
      categoryData.value = items || [];
    };

    const handleListenIsLoading = (status) => {
      isLoading.value = status;
    };

    const handleListenIsLastRecordOnPage = (status) => {
      isLastRecordOnPage.value = status;
    };

    // Form actions
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

    // Delete actions
    const confirmDelete = (item) => {
      deleteId.value = item._id;
      isLastRecordOnPage.value = categoryData.value.length === 1 && currentPage.value > 1;
      showDeleteModal.value = true;
    };

    const handleCloseDelete = (status) => {
      showDeleteModal.value = false;
      if (status === 'delete') {
        searchQuery.value = '';
      }
    };

    const getUserName = (id) => {
      return id ? "User" : "Unknown User";
    };



    const handlePopStatusChange = (category) => {
      // Emit or handle status toggle here
      // You might want to call an API or emit an event
      console.log('Toggle status for:', category);
    };

    // Watch search query to reset page
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
      isMobileScreen,

      // Methods
      handleListenToPagination,
      handleListenIsLoading,
      handleListenIsLastRecordOnPage,
      openAddForm,
      openEditForm,
      closeForm,
      confirmDelete,
      handleCloseDelete,
      handlePopStatusChange,
      handleCheckScreenSize,
      getUserName,
      formatDate
    };
  },
};
</script>

<style scoped>
.btn-add-new {
  @apply bg-[#5B9717] text-white px-4 py-2 rounded-md hover:bg-[#4a7c13] transition flex items-center;
}
</style>