<template>
  <Dialog :visible="open" modal header="Invoice Form" class="w-full max-w-2xl" @hide="$emit('close')">
    <div class="flex flex-col gap-4">
      <InputText v-model="form.customer" placeholder="Customer Name" />
      <InputText v-model="form.total" type="number" placeholder="Total Amount" />

      <Dropdown v-model="form.type" :options="['Max','Fast']" placeholder="Invoice Type" />

      <div class="flex justify-end gap-3 mt-4">
        <Button label="Cancel" class="p-button-outlined" @click="$emit('close')" />
        <Button :label="isEdit ? 'Update' : 'Add'" class="p-button-primary" @click="submit" />
      </div>
    </div>
  </Dialog>
</template>

<script>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

export default {
  components: { Dialog, InputText, Button, Dropdown },

  props: {
    open: Boolean,
    data: Object,
    isEdit: Boolean
  },

  setup(props, { emit }) {
    const form = ref({ customer: '', total: '', type: '' })

    watch(() => props.data, (val) => {
      if (val) form.value = { ...val }
      else form.value = { customer: '', total: '', type: '' }
    }, { immediate: true })

    const submit = () => {
      if (!form.value.customer || !form.value.total || !form.value.type) {
        alert('Please fill all fields')
        return
      }
      emit('save', { ...form.value, id: props.data?.id })
      emit('close')
    }

    return { form, submit }
  }
}
</script>

<style scoped>
:deep(.p-button-primary) {
  background-color: #3b82f6;
  border: none;
}
</style>
