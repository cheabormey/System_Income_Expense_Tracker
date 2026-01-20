<template>
  <div class="mx-5 font-noto">
    <button @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Customer Directory</h1>

      <div
        :class="!isMobileScreen ? 'hidden md:flex flex-wrap items-end justify-between gap-4' : 'block md:hidden space-y-4'">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Rows</span>
          <select v-model="pageSize" class="w-24 border rounded-md px-3 py-2 text-sm focus:ring-[#5B9717]">
            <option v-for="size in optionPageSize" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <div class="flex-1 max-w-lg">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search</span>
          <input v-model="searchQuery" type="text" placeholder="Search by name, phone or address..."
            class="w-full border rounded-md px-4 py-2 text-sm focus:ring-[#5B9717]" />
        </div>


        <!-- Add Button -->
        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add Customer</span>
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
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Customer Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Phone / Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Current Balance</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Created By</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Created At</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(customer, index) in customerData" :key="customer._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ customer.username }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="flex items-center gap-1"><i class="pi pi-phone text-[10px]"></i> {{ customer.phoneNumber ||
                '-' }}</div>
              <div class="text-xs text-gray-400 truncate max-w-[200px]">{{ customer.address || 'No address' }}</div>
            </td>
            <td class="px-6 py-4">
              <span :class="customer.balance < 0 ? 'text-red-600' : 'text-green-600'" class="font-mono font-bold">
                {{ customer.balance !== null ? customer.balance.toLocaleString() : '0.00' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center text-sm text-gray-600">
              {{ getUserName(customer.createdBy) }}
            </td>
            <td class="px-6 py-4 text-center text-sm text-gray-600">
              {{ formatDate(customer.createdAt) }}
            </td>

            <td class="px-3 py-2">
              <button @click="handleToggleStatus(customer)"
                :class="customer.status ? 'text-green-600' : 'text-red-600'">
                <i class="pi" :class="customer.status ? 'pi-check-circle' : 'pi-times-circle'" />
              </button>
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="openEditForm(customer)" class="p-2 text-[#045B1B]"><i class="pi pi-pencil" /></button>
              <button @click="confirmDelete(customer)" class="p-2 text-red-600"><i class="pi pi-trash" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <CustomerCard :items="customerData" :is-loading="isLoading" @onEdit="openEditForm" @onDelete="confirmDelete" />
    </div>

    <Pagination class="mt-5" :currentPage="currentPage" :limitedPerPage="pageSize" collectionName="Customer"
      @onEmitDataFromPagination="handlePaginationData" />

    <CustomerFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedCustomer" @onClose="closeForm" />
    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedCustomer?.username || ''"
      collectionName="Customer" @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon, PlusIcon } from '@heroicons/vue/24/outline'
import CustomerFormModal from '../components/Modal/CustomerForm.vue'
import CustomerCard from '@/mobile/CustomerCard.vue'
import Pagination from '@/components/Pagination.vue'
import DeleteConfirmation from '@/components/DeleteComfirmation.vue'
import formatDate from '@/composable/formatDate'

export default {
  components: {
    ChevronLeftIcon,
    PlusIcon,
    CustomerFormModal,
    CustomerCard,
    Pagination,
    DeleteConfirmation
  },

  setup() {
    const router = useRouter()

    const customerData = ref([])
    const isLoading = ref(false)
    const isMobileScreen = ref(false)
    const searchQuery = ref('')
    const pageSize = ref(50)
    const optionPageSize = [50, 100, 200]
    const showFormModal = ref(false)
    const isEditDoc = ref(false)
    const selectedCustomer = ref(null)
    const showDeleteModal = ref(false)
    const deleteId = ref(null)

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

    const handlePaginationData = (items) => {
      customerData.value = items
    }

    const openAddForm = () => {
      isEditDoc.value = false
      selectedCustomer.value = null
      showFormModal.value = true
    }

    const openEditForm = (cust) => {
      isEditDoc.value = true
      selectedCustomer.value = cust
      showFormModal.value = true
    }

    const confirmDelete = (cust) => {
      deleteId.value = cust._id
      selectedCustomer.value = cust
      showDeleteModal.value = true
    }

    const closeForm = () => {
      showFormModal.value = false
    }

    const handleCloseDelete = () => {
      showDeleteModal.value = false
    }
    const getUserName = (id) => {
      return id ? "User" : "Unknown User";
    };

    const handleNavigateBack = () => {
      router.push('/')
    }

    return {
      // state
      customerData,
      isLoading,
      isMobileScreen,
      searchQuery,
      pageSize,
      optionPageSize,
      showFormModal,
      isEditDoc,
      selectedCustomer,
      showDeleteModal,
      deleteId,

      // methods
      handlePaginationData,
      openAddForm,
      openEditForm,
      confirmDelete,
      closeForm,
      handleCloseDelete,
      handleNavigateBack,
      getUserName,
      // utils
      formatDate
    }
  }
}
</script>
