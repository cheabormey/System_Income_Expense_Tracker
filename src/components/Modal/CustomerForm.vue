<template>
  <Dialog 
    :visible="open" 
    modal 
    header="Customer Form" 
    class="w-full max-w-4xl"
    @update:visible="$emit('close')"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- FORM -->
      <div class="flex flex-col gap-3">
        <InputText v-model="form.name" placeholder="Name" />
        <InputText v-model="form.phone" placeholder="Phone" />
        <InputText v-model="form.address1" placeholder="Address 1" />
        <InputText v-model="form.address2" placeholder="Address 2" />
        <InputText v-model="form.description" placeholder="Description" />

        <div class="flex gap-3 mt-3">
          <Button :label="isEdit ? 'Update' : 'Save'" @click="submit" />
          <Button label="Cancel" severity="secondary" @click="$emit('close')" />
        </div>
      </div>

      <!-- PERMISSION -->
      <div class="flex flex-col gap-4">

        <!-- CATEGORY -->
        <div class="bg-gray-50 p-4 rounded border">
          <p class="font-semibold text-sm mb-2">Categories</p>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="cat in categories" :key="cat.id" class="flex items-center">
              <Checkbox v-model="selectedCategories" :value="cat.name" />
              <label class="ml-2 text-sm">{{ cat.name }}</label>
            </div>
          </div>
        </div>

        <!-- TIERS -->
        <div
          v-for="tier in tiers"
          :key="tier.id"
          class="bg-gray-50 p-3 rounded border"
        >
          <p class="font-semibold text-sm mb-2">លេខ {{ tier.id }}</p>

          <Dropdown
            v-model="tier.percentage"
            :options="percentages"
            placeholder="Select %"
            class="w-full mb-2"
          />

          <div class="text-sm text-gray-600">
            Condition: x {{ tier.condition }}
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { ref, watch } from 'vue'

import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'

export default {
  components: { Dialog, InputText, Button, Checkbox, Dropdown },

  props: {
    open: Boolean,
    isEdit: Boolean,
    data: Object
  },

  setup(props, { emit }) {
    const form = ref({
      name: '',
      phone: '',
      address1: '',
      address2: '',
      description: ''
    })

    const categories = ref([
      { id: 1, name: 'ឆ្នោត ភ្នំពេញ' },
      { id: 2, name: 'ឡូតូ 2' },
      { id: 3, name: 'វៀតណាម' },
      { id: 4, name: 'បូកូរ' }
    ])

    const selectedCategories = ref([])

    const tiers = ref([
      { id: 1, percentage: '109%', condition: 100 },
      { id: 2, percentage: '110%', condition: 600 }
    ])

    const percentages = ref(['109%', '110%', '115%'])

    watch(
      () => props.data,
      (val) => {
        if (val) {
          form.value = {
            name: val.name,
            phone: val.phone,
            address1: val.address,
            address2: '',
            description: val.description
          }
          selectedCategories.value = val.category.split(', ')
        }
      },
      { immediate: true }
    )

    const submit = () => {
      const tierInfo = tiers.value
        .map(t => `Tier ${t.id}: ${t.percentage} / x${t.condition}`)
        .join(' | ')

      emit('save', {
        id: props.data?.id,
        ...form.value,
        address: form.value.address1 + ' ' + form.value.address2,
        category: selectedCategories.value.join(', '),
        tier: tierInfo
      })

      emit('close') // close modal after save
    }

    return {
      form,
      categories,
      selectedCategories,
      tiers,
      percentages,
      submit
    }
  }
}
</script>
