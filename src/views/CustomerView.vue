<template>
  <div
    class="w-full min-h-screen p-4 sm:p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 font-noto animate-fade-up animate-once animate-duration-[400ms] ">
    <div class="font-NotoSerifKhmer"
      v-animateonscroll="{ enterClass: 'animate-scalein', leaveClass: 'animate-fadeout' }">

      <!-- Responsive Top Header -->
      <div class="relative flex items-center justify-between mb-6">
        <!-- Left: Back Button -->
        <!-- <div class="w-[95px] sm:w-[110px] flex justify-start">
          <button @click="handleNavigateBack"
            class="group relative flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/50 text-primary-dark text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:bg-white transition-all duration-300">
            <div
              class="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-focus/20 group-hover:bg-primary-focus/50 border border-primary-focus transition-all duration-300">
              <i class="pi pi-arrow-left text-[10px] sm:text-xs"></i>
            </div>
            <span class="tracking-wide hidden xs:block sm:block">Back</span>
          </button>
        </div> -->
        <div class="w-[95px] sm:w-[110px] flex justify-start">
          <button @click="handleNavigateBack" class="group relative flex items-center gap-2 px-3 py-2 rounded-xl
             text-primary-dark text-xs sm:text-sm font-medium hover:shadow-md hover:bg-white
             transition-all duration-300">
            <!-- Icon -->
            <div class="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
               bg-primary-focus/20 group-hover:bg-primary-focus/50 border border-primary-focus
               transition-all duration-300">
              <i class="pi pi-arrow-left text-[10px] sm:text-xs"></i>
            </div>

            <!-- Text -->
            <span class="tracking-wide hidden xs:block sm:block">
              {{ $t('Back') }}
            </span>
          </button>
        </div>

        <!-- Center: Title -->
        <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span class="whitespace-nowrap text-xl md:text-2xl text-primary-dark">Customer Directory</span>
        </div>

        <!-- Right: Balance -->
        <div class="w-[95px] sm:w-[110px]"></div>
      </div>

      <!-- Header: Rows + Search + Add Button -->
      <div class="space-y-5 py-6 rounded-lg bg-white shadow-sm p-4 md:p-6 my-4 border-2 border-dashed border-[#5B9717]">
        <!-- Desktop + Tablet -->
        <div class="hidden md:flex flex-wrap items-end justify-between gap-4">
          <!-- Page Size -->
          <div class="flex flex-col">
            <span class="label mb-1">Page rows</span>
            <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
              :disabled="searchQuery !== ''" class="w-24" size="small" />
          </div>

          <!-- Search -->
          <div class="flex-1 min-w-[200px] max-w-md">
            <InputText v-model="searchQuery" placeholder="Search customer..." class="w-full" size="small" />
          </div>

          <!-- Add Button -->
          <div class="flex justify-end w-full md:w-auto">
            <button @click="handlePopOpenform"
              class="btn-add-new flex items-center justify-center gap-2 w-full md:w-auto">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        <!-- Mobile -->
        <div class="block md:hidden space-y-3">
          <!-- Search -->
          <InputText v-model="searchQuery" placeholder="Search customer..." class="w-full" size="small" />

          <!-- Bottom row -->
          <div class="flex items-center justify-between gap-3">
            <!-- Page Size -->
            <div class="flex flex-col">
              <span class="label text-xs mb-1">Page rows</span>
              <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
                :disabled="searchQuery !== ''" class="w-20" size="small" />
            </div>

            <!-- Add Button -->
            <button @click="handlePopOpenform"
              class="flex items-center gap-1 bg-[#5B9717] border border-primary-border rounded-lg text-white px-3 py-2 hover:bg-[#045B1B]/80 text-xs whitespace-nowrap">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>

<!-- Desktop Table -->
<div v-if="!isMobileScreen" class="hidden md:block w-full">
  <div
    class="relative w-full overflow-x-auto overflow-y-auto max-h-[720px]
           rounded-2xl border border-gray-200 bg-[#f9fafb] shadow-sm">

    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-[#82B215] border-t-transparent">
      </div>
    </div>

    <!-- Main Table -->
    <table
      class="w-full table-auto text-sm border-separate border-spacing-0"
      :class="{ 'opacity-50 pointer-events-none': isLoading }">

      <!-- Header -->
      <thead
        class="sticky top-0 z-10 bg-gradient-to-r from-[#045B1B] via-[#2F7D19] to-[#5B9717] text-white text-xs uppercase">
        <tr>
          <th class="w-[60px] px-3 py-3 text-left">N</th>

          <th class="w-[180px] px-3 py-3 text-left">
            Name
          </th>

          <th class="w-[220px] px-3 py-3 text-left">
            Phone / Address
          </th>

          <th class="w-[320px] px-3 py-3 text-left">
            Permissions
          </th>

          <th class="w-[150px] px-3 py-3 text-left">
            Created By
          </th>

          <th class="w-[180px] px-3 py-3 text-left">
            Created At
          </th>

          <th class="w-[90px] px-3 py-3 text-center">
            Status
          </th>

          <th class="w-[120px] px-3 py-3 text-center">
            Actions
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody class="bg-white">
        <tr
          v-for="(customer, index) in customerData"
          :key="customer._id"
          :class="[
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
            'hover:bg-green-50/30 transition-colors duration-200'
          ]">

          <!-- N -->
          <td class="px-3 py-3 border-b border-gray-100 font-medium">
            {{ ((currentPage - 1) * pageSize) + index + 1 }}
          </td>

          <!-- Name -->
          <td class="px-3 py-3 border-b border-gray-100">
            <div class="font-semibold text-gray-900 break-words">
              {{ customer.username }}
            </div>
          </td>

          <!-- Phone / Address -->
          <td class="px-3 py-3 border-b border-gray-100">
            <div class="font-medium text-gray-800">
              {{ customer.phoneNumber || '-' }}
            </div>

            <div class="mt-1 text-xs text-gray-500 break-words">
              {{ customer.address || '-' }}
            </div>
          </td>

          <!-- Permissions -->
          <td class="px-3 py-3 border-b border-gray-100">
            <div
              v-if="customer.percentages?.length"
              class="overflow-hidden rounded-xl border border-gray-200">

              <table class="w-full text-xs">
                <thead class="bg-gray-50 text-gray-600">
                  <tr>
                    <th class="px-2 py-2 text-left">
                      Product
                    </th>

                    <th class="px-2 py-2 text-center w-[60px]">
                      %
                    </th>

                    <th class="px-2 py-2 text-center w-[60px]">
                      x
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="(row, i) in customer.percentages"
                    :key="i"
                    class="hover:bg-gray-50">

                    <td class="px-2 py-2 break-words">
                      {{ getProductName(row.productId) }}
                    </td>

                    <td class="px-2 py-2 text-center font-bold">
                      {{ row.percentages }}%
                    </td>

                    <td class="px-2 py-2 text-center font-mono">
                      x{{ row.winMultiplier }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              v-else
              class="text-xs italic text-gray-400">
              No permissions
            </div>
          </td>

          <!-- Created By -->
          <td class="px-3 py-3 border-b border-gray-100 text-gray-700">
            {{ getUserName(customer.createdBy) }}
          </td>

          <!-- Created At -->
          <td class="px-3 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
            {{ formatDateKhmer(customer.createdAt) }}
          </td>

          <!-- Status -->
          <td class="px-3 py-3 border-b border-gray-100 text-center">
            <button
              @click="handlePopStatusChange(customer)"
              class="inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#82B215]"
              :class="customer.status
                ? 'text-green-600 hover:bg-green-100'
                : 'text-red-600 hover:bg-red-100'">

              <i
                class="pi text-base"
                :class="customer.status
                  ? 'pi-check-circle'
                  : 'pi-times-circle'">
              </i>
            </button>
          </td>

          <!-- Actions -->
          <td class="px-3 py-3 border-b border-gray-100 text-center">
            <div class="flex items-center justify-center gap-2">

              <!-- Detail -->
              <button
                @click="handleViewDetail(customer)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-xl text-blue-600 hover:bg-blue-100 transition-all duration-200">
                <i class="pi pi-eye text-base"></i>
              </button>

              <!-- Delete -->
              <button
                @click="handlePopDelete(customer)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-xl text-red-600 hover:bg-red-100 transition-all duration-200">
                <i class="pi pi-trash text-base"></i>
              </button>

            </div>
          </td>

        </tr>

        <!-- Empty State -->
        <tr v-if="customerData.length === 0 && !isLoading">
          <td colspan="8" class="py-20 text-center">
            <div class="flex flex-col items-center text-gray-400">
              <i class="pi pi-inbox text-5xl mb-4"></i>
              <p class="text-xl font-semibold">
                No customers found
              </p>
              <p class="text-sm mt-1">
                There is no data to display.
              </p>
            </div>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
</div>
      <!-- Mobile Cards -->
      <!-- <div v-else class="grid gap-4 sm:grid-cols-2">
        <CustomerCard v-for="customer in customerData" :key="customer._id"
          :items="customer" :getProductName="getProductName"
          @onEdit="handlePopEdit" @onDelete="handlePopDelete" />
      </div> -->
      <!-- Mobile Card -->
      <!-- Mobile Card -->
      <div v-if="isMobileScreen" class="grid gap-4 sm:grid-cols-2 md:hidden">
        <CustomerCard v-for="customer in customerData.filter(c => c && c._id)" :key="customer._id" :items="customer"
          :getProductName="getProductName" :getUserName="getUserName" :formatDateKhmer="formatDateKhmer"
          @onEdit="handlePopEdit" @onDelete="handlePopDelete" />
      </div>

      <!-- Pagination -->
      <Pagination :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchText"
        @onEmitDataFromPagination="handleListenToPagination" @onEmitIsLoading="handleListenIsLoading"
        @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage" />

    </div>

    <!-- Dynamic Modals + Toast -->
    <!-- <component v-if="currentComponent" :is="currentComponent" :visible="openForm" :doc="docData" :docDelete="docDelete"
      :deleteId="deleteId" :collectionName="collectionName" :displayLabel="displayLabel" :elementName="elementName"
      :isEditDoc="isEditDoc" :showToast="showToast" :isFailed="isFailed" :informMessage="informMessage"
      :isLastRecordOnPage="isLastRecordOnPage" @onClose="handleListenEmitEvent"
      @onCloseDelete="handleListenEmitEventDelete" @onToastSuccess="handleClearToast" /> -->
      <component v-if="currentComponent" :is="currentComponent" :visible="openForm" :doc="docData" :docDelete="docDelete"
      :deleteId="deleteId" :collectionName="collectionName" :displayLabel="displayLabel" :elementName="elementName"
      :isEditDoc="isEditDoc" :showToast="showToast" :isFailed="isFailed" :informMessage="informMessage"
      :isLastRecordOnPage="isLastRecordOnPage" :getProductName="getProductName" @onClose="handleListenEmitEvent"
      @onCloseDelete="handleListenEmitEventDelete" @onToastSuccess="handleClearToast" />
  </div>
</template>
<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n' // if you use i18n, otherwise remove
import CustomerFormModal from '../components/Modal/CustomerForm.vue'
import DeleteConfirmation from '@/components/DeleteComfirmation.vue'
import Pagination from '@/components/Pagination.vue'
import ToastedVue from '@/components/ToastedVue.vue'
import CustomerCard from '@/mobile/CustomerCard.vue'
import StatusChangeCustomer from '@/components/StatusChange/StatusChangeCustomer.vue'
import CustomerViewDetaill from '@/components/Modal/CustomerViewDetaill.vue'
import formatDateKhmer from '@/composable/formatDate';
import { getDocument } from '@/composable/getDocument'


export default {
  components: {
    CustomerFormModal,
    DeleteConfirmation,
    Pagination,
    ToastedVue,
    CustomerCard,
    StatusChangeCustomer,
    CustomerViewDetaill
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n() // remove if not using i18n
    // const { getDocs } = getDocument()
    const { getDocs, createConditions } = getDocument()

    const openForm = ref(false)
    const customerData = ref([])
    const currentPage = ref(1)
    const pageSize = ref(50)
    const isEditDoc = ref(false)
    const docData = ref(null)
    const searchQuery = ref('')
    const searchText = ref('')
    const isLoading = ref(false)

    const optionPageSize = ref([50, 100, 200, 500, 1000].map(v => ({ value: v })))

    const showToast = ref(false)
    const isFailed = ref(false)
    const informMessage = ref('')
    const isMobileScreen = ref(false);
    // const isMobileScreen = ref(window.innerWidth < 768)
    const collectionName = ref('Customer')
    const displayLabel = ref('Customer')
    const elementName = ref('')
    const deleteId = ref(null)
    const docDelete = ref(null)
    const isLastRecordOnPage = ref(false)
    const currentComponent = ref('')
    const userData = ref([])


const handlePopStatusChange = (customer) => {
  resetState()
  docData.value = { ...customer }   // Use spread to avoid direct mutation
  openForm.value = true
  currentComponent.value = 'StatusChangeCustomer'
}

// DELETE THIS BLOCK
const handleListenEmitEventStatus = (status) => {
  if (status === 'status') {
    openForm.value = false
    informMessage.value = 'Status Updated Successfully!'
    showToast.value = true
    currentComponent.value = 'ToastedVue'
  } else {
    resetState()
  }
}

    const productMap = ref({})

    // Resize handler
    const handleCheckScreenSize = () => {
      isMobileScreen.value = window.innerWidth < 768
    }

    // onMounted(async () => {
    //   handleCheckScreenSize()
    //   window.addEventListener('resize', handleCheckScreenSize)
    //   await mapProducts()
    // })
    onMounted(async () => {
      handleCheckScreenSize()
      window.addEventListener('resize', handleCheckScreenSize)

      await Promise.all([
        mapProducts(),
        fetchUserName()
      ])
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleCheckScreenSize)
    })

    const mapProducts = async () => {
      const res = await getDocs('Product')
      if (res?.data) {
        res.data.forEach(p => {
          productMap.value[p._id] = p.name
        })
      }
    }

    const getProductName = (id) => productMap.value[id] || '-'

    // Watch search
    watch(searchQuery, (val) => {
      searchText.value = val
      currentPage.value = 1
    })

    const resetState = () => {
      openForm.value = false
      isEditDoc.value = false
      docData.value = null
      docDelete.value = null
      deleteId.value = null
      elementName.value = ''
      currentComponent.value = ''
      showToast.value = false
      isFailed.value = false
      informMessage.value = ''
    }

    const handleListenToPagination = (items) => {
      customerData.value = items || []
    }

    const handleListenIsLoading = (status) => {
      isLoading.value = status
    }

    const handleListenIsLastRecordOnPage = (status) => {
      isLastRecordOnPage.value = status
    }

    const handlePopOpenform = () => {
      resetState()
      openForm.value = true
      currentComponent.value = 'CustomerFormModal'
    }

    const handlePopEdit = (customer) => {
      resetState()
      isEditDoc.value = true
      docData.value = customer
      openForm.value = true
      currentComponent.value = 'CustomerFormModal'
    }
const handleViewDetail = (customer) => {
  resetState()
  docData.value = customer
  openForm.value = true
  currentComponent.value = 'CustomerViewDetaill'
}
    // const handlePopDelete = (customer) => {
    //   resetState()
    //   docDelete.value = customer
    //   deleteId.value = customer._id
    //   elementName.value = customer.username || ''
    //   isLastRecordOnPage.value = customerData.value.length === 1 && currentPage.value > 1
    //   openForm.value = true
    //   currentComponent.value = 'DeleteConfirmation'
    // }
    const handlePopDelete = (customer) => {
      resetState()
      docDelete.value = customer
      deleteId.value = customer._id
      collectionName.value = 'Customer'
      displayLabel.value = 'Customer'
      elementName.value = customer.username || ''
      isLastRecordOnPage.value = customerData.value.length === 1 && currentPage.value > 1
      openForm.value = true
      currentComponent.value = 'DeleteConfirmation'
    }

    // // Status toggle (you can expand this)
    // const handlePopStatusChange = (customer) => {
    //   // Implement your status change logic here (probably call API + refresh)
    //   console.log('Toggle status for', customer)
    //   // Example: after success → show toast
    // }

    // const handleListenEmitEvent = (status) => {
    //   if (status === 'add' || status === 'update') {
    //     openForm.value = false
    //     informMessage.value = status === 'add'
    //       ? 'Added Successfully!'
    //       : 'Updated Successfully!'
    //     showToast.value = true
    //     currentComponent.value = 'ToastedVue'
    //   } else {
    //     resetState()
    //   }
    // }
const handleListenEmitEvent = (status) => {
  if (status === 'add' || status === 'update' || status === 'status') {
    openForm.value = false
    informMessage.value = status === 'add' 
      ? 'Added Successfully!' 
      : status === 'update'
        ? 'Updated Successfully!'
        : 'Status Updated Successfully!'
    
    showToast.value = true
    currentComponent.value = 'ToastedVue'
  } else {
    resetState()
  }
}

    const handleListenEmitEventDelete = (status) => {
      if (status === 'delete') {
        openForm.value = false
        informMessage.value = 'Deleted Successfully!'
        showToast.value = true
        currentComponent.value = 'ToastedVue'
      } else {
        resetState()
      }
    }

    const handleClearToast = () => {
      showToast.value = false
      currentComponent.value = ''
      // Optional: refresh pagination after delete
    }
    const getUserName = (id) => {
      const user = userData.value.find((u) => u._id === id);
      return user ? user.username || user.displayName || user.name : 'Unknown User';
    };
    const fetchUserName = async () => {
      try {
        const conditions = createConditions([
          { field: 'status', operator: '==', value: true }
        ])

        const response = await getDocs('User', { dynamicConditions: conditions })
        userData.value = response.data?.data || response.data || []
      } catch (error) {
        userData.value = []
        console.log('Fetch user error:', error)
      }
    }
    const handleCardAction = ({ action, item }) => {
      if (action === 'edit') handlePopEdit(item)
      if (action === 'delete') handlePopDelete(item)
      if (action === 'changeStatus') handlePopStatusChange(item)
    }

    const handleNavigateBack = () => router.push('/')

    return {
      openForm,
      customerData,
      currentPage,
      pageSize,
      isEditDoc,
      docData,
      searchQuery,
      searchText,
      isLoading,
      optionPageSize,
      showToast,
      isFailed,
      informMessage,
      isMobileScreen,
      collectionName,
      displayLabel,
      elementName,
      deleteId,
      docDelete,
      isLastRecordOnPage,
      currentComponent,
      getProductName,
handleViewDetail,
      handleListenToPagination,
      handleListenIsLoading,
      handleListenIsLastRecordOnPage,
      handlePopOpenform,
      handlePopEdit,
      handlePopDelete,
      handlePopStatusChange,
      handleListenEmitEvent,
      handleListenEmitEventDelete,
      handleClearToast,
      handleNavigateBack,
      getUserName,
      formatDateKhmer,
      t,
      userData,
      formatDateKhmer,
      handleCardAction,
      getUserName,
    }
  }
}
</script>