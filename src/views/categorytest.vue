<template>
  <div class="mx-5 font-noto">
    <!-- Back Button -->
    <button
      @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <!-- Header & Filters -->
    <div
      class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]"
    >
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">
        Categories
      </h1>

      <!-- Desktop / Tablet -->
      <div v-show="!isMobileScreen" class="hidden md:flex flex-wrap items-end justify-between gap-3">
        <!-- Page Rows -->
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Page rows</span>
          <select
            v-model="pageSize"
            :disabled="searchQuery !== ''"
            class="w-28 border rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#5B9717]
              disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option v-for="size in optionPageSize" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>

        <!-- Search -->
        <div class="w-full md:max-w-sm">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or description"
            class="w-full border rounded-md px-4 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#5B9717]"
          />
        </div>

        <!-- Add Button -->
        <div class="flex items-end">
          <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
              <path
                d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
              />
            </svg>
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      <!-- Mobile -->
      <div v-show="isMobileScreen" class="block md:hidden space-y-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full border rounded-md px-3 py-2"
        />

        <div class="flex justify-between items-center">
          <select
            v-model="pageSize"
            :disabled="searchQuery !== ''"
            class="border rounded-md px-2 py-1 text-sm"
          >
            <option v-for="size in optionPageSize" :key="size" :value="size">
              {{ size }}
            </option>
          </select>

          <button @click="openAddForm" class="btn-sub flex items-center gap-2">
            <span>➕</span>
            <span>Add new</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-show="!isMobileScreen" class="bg-white rounded-lg shadow overflow-x-auto border relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(category, index) in categoryData"
            :key="category._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'"
          >
            <td class="px-6 py-4">{{ category.name }}</td>
            <td class="px-6 py-4">{{ category.description || '-' }}</td>

            <td class="px-6 py-4">
              <button
                @click="handlePopStatusChange(category)"
                :class="category.status ? 'text-green-600' : 'text-red-600'"
              >
                {{ category.status ? 'Active' : 'Inactive' }}
              </button>
            </td>

            <td class="px-6 py-4 text-center">
              <button @click="openEditForm(category)" class="mr-2 text-[#045B1B]">✏️</button>
              <button @click="confirmDelete(category)" class="text-red-600">🗑️</button>
            </td>
          </tr>

          <tr v-if="categoryData.length === 0 && !isLoading">
            <td colspan="4" class="py-10 text-center text-gray-500">
              No categories found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card -->
    <div v-show="isMobileScreen" class="mt-4">
      <CategoryCard
        :items="categoryData"
        :is-loading="isLoading"
        @onEdit="openEditForm"
        @onDelete="confirmDelete"
        @onStatusChange="handlePopStatusChange"
      />
    </div>

    <!-- Pagination -->
    <div class="mt-5">
      <Pagination
        :currentPage="currentPage"
        :limitedPerPage="pageSize"
        :searchQuery="searchQuery"
        collectionName="Category"
        @onEmitDataFromPagination="handleListenToPagination"
        @onEmitIsLoading="handleListenIsLoading"
        @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
      />
    </div>

    <!-- Modals -->
    <CategoryFormModal
      :visible="showFormModal"
      :is-edit-doc="isEditDoc"
      :doc="selectedCategory"
      @onClose="closeForm"
    />

    <DeleteConfirmation
      :visible="showDeleteModal"
      :deleteId="deleteId"
      :elementName="selectedCategory?.name || ''"
      collectionName="Category"
      :isLastRecordOnPage="isLastRecordOnPage"
      @onCloseDelete="handleCloseDelete"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import Pagination from '@/components/Pagination.vue'
import CategoryFormModal from '@/components/Modal/CategoryForm.vue'
import DeleteConfirmation from '@/components/DeleteComfirmation.vue'
import CategoryCard from '@/mobile/CategoryCard.vue'

export default {
  name: 'CategoryView',
  components: {
    Pagination,
    CategoryFormModal,
    DeleteConfirmation,
    CategoryCard,
    ChevronLeftIcon
  },

  setup () {
    const router = useRouter()

    const categoryData = ref([])
    const isLoading = ref(false)
    const isLastRecordOnPage = ref(false)

    const currentPage = ref(1)
    const pageSize = ref(50)
    const optionPageSize = ref([50, 100, 200, 500])

    const searchQuery = ref('')
    const searchText = ref('')

    const showFormModal = ref(false)
    const isEditDoc = ref(false)
    const selectedCategory = ref(null)

    const showDeleteModal = ref(false)
    const deleteId = ref(null)

    const isMobileScreen = ref(false)

    const handleCheckScreenSize = () => {
      isMobileScreen.value = window.innerWidth < 768
    }

    onMounted(() => {
      handleCheckScreenSize()
      window.addEventListener('resize', handleCheckScreenSize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleCheckScreenSize)
    })

    watch(searchQuery, val => {
      searchText.value = val
      currentPage.value = 1
    })

    const openAddForm = () => {
      isEditDoc.value = false
      selectedCategory.value = null
      showFormModal.value = true
    }

    const openEditForm = category => {
      isEditDoc.value = true
      selectedCategory.value = category
      showFormModal.value = true
    }

    const closeForm = () => {
      showFormModal.value = false
      searchQuery.value = ''
    }

    const confirmDelete = item => {
      deleteId.value = item._id
      showDeleteModal.value = true
    }

    const handleCloseDelete = () => {
      showDeleteModal.value = false
      searchQuery.value = ''
    }

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

      handleListenToPagination: items => (categoryData.value = items || []),
      handleListenIsLoading: v => (isLoading.value = v),
      handleListenIsLastRecordOnPage: v => (isLastRecordOnPage.value = v),

      openAddForm,
      openEditForm,
      closeForm,
      confirmDelete,
      handleCloseDelete,
      handleCheckScreenSize
    }
  }
}
</script>
