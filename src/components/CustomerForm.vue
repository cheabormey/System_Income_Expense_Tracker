<template>
  <div class="flex flex-col gap-4">
    <h3 class="font-bold text-gray-700">បង្កើតគណនីអតិថិជន (Create Customer)</h3>

    <InputText v-model="customer.name" placeholder="Name (ឈ្មោះ)" class="w-full bg-gray-50" />
    <InputText v-model="customer.phone" placeholder="Phone number" class="w-full bg-gray-50" />
    <InputText v-model="customer.address1" placeholder="Address (អាសយដ្ឋាន)" class="w-full bg-gray-50" />
    <InputText v-model="customer.address2" placeholder="Address" class="w-full bg-gray-50" />
    <InputText v-model="customer.description" placeholder="Description" class="w-full bg-gray-50" />

    <div class="flex gap-4 mt-4">
      <Button label="Save (រក្សាទុក)" class="p-button-primary px-8" @click="saveCustomer" />
      <Button label="Cancel (បោះបង់)" class="p-button-outlined p-button-secondary px-8 bg-white" @click="resetForm" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

export default {
  name: 'CustomerForm',
  components: { InputText, Button },
  emits: ['add-customer'],
  setup(props, { emit }) {
    const customer = ref({
      name: '',
      phone: '',
      address1: '',
      address2: '',
      description: ''
    })

    const saveCustomer = () => {
      if (!customer.value.name) return
      const newCustomer = { ...customer.value }
      emit('add-customer', newCustomer)
      resetForm()
    }

    const resetForm = () => {
      customer.value = { name: '', phone: '', address1: '', address2: '', description: '' }
    }

    return { customer, saveCustomer, resetForm }
  }
}
</script>

<style scoped>
:deep(.p-button-primary) {
  background-color: #3b82f6;
  border: none;
}
</style>
