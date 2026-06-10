<template>
  <div class="space-y-4">
    <!-- CARD -->
    <div
      v-for="(item, index) in items"
      :key="item._id || index"
      class="bg-white rounded-2xl shadow-md border border-gray-100 p-4 space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <!-- Top Header -->
      <div class="flex justify-between items-start gap-3">
        <div class="flex items-start gap-3 min-w-0">
          <!-- Product Icon -->
          <div
            class="w-12 h-12 rounded-full bg-[#045B1B]/10 flex items-center justify-center text-[#045B1B] shrink-0"
          >
            <Package class="w-6 h-6" />
          </div>

          <!-- Product Info -->
          <div class="min-w-0">
            <h2 class="font-bold text-[#045B1B] text-base truncate">
              {{ item.name || "N/A" }}
            </h2>

            <p class="text-xs text-gray-400 break-words">
              {{ formatDate(item.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Status Badge -->
        <div>
          <span
           
            class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition"
            :class="
              item.status
                ? 'bg-primary-bg text-primary hover:bg-green-100'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            "
          >
            <i
              class="pi text-[10px]"
              :class="item.status ? 'pi-check-circle' : 'pi-times-circle'"
            ></i>
            {{ item.status ? "Active" : "Inactive" }}
          </span>
        </div>
      </div>

      <!-- Detail Box -->
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <div class="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
          Product Details
        </div>

        <div class="divide-y text-sm">
          <div class="grid grid-cols-3 px-3 py-2 items-center">
            <div class="font-medium text-gray-500">Name</div>
            <div class="col-span-2 text-[#045B1B] truncate">
              {{ item.name || "-" }}
            </div>
          </div>

          <div class="grid grid-cols-3 px-3 py-2 items-center">
            <div class="font-medium text-gray-500">Multiplier</div>
            <div class="col-span-2">
              <span
                class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100"
              >
                x{{ item.winMultiplier || 0 }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-3 px-3 py-2 items-center">
            <div class="font-medium text-gray-500">Description</div>
            <div class="col-span-2 text-gray-600 break-words">
              {{ item.description || "-" }}
            </div>
          </div>

          <div class="grid grid-cols-3 px-3 py-2 items-center">
            <div class="font-medium text-gray-500">ID</div>
            <div class="col-span-2 text-gray-400 font-mono text-xs">
              {{ item._id ? item._id.slice(-8) : "N/A" }}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-2 pt-1">
        <button
          @click="$emit('onEdit', item)"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#045B1B]/10 text-[#045B1B] hover:bg-[#045B1B]/20 transition"
        >
          <Edit class="w-4 h-4" />
          <span class="text-xs font-medium">Edit</span>
        </button>

        <button
          @click="$emit('onDelete', item)"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          <Trash2 class="w-4 h-4" />
          <span class="text-xs font-medium">Delete</span>
        </button>
      </div>
    </div>

    <!-- EMPTY -->
    <div
      v-if="!isLoading && items.length === 0"
      class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed"
    >
      <p class="text-gray-500 font-medium">No Products Found</p>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-40 bg-gray-100 animate-pulse rounded-2xl"
      ></div>
    </div>
  </div>
</template>

<script>
import formatDate from "@/composable/formatDate";
import { Edit, Trash2, Package } from "lucide-vue-next";

export default {
  name: "ProductCard",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isLoading: Boolean,
  },
  components: {
    Edit,
    Trash2,
    Package,
  },
  methods: {
    formatDate,
  },
};
</script>