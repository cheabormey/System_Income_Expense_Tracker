<template>
  <div class="mx-5 font-noto">
    <button
      @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Products</h1>

      <div v-if="!isMobileScreen" class="hidden md:flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Page rows</span>
          <select
            v-model="pageSize"
            :disabled="searchQuery !== ''"
            class="w-28 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9717] disabled:bg-gray-100"
          >
            <option v-for="size in optionPageSize" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <div class="w-full md:w-96">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9717]"
          />
        </div>

        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <PlusIcon class="w-5 h-5" />
          <span>Add New Product</span>
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
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Win Multiplier</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(product, index) in productData" :key="product._id" :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">
              <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-mono">
                x{{ product.winMultiplier || 0 }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-600 italic text-sm">{{ product.description || '-' }}</td>

            <td class="px-3 py-2 whitespace-nowrap">
              <button
                class="inline-flex items-center justify-center w-6 h-6 rounded-md"
                :class="product.status ? 'text-green-600' : 'text-red-600'"
                @click="handleStatusToggle(product)"
              >
                <i class="pi" :class="product.status ? 'pi-check-circle' : 'pi-times-circle'" />
              </button>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button class="p-2 text-[#045B1B]" @click="openEditForm(product)"><i class="pi pi-pencil" /></button>
              <button class="p-2 text-red-600" @click="confirmDelete(product)"><i class="pi pi-trash" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="mt-5">
      <Pagination
        :currentPage="currentPage"
        :limitedPerPage="pageSize"
        :searchQuery="searchQuery"
        collectionName="Product"
        @onEmitDataFromPagination="handleListenToPagination"
        @onEmitIsLoading="handleListenIsLoading"
      />
    </div>

    <ProductFormModal
      :visible="showFormModal"
      :is-edit-doc="isEditDoc"
      :doc="selectedProduct"
      @onClose="closeForm"
    />

    <DeleteConfirmation
      :visible="showDeleteModal"
      :deleteId="deleteId"
      :elementName="selectedProduct?.name || ''"
      collectionName="Product"
      @onCloseDelete="handleCloseDelete"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ProductFormModal from '../components/Modal/ProductForm.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'ProductView',
  components: {
    ProductFormModal,
    Pagination,
    DeleteConfirmation,
    ChevronLeftIcon,
    PlusIcon
  },

  setup() {
    const router = useRouter();
    const productData = ref([]);
    const isLoading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(50);
    const searchQuery = ref('');
    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedProduct = ref(null);
    const showDeleteModal = ref(false);
    const deleteId = ref(null);
    const isMobileScreen = ref(false);

    const handleCheckScreenSize = () => { isMobileScreen.value = window.innerWidth < 768; };
    onMounted(() => { 
        handleCheckScreenSize(); 
        window.addEventListener('resize', handleCheckScreenSize); 
    });
    onBeforeUnmount(() => window.removeEventListener('resize', handleCheckScreenSize));

    const handleListenToPagination = (items) => { productData.value = items || []; };
    const handleListenIsLoading = (status) => { isLoading.value = status; };

    const openAddForm = () => {
      isEditDoc.value = false;
      selectedProduct.value = null;
      showFormModal.value = true;
    };

    const openEditForm = (item) => {
      isEditDoc.value = true;
      selectedProduct.value = item;
      showFormModal.value = true;
    };

    const closeForm = (status) => {
      showFormModal.value = false;
      if (status !== 'close') searchQuery.value = '';
    };

    const confirmDelete = (item) => {
      deleteId.value = item._id;
      selectedProduct.value = item;
      showDeleteModal.value = true;
    };

    const handleCloseDelete = (status) => {
      showDeleteModal.value = false;
      if (status === 'delete') searchQuery.value = '';
    };

    watch(searchQuery, () => { currentPage.value = 1; });

    return {
      handleNavigateBack: () => router.push('/'),
      productData, isLoading, currentPage, pageSize, searchQuery,
      showFormModal, isEditDoc, selectedProduct, showDeleteModal, deleteId, isMobileScreen,
      handleListenToPagination, handleListenIsLoading, openAddForm, openEditForm, closeForm,
      confirmDelete, handleCloseDelete
    };
  },
};
</script>