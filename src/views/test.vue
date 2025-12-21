<template>
  <div class="mx-5 font-noto">
    <!-- Back Button -->
    <button
      @click="handleNavigateBack"
      class="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-4">
        Customers (អតិថិជន)
      </h1>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input
          v-model="searchText"
          placeholder="Search by name or phone (ស្វែងរកតាមឈ្មោះ ឬ លេខទូរស័ព្ទ)"
          class="border rounded-md px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-[#5B9717]"
        />

        <button
          class="bg-[#045B1B] hover:bg-[#045B1B]/90 text-white px-6 py-2 rounded-md transition flex items-center gap-2"
          @click="openAddForm"
        >
          <span>➕ Add New Customer</span>
        </button>
      </div>
    </div>

    <!-- Customer Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden border">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name (ឈ្មោះ)</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Categories</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(customer, index) in filteredCustomers"
            :key="customer.id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#c6f5d3]'"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ customer.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ customer.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ customer.phone }}</td>
            <td class="px-6 py-4 text-gray-700">{{ customer.address }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ customer.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                class="text-blue-600 hover:text-blue-900 mr-4"
                @click="openEditForm(customer)"
                title="Edit"
              >
                ✏️
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                @click="confirmDelete(customer.id)"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredCustomers.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              No customers found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Customer Form Modal -->
    <CustomerFormModal
      :open="showFormModal"
      :is-edit="isEdit"
      :customer="selectedCustomer"
      @onClose="closeForm"
      @onSave="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import CustomerFormModal from '@/components/Modal/CustomerForm.vue' // Adjust path as needed

const router = useRouter()

const handleNavigateBack = () => {
  router.push('/')
}

const searchText = ref('')
const showFormModal = ref(false)
const isEdit = ref(false)
const selectedCustomer = ref(null)

const customers = ref([
  { id: 1, name: 'Sok Dara', phone: '012345678', address: 'Phnom Penh', category: 'ឆ្នោត ភ្នំពេញ' },
  { id: 2, name: 'Chea Bormey', phone: '098765432', address: 'Preah Vihear', category: 'វៀតណាម' },
])

const filteredCustomers = computed(() => {
  if (!searchText.value.trim()) return customers.value

  const query = searchText.value.toLowerCase()
  return customers.value.filter(c =>
    c.name.toLowerCase().includes(query) ||
    c.phone.includes(query)
  )
})

const openAddForm = () => {
  isEdit.value = false
  selectedCustomer.value = null
  showFormModal.value = true
}

const openEditForm = (customer) => {
  isEdit.value = true
  selectedCustomer.value = { ...customer }
  showFormModal.value = true
}

const closeForm = () => {
  showFormModal.value = false
  selectedCustomer.value = null
}

const confirmDelete = (id) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    customers.value = customers.value.filter(c => c.id !== id)
  }
}

const handleSave = (savedCustomer) => {
  if (isEdit.value) {
    const index = customers.value.findIndex(c => c.id === savedCustomer.id)
    if (index !== -1) customers.value[index] = savedCustomer
  } else {
    const newId = Math.max(...customers.value.map(c => c.id), 0) + 1
    customers.value.push({ ...savedCustomer, id: newId })
  }
  closeForm()
}
</script>