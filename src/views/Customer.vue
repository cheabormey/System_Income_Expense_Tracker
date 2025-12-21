<template>
  <div class="p-6 min-h-screen flex justify-center items-center bg-blue-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-6xl">

      <!-- Back Button -->
      <button
        @click="handleNavigateBack"
        class="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition mb-4"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>

      <!-- Title -->
      <div class="text-center mb-8">
        <h1 class="text-blue-800 text-2xl font-bold">
          Income and Expense Management System
        </h1>
        <p class="text-blue-600">
          បង្កើតគណនីអតិថិជន (Create Customer)
        </p>
      </div>

      <!-- ADD BUTTON -->
      <div class="flex justify-end mb-4">
        <Button label="➕ Add Customer" @click="openAdd" />
      </div>

      <!-- TABLE -->
      <DataTable
        :value="customers"
        paginator
        :rows="5"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Name" />
        <Column field="phone" header="Phone" />
        <Column field="address" header="Address" />
        <Column field="description" header="Description" />
        <Column field="category" header="Category" />
        <Column field="tier" header="Tier Info" />

        <Column header="Action">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                class="p-button-sm p-button-warning"
                @click="openEdit(data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-sm p-button-danger"
                @click="deleteCustomer(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- FORM MODAL -->
      <CustomerForm
        :open="showForm"
        :isEdit="isEdit"
        :data="selectedCustomer"
        @close="closeForm"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import CustomerForm from '../components/Modal/CustomerForm.vue'

export default {
  components: {
    ChevronLeftIcon,
    Button,
    DataTable,
    Column,
    CustomerForm
  },

  setup() {
    const router = useRouter()
    const handleNavigateBack = () => router.back()

    const customers = ref([])
    const showForm = ref(false)
    const isEdit = ref(false)
    const selectedCustomer = ref(null)

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
    }

    const handleSave = (payload) => {
      if (isEdit.value) {
        const index = customers.value.findIndex(c => c.id === payload.id)
        customers.value[index] = payload
      } else {
        customers.value.push({ ...payload, id: Date.now() })
      }
      closeForm()
    }

    const deleteCustomer = (id) => {
      customers.value = customers.value.filter(c => c.id !== id)
    }

    return {
      handleNavigateBack,
      customers,
      showForm,
      isEdit,
      selectedCustomer,
      openAdd,
      openEdit,
      closeForm,
      handleSave,
      deleteCustomer
    }
  }
}
</script>
