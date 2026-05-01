<template>
  <div
    class="w-full min-h-screen p-4 sm:p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 bg-white font-noto animate-fade-up animate-once animate-duration-[400ms]"
  >
    <!-- Top Header -->
    <div class="relative flex items-center justify-between">
      <div class="w-[95px] sm:w-[110px] flex justify-start">
        <button
          @click="handleNavigateBack"
          class="group relative flex items-center gap-2 px-3 py-2 rounded-xl
          bg-white/80 backdrop-blur-md border border-white/50
          text-[#045B1B] text-xs sm:text-sm font-medium
          shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
        >
          <div
            class="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
            bg-[#5B9717]/20 group-hover:bg-[#5B9717]/40 border border-[#5B9717]
            transition-all duration-300"
          >
            <i class="pi pi-arrow-left text-[10px] sm:text-xs"></i>
          </div>
          <span>Back</span>
        </button>
      </div>

      <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span class="whitespace-nowrap text-xl md:text-2xl text-[#045B1B] font-bold">
          Product List
        </span>
      </div>

      <div class="w-[95px] sm:w-[110px]"></div>
    </div>

    <!-- Header Filter -->
    <div
      class="space-y-5 py-6 rounded-lg bg-white shadow-sm p-4 md:p-6 my-4 border-2 border-dashed border-[#5B9717]"
    >
      <!-- Desktop -->
      <div class="hidden md:flex flex-wrap items-end justify-between gap-4">
        <!-- Page rows -->
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Page rows</span>
          <Select
            v-model="pageSize"
            :options="optionPageSize"
            optionLabel="value"
            optionValue="value"
            :disabled="searchQuery !== ''"
            class="w-24"
            size="small"
          />
        </div>

        <!-- Search -->
        <div class="flex-1 min-w-[220px] max-w-md">
          <InputText
            v-model="searchQuery"
            placeholder="Search by product name..."
            class="w-full"
            size="small"
          />
        </div>

        <!-- Add Button -->
        <!-- <div class="flex justify-end w-full md:w-auto">
          <button
            @click="openAddForm"
            class="btn-add-new flex items-center justify-center gap-2 w-full md:w-auto
            bg-[#5B9717] hover:bg-[#4a7c13] text-white px-4 py-2 rounded-lg transition"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div> -->
                  <div class="flex justify-end w-full md:w-auto">
            <button  @click="openAddForm"
              class="btn-add-new flex items-center justify-center gap-2 w-full md:w-auto">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>{{ $t('Add new') }}</span>
            </button>
          </div>
      </div>

      <!-- Mobile -->
      <div class="block md:hidden space-y-3">
        <InputText
          v-model="searchQuery"
          placeholder="Search by product name..."
          class="w-full"
          size="small"
        />

        <div class="flex items-center justify-between gap-3">
          <div class="flex flex-col">
            <span class="text-xs font-medium text-gray-700 mb-1">Page rows</span>
            <Select
              v-model="pageSize"
              :options="optionPageSize"
              optionLabel="value"
              optionValue="value"
              :disabled="searchQuery !== ''"
              class="w-20"
              size="small"
            />
          </div>

          <button
            @click="openAddForm"
            class="flex items-center gap-1 bg-[#5B9717] border rounded-lg text-white px-3 py-2 text-xs whitespace-nowrap"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div
      v-if="!isMobileScreen"
      class="hidden md:block w-full max-h-[720px] overflow-auto scrollbar relative rounded-lg text-sm border"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center z-10 bg-white/50 rounded-lg"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="w-full" :class="{ 'opacity-50': isLoading }">
        <thead class="font-bold bg-primary-light text-white sticky top-0 z-10">
          <tr class="[&>*]:border [&>*]:px-2 [&>*]:py-3 [&>*]:text-center">
            <th>N</th>
            <th>Product Name</th>
            <th>Win Multiplier</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>  
          </tr>
        </thead>

        <tbody v-if="productData.length">
          <tr
            v-for="(product, index) in productData"
            :key="product._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'"
            class="[&>*]:border [&>*]:p-2"
          >
            <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>

            <td class="text-center font-medium">{{ product.name }}</td>

            <td class="text-center">
              <span class="px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-mono">
                x{{ product.winMultiplier || 0 }}
              </span>
            </td>

            <td class="text-center text-gray-600">
              {{ product.description || "-" }}
            </td>

            <td class="text-center">
              <button
                @click="handleStatusToggle(product)"
                class="px-4 py-1.5 flex mx-auto items-center gap-1.5 text-xs sm:text-sm font-semibold rounded-2xl backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105"
                :class="product.status ? 'text-green-600' : 'text-red-600'"
              >
                <i
                  :class="product.status ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                ></i>
                <span>{{ product.status ? "Active" : "Inactive" }}</span>
              </button>
            </td>

            <td class="space-x-3 text-center">
              <button
                @click="openEditForm(product)"
                class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition"
              >
                <i class="pi pi-pencil text-sm" />
              </button>

              <button
                @click="confirmDelete(product)"
                class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition"
              >
                <i class="pi pi-trash text-sm" />
              </button>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="6" class="py-20 text-center text-gray-400 text-lg font-semibold">
              No Products Found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card -->
    <div v-if="isMobileScreen" class="grid gap-4 md:hidden">
      <ProductCard
        :items="productData"
        :isLoading="isLoading"
        @onEdit="openEditForm"
        @onDelete="confirmDelete"
        @onStatusChange="handleStatusToggle"
      />
    </div>

    <!-- Pagination -->
    <div class="mt-5">
      <Pagination
        :key="refreshKey"
        :currentPage="currentPage"
        :limitedPerPage="pageSize"
        :searchQuery="searchText"
        collectionName="Product"
        @onEmitDataFromPagination="handleListenToPagination"
        @onEmitIsLoading="handleListenIsLoading"
      />
    </div>

    <!-- Modals -->
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
      @onSuccess="handleDeleteSuccess"
    />

    <Toast />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { PlusIcon } from "@heroicons/vue/24/outline";
import ProductFormModal from "../components/Modal/ProductForm.vue";
import ProductCard from "@/mobile/ProductCard.vue";
import Pagination from "@/components/Pagination.vue";
import DeleteConfirmation from "@/components/DeleteComfirmation.vue";
import Toast from "primevue/toast";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import { useAppToast } from "@/helper/toastHelper";
import { useDocument } from "@/composable/useDocument";

export default {
  name: "ProductPage",
  components: {
    PlusIcon,
    ProductFormModal,
    ProductCard,
    Pagination,
    DeleteConfirmation,
    Toast,
    Select,
    InputText,
  },

  setup() {
    const router = useRouter();
    const { showToast } = useAppToast();
    const { updateDoc } = useDocument();

    const productData = ref([]);
    const isLoading = ref(false);
    const isMobileScreen = ref(false);

    const searchQuery = ref("");
    const searchText = ref("");

    const pageSize = ref(50);
    const currentPage = ref(1);
    const optionPageSize = ref(
      [50, 100, 200, 500, 1000].map((v) => ({ value: v }))
    );

    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedProduct = ref(null);

    const showDeleteModal = ref(false);
    const deleteId = ref(null);

    const refreshKey = ref(0);

    const handleCheckScreenSize = () => {
      isMobileScreen.value = window.innerWidth < 768;
    };

    onMounted(() => {
      handleCheckScreenSize();
      window.addEventListener("resize", handleCheckScreenSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleCheckScreenSize);
    });

    watch(searchQuery, (val) => {
      searchText.value = val;
      currentPage.value = 1;
    });

    watch(pageSize, () => {
      currentPage.value = 1;
    });

    const triggerRefresh = () => {
      refreshKey.value += 1;
    };

    const openAddForm = () => {
      isEditDoc.value = false;
      selectedProduct.value = null;
      showFormModal.value = true;
    };

    const openEditForm = (product) => {
      isEditDoc.value = true;
      selectedProduct.value = product;
      showFormModal.value = true;
    };

    const confirmDelete = (product) => {
      deleteId.value = product._id;
      selectedProduct.value = product;
      showDeleteModal.value = true;
    };

    const handleStatusToggle = async (product) => {
      try {
        const payload = { fields: { status: !product.status } };
        await updateDoc("Product", product._id, payload);
        showToast("update", "Product status updated successfully.");
        triggerRefresh();
      } catch (error) {
        showToast("error", "Failed to update product status.");
      }
    };

    const closeForm = (action) => {
      showFormModal.value = false;

      if (action === "add") {
        showToast("create");
        triggerRefresh();
      }

      if (action === "update") {
        showToast("update");
        triggerRefresh();
      }
    };

    const handleCloseDelete = () => {
      showDeleteModal.value = false;
    };

    const handleDeleteSuccess = () => {
      showDeleteModal.value = false;
      showToast("delete");
      triggerRefresh();
    };

    const handleNavigateBack = () => router.push("/");

    const handleListenToPagination = (items) => {
      productData.value = items || [];
      isLoading.value = false;
    };

    const handleListenIsLoading = (status) => {
      isLoading.value = status;
    };

    return {
      productData,
      isLoading,
      isMobileScreen,
      searchQuery,
      searchText,
      pageSize,
      currentPage,
      optionPageSize,
      showFormModal,
      isEditDoc,
      selectedProduct,
      showDeleteModal,
      deleteId,
      refreshKey,
      openAddForm,
      openEditForm,
      confirmDelete,
      handleStatusToggle,
      closeForm,
      handleCloseDelete,
      handleDeleteSuccess,
      handleNavigateBack,
      handleListenToPagination,
      handleListenIsLoading,
    };
  },
};
</script>