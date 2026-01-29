<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditMode ? 'Update Entry' : 'New Entry'"
    modal
    class="p-fluid"
    style="width: 450px"
  >
    <div class="field mb-3">
      <label class="font-bold">Date</label>
      <Calendar v-model="localEntry.date" dateFormat="dd/mm/yy" showIcon />
    </div>

    <div class="field mb-3">
      <label class="font-bold">Category</label>
      <Dropdown
        v-model="localEntry.category"
        :options="categories"
        optionLabel="label"
        optionValue="value"
        placeholder="Select"
      />
    </div>

    <div class="field mb-3">
      <label class="font-bold">Customer</label>
      <Dropdown
        v-model="localEntry.customer"
        :options="customers"
        optionLabel="label"
        optionValue="value"
        placeholder="Select"
      />
    </div>

    <div class="field mb-3">
      <label class="font-bold">Head Number</label>
      <InputText v-model="localEntry.head" />
    </div>

    <div class="grid">
      <div class="col-6 field">
        <label class="font-bold">2 Digit</label>
        <InputNumber v-model="localEntry.twoDigit" :min="0" />
      </div>
      <div class="col-6 field">
        <label class="font-bold">3 Digit</label>
        <InputNumber v-model="localEntry.threeDigit" :min="0" />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" text @click="close" />
      <Button label="Save" icon="pi pi-check" @click="submit" />
    </template>
  </Dialog>
</template>

<script>
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

export default {
  name: 'InvoiceForm',
  components: {
    Dialog,
    Button,
    InputText,
    InputNumber,
    Dropdown,
    Calendar
  },
  props: {
    modelValue: Boolean,
    entry: Object,
    isEditMode: Boolean,
    categories: Array,
    customers: Array
  },
  emits: ['update:modelValue', 'save'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue);
    const localEntry = ref({ ...props.entry });

    watch(() => props.modelValue, v => (visible.value = v));
    watch(() => props.entry, v => (localEntry.value = { ...v }));

    const close = () => emit('update:modelValue', false);

    const submit = () => {
      emit('save', { ...localEntry.value });
      close();
    };

    return { visible, localEntry, close, submit };
  }
};
</script>
