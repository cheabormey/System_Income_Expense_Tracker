<template>
  <Teleport to="body">
    <transition name="toast" appear>
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex justify-center items-start pt-8"
        @click="handleBackdropClick">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"></div>

        <div
          class="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 transform transition-all duration-300"
          @click.stop role="dialog" aria-modal="true">
          
          <div class="flex items-center justify-between p-6 pb-4">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                Delete {{ displayLabel }}
              </h3>
            </div>

            <button @click="handleClose('close')"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close">
              <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 pb-6">
            <p class="text-gray-700 leading-relaxed">
              Are you sure you want to delete
              <span class="font-medium text-gray-900">
                "{{ elementName }}"
              </span>?
            </p>
            <p class="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>

          <div class="flex justify-end gap-3 p-6 pt-0">
            <button type="button" @click="handleClose('close')"
              class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              :disabled="documentLoading">
              Cancel
            </button>
            <button type="button" @click="handleDelete" :disabled="documentLoading"
              class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium min-w-[120px] flex items-center justify-center transition-colors">
              <span v-if="documentLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
              <span v-else>Confirm Delete</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import socket from "@/services/socket";
import { ref, watch } from "vue";
import { useDocument } from "@/composable/useDocument";

export default {
  props: {
    visible: { type: Boolean, default: false },
    deleteId: { type: String, required: true },
    collectionName: {
      type: String,
      required: true,
      validator: (value) =>
        ["Branch", "Category", "User", "Invoice", "Customer", "Product", "ChiefExpense", 
         "CustomerReimburstment", "CustomerReturnMoney", "LotteryChiefBalance"].includes(value),
    },
    displayLabel: { type: String, required: true },
    elementName: { type: String, required: true },
    isLastRecordOnPage: { type: Boolean, default: false },
    softDelete: { type: Boolean, default: false },
  },
  emits: ["onCloseDelete"],
  setup(props, { emit }) {
    const isOpen = ref(props.visible);

    watch(() => props.visible, (newVal) => {
      isOpen.value = newVal;
    });

    const { deleteDoc, loading: documentLoading } = useDocument();

    const socketEventMapping = {
      Branch: "BranchModify",
      Category: "CategoryModify",
      Customer: "CustomerModify",
      Product: "ProductModify",
      User: "UserModify",
      ChiefExpense: "ChiefExpenseModify",
      CustomerReimburstment: "CustomerReimburstmentModify",
      CustomerReturnMoney: "CustomerReturnMoneyModify",
      Invoice: "InvoiceModify",
      LotteryChiefBalance: "LotteryChiefBalanceModify"
    };

    const handleClose = (status = "close") => {
      isOpen.value = false;
      setTimeout(() => {
        emit("onCloseDelete", status);
      }, 200);
    };

    const handleBackdropClick = () => handleClose("close");

    const handleDelete = async () => {
      if (!props.deleteId) return;

      try {
        await deleteDoc(props.collectionName, props.deleteId, {
          softDelete: props.softDelete,
        });

        const socketEvent = socketEventMapping[props.collectionName];
        if (socketEvent) {
          socket.emit(socketEvent, { 
            collection: props.collectionName, 
            action: 'delete', 
            id: props.deleteId 
          });
        }

        if (props.isLastRecordOnPage) {
          socket.emit("lastRecordDeleted", { collection: props.collectionName });
        }

        handleClose("delete");
      } catch (err) {
        console.error("Failed to delete data:", err);
        emit("onCloseDelete", "error");
      }
    };

    return {
      isOpen,
      handleClose,
      handleDelete,
      handleBackdropClick,
      documentLoading,
    };
  },
};
</script>