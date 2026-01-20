<template>
  <div class="flex flex-col gap-4">
    <h3 class="font-bold text-gray-700">បង្កើតគណនីអតិថិជន (Create Customer)</h3>

    <InputText v-model="customer.name" placeholder="Name (ឈ្មោះ)" class="w-full bg-gray-50" />
    <InputText v-model="customer.phone" placeholder="Phone number" class="w-full bg-gray-50" />
    <InputText v-model="customer.address1" placeholder="Address (អាសយដ្ឋាន)" class="w-full bg-gray-50" />
    <InputText v-model="customer.address2" placeholder="Address" class="w-full bg-gray-50" />
    <InputText v-model="customer.description" placeholder="Description" class="w-full bg-gray-50" />
                    <!-- Status Toggle -->
                <div class="flex items-center space-x-2 col-span-2">
                  <ToggleSwitch v-model="status" inputId="switch1" />
                  <label class="label" for="switch1">Active Status</label>
                </div>

                <div class="flex justify-end gap-4 pt-6 border-t">
                  <button type="button" class="px-5 py-2 btn-cancel" @click="handleClose" :disabled="loading">
                    Cancel
                  </button>
                  <button type="submit" class="px-5 py-2 btn-add " :disabled="loading || isNameDuplicate">
                    <span v-if="loading" class="animate-spin">🌀</span>
                    {{ isEditDoc ? 'Update' : 'Save' }}
                  </button>
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
