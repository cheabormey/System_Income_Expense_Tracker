<template>
  <div class="mx-4 md:mx-5 font-noto">
    <button @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-5 md:p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">
        Customer Directory
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <span class="text-sm font-medium text-gray-700 mb-1 block">Rows</span>
          <Select v-model="pageSize" :options="optionPageSize" class="w-28" />
        </div>

        <div class="md:col-span-1">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search</span>
          <input v-model="searchQuery" type="text" placeholder="Search customer..."
            class="w-full border rounded-md px-4 py-2 text-sm" />
        </div>

        <button class="btn-add-new flex items-center justify-center gap-2 w-full md:w-auto" @click="openAddForm">
          ➕ Add Customer
        </button>
      </div>
    </div>

    <div v-if="!isMobileScreen" class="bg-white rounded-lg shadow overflow-x-auto border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Head -->
          <thead class="bg-[#045B1B] text-white text-xs uppercase">
            <tr>
              <th class="px-4 py-3 text-left">N</th>
              <th class="px-6 py-3 text-left">Name</th>
              <th class="px-6 py-3 text-left">Phone / Address</th>
              <th class="px-6 py-3 text-left">Permissions</th>
              <th class="px-6 py-3 text-center">Status</th>
              <th class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(customer, index) in customerData" :key="customer._id"
              class="hover:bg-gray-50 transition-colors">
              <!-- Index -->
              <td class="px-4 py-3 text-sm font-medium">
                {{ ((currentPage - 1) * pageSize) + index + 1 }}
              </td>

              <!-- Name -->
              <td class="px-6 py-3 font-semibold">
                {{ customer.username }}
              </td>

              <!-- Phone & Address -->
              <td class="px-6 py-3 text-sm">
                <div>{{ customer.phoneNumber || '-' }}</div>
                <div class="text-xs text-gray-400 break-words">{{ customer.address || '-' }}</div>
              </td>

              <!-- Permissions (Nested Table) -->
              <td class="px-6 py-3">
                <div class="overflow-x-auto">
                  <table class="w-full border rounded-md text-xs">
                    <thead class="bg-gray-100">
                      <tr>
                        <th class="px-2 py-1">Type</th>
                        <th class="px-2 py-1">Product</th>
                        <th class="px-2 py-1">%</th>
                        <th class="px-2 py-1">x</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in customer.percentages" :key="i" class="border-t">
                        <td class="px-2 py-1">{{ row.productType }}</td>
                        <td class="px-2 py-1">{{ getProductName(row.productId) }}</td>
                        <td class="px-2 py-1 font-bold">{{ row.percentages }}%</td>
                        <td class="px-2 py-1 font-mono">x{{ row.winMultiplier }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>

              <!-- Status Toggle -->
              <td class="px-6 py-3 text-center">
                <button
                  class="inline-flex items-center justify-center w-6 h-6 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82B215]"
                  :class="customer.status ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'"
                  @click="handlePopStatusChange(customer)">
                  <i class="pi" :class="customer.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
                </button>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex justify-center gap-2">
                <button
                  class="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#045B1B] hover:bg-[#f9faf5]"
                  @click="openEditForm(customer)">
                  <i class="pi pi-pencil text-base" />
                </button>
                <button class="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:bg-red-50"
                  @click="confirmDelete(customer)">
                  <i class="pi pi-trash text-base" />
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="customerData.length === 0 && !isLoading">
              <td colspan="6" class="text-center py-10 text-gray-400 italic bg-gray-50 rounded-xl">
                No customers found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div v-else>
      <CustomerCard :items="customerData" :isLoading="false" :getProductName="getProductName" @onEdit="openEditForm"
        @onDelete="confirmDelete" />

    </div>

    <Pagination class="mt-5" :currentPage="currentPage" :searchQuery="searchText" :limitedPerPage="Number(pageSize)"
      collectionName="Customer" @onEmitDataFromPagination="handlePaginationData" />

    <CustomerFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedCustomer" @onClose="closeForm" />

    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" collectionName="Customer"
      @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import CustomerFormModal from '../components/Modal/CustomerForm.vue'
import Pagination from '@/components/Pagination.vue'
import DeleteConfirmation from '@/components/DeleteComfirmation.vue'
import CustomerCard from '@/mobile/CustomerCard.vue'
import { getDocument } from '@/composable/getDocument'

export default {
  components: {
    ChevronLeftIcon,
    CustomerFormModal,
    Pagination,
    DeleteConfirmation,
    CustomerCard
  },

  setup() {
    const router = useRouter()
    const { getDocs } = getDocument()

    const customerData = ref([])
    const productMap = ref({})
    const pageSize = ref(50)
    const currentPage = ref(1)
    const searchQuery = ref('')
    const searchText = ref('')
    const optionPageSize = [50, 100, 200]

    const showFormModal = ref(false)
    const isEditDoc = ref(false)
    const selectedCustomer = ref(null)
    const showDeleteModal = ref(false)
    const deleteId = ref(null)

    const isMobileScreen = ref(window.innerWidth < 768)

    // HANDLE RESIZE
    const handleResize = () => {
      isMobileScreen.value = window.innerWidth < 768
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })



    const mapProducts = async () => {
      const res = await getDocs('Product')
      if (res?.data) {
        res.data.forEach(p => {
          productMap.value[p._id] = p.name
        })
      }
    }

    onMounted(mapProducts)

    const getProductName = id => productMap.value[id] || '-'

    // PAGINATION HANDLER
    const handlePaginationData = (items, page) => {
      customerData.value = items
      currentPage.value = page
    }

    // FORM METHODS
    const openAddForm = () => {
      isEditDoc.value = false
      selectedCustomer.value = null
      showFormModal.value = true
    }

    const openEditForm = cust => {
      isEditDoc.value = true
      selectedCustomer.value = cust
      showFormModal.value = true
    }

    const confirmDelete = cust => {
      deleteId.value = cust._id
      showDeleteModal.value = true
    }

    watch(
      searchQuery,
      (newValue) => {
        searchText.value = newValue;
        currentPage.value = 1;
      },
      { immediate: true }
    );


    return {
      customerData,
      pageSize,
      currentPage,
      searchQuery,
      searchText,
      optionPageSize,
      showFormModal,
      isEditDoc,
      selectedCustomer,
      showDeleteModal,
      deleteId,
      isMobileScreen,
      handlePaginationData,
      openAddForm,
      openEditForm,
      confirmDelete,
      closeForm: () => (showFormModal.value = false),
      handleCloseDelete: () => (showDeleteModal.value = false),
      handleNavigateBack: () => router.push('/'),
      getProductName
    }
  }
}
</script>