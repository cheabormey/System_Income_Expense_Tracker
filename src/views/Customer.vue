<template>
  <div class="mx-5 font-noto">

    <!-- Back Button -->
    <button
      @click="router.back()"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-2">
        Income and Expense Management System
      </h1>
      <p class="text-[#5B9717] mb-4">បង្កើតគណនីអតិថិជន (Create Customer)</p>

      <div class="flex flex-col md:flex-row gap-4 justify-between">
        <input
          v-model="searchText"
          placeholder="Search by name, phone or address"
          class="border rounded-md px-4 py-2 w-full md:w-80"
        />

                <button class="btn-add-new flex items-center gap-2"  @click="openAdd">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add New</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow border">
      <DataTable
        :value="filteredCustomers"
        paginator
        :rows="10"
        stripedRows
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="phone" header="Phone" />
        <Column field="address" header="Address" />
        <Column field="description" header="Description" />
        <Column field="category" header="Category" />
        <Column field="tier" header="Tier" />

        <Column header="Action" style="width:140px">
          <template #body="{ data }">
            <div class="flex gap-2 justify-center">
              <Button icon="pi pi-pencil" severity="warning" @click="openEdit(data)" />
              <Button icon="pi pi-trash" severity="danger" @click="deleteCustomer(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal -->
    <CustomerForm
      :open="showForm"
      :is-edit="isEdit"
      :initial-data="selectedCustomer"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import CustomerForm from '../components/Modal/CustomerForm.vue'

const router = useRouter()

const searchText = ref('')
const showForm = ref(false)
const isEdit = ref(false)
const selectedCustomer = ref(null)

const customers = ref([
  {
    id: 1,
    name: 'Sok Dara',
    phone: '012 345 678',
    address: 'Phnom Penh',
    description: 'Regular customer',
    category: 'ឆ្នោត ភ្នំពេញ',
    tier: 'Tier 1: 109%'
  }
])

const filteredCustomers = computed(() => {
  if (!searchText.value.trim()) return customers.value
  const q = searchText.value.toLowerCase()

  return customers.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.phone.toLowerCase().includes(q) ||
    c.address.toLowerCase().includes(q)
  )
})

const openAdd = () => {
  isEdit.value = false
  selectedCustomer.value = null
  showForm.value = true
}

const openEdit = (data) => {
  isEdit.value = true
  selectedCustomer.value = { ...data }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedCustomer.value = null
}

const handleSave = (payload) => {
  if (isEdit.value) {
    const index = customers.value.findIndex(c => c.id === payload.id)
    if (index !== -1) customers.value[index] = payload
  } else {
    payload.id = Date.now()
    customers.value.push(payload)
  }
  closeForm()
}

const deleteCustomer = (id) => {
  if (confirm('Delete this customer?')) {
    customers.value = customers.value.filter(c => c.id !== id)
  }
}
</script>
