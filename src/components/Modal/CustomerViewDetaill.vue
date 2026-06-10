    <template>
      <Dialog 
        :visible="visible" 
        modal 
        :style="{ width: '650px' }" 
        :showHeader="false"
        class="custom-detail-dialog overflow-hidden rounded-3xl border-0 shadow-2xl"
        @update:visible="closeModal"
      >
        <div class="relative bg-gradient-to-br from-[#045B1B] via-[#2F7D19] to-[#5B9717] p-6 text-white">
          <button 
            @click="closeModal" 
            class="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/10"
          >
            <i class="pi pi-times text-xs"></i>
          </button>

          <div class="flex items-center gap-4 mt-2">
            <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-2xl font-bold tracking-wider uppercase shadow-inner">
              {{ doc?.username ? doc.username.substring(0, 2) : 'CU' }}
            </div>
            
            <div class="space-y-1">
              <span class="text-xs uppercase tracking-widest text-green-200/80 font-semibold font-mono">Customer Profile</span>
              <h2 class="text-2xl font-bold tracking-tight text-white">{{ doc?.username || '-' }}</h2>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-6 bg-slate-50/50">
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div class="p-2 rounded-xl bg-blue-50 text-blue-600 mt-0.5">
                <i class="pi pi-phone text-sm"></i>
              </div>
              <div class="space-y-0.5">
                <span class="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Phone</span>
                <span class="text-sm font-semibold text-gray-800 break-all">{{ doc?.phoneNumber || '-' }}</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div class="p-2 rounded-xl bg-orange-50 text-orange-600 mt-0.5">
                <i class="pi pi-map-marker text-sm"></i>
              </div>
              <div class="space-y-0.5">
                <span class="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Address</span>
                <span class="text-sm font-semibold text-gray-800 line-clamp-2 title-address" :title="doc?.address">
                  {{ doc?.address || '-' }}
                </span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-3">
              <div class="p-2 rounded-xl mt-0.5" :class="isDocActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
                <i class="pi text-sm" :class="isDocActive ? 'pi-check-circle' : 'pi-times-circle'"></i>
              </div>
              <div class="space-y-1">
                <span class="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Account Status</span>
                <Tag 
                  :severity="isDocActive ? 'success' : 'danger'" 
                  :value="isDocActive ? 'Active' : 'Inactive'"
                  class="px-2.5 py-0.5 text-xs font-bold rounded-lg tracking-wide uppercase border"
                  :class="isDocActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'"
                />
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div class="flex items-center gap-2 text-gray-500 font-semibold text-sm">
              <i class="pi pi-align-left text-xs"></i>
              <span>Internal Remarks / Description</span>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              {{ doc?.description || 'No descriptive logs found for this customer entry.' }}
            </p>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/40">
              <div class="flex items-center gap-2 text-gray-700 font-bold text-sm">
                <i class="pi pi-shield text-xs text-[#2F7D19]"></i>
                <span>Product Permissions & Commission Rates</span>
              </div>
              <span v-if="doc?.percentages?.length" class="text-xs font-mono font-bold bg-gray-200/60 px-2 py-0.5 rounded-full text-gray-600">
                {{ doc.percentages.length }} Rules
              </span>
            </div>

            <div v-if="doc?.percentages?.length" class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                    <th class="p-3 text-left pl-5">Product Classification</th>
                    <th class="p-3 text-left">Assigned Product</th>
                    <th class="p-3 text-center">Split Rate</th>
                    <th class="p-3 text-center pr-5">Win Weight</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-50 bg-white">
                  <tr v-for="(item, index) in doc.percentages" :key="index" class="hover:bg-green-50/20 transition-colors duration-150">
                    <td class="p-3 pl-5">
                      <span class="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                        {{ item.productType || 'N/A' }}
                      </span>
                    </td>

                    <td class="p-3 font-semibold text-gray-800">
                      {{ getProductName(item.productId) }}
                    </td>

                    <td class="p-3 text-center">
                      <span class="inline-flex items-center justify-center font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs border border-emerald-100">
                        {{ item.percentages }}%
                      </span>
                    </td>

                    <td class="p-3 text-center pr-5 font-mono font-bold text-slate-700">
                      <span class="text-gray-400 text-xs font-normal mr-0.5">×</span>{{ item.winMultiplier }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="p-8 text-center flex flex-col items-center justify-center bg-gray-50/50">
              <i class="pi pi-lock text-3xl text-gray-300 mb-2"></i>
              <p class="text-gray-400 italic text-sm">
                No active custom permissions assigned to this portfolio.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <Button 
              label="Dismiss" 
              icon="pi pi-times" 
              class="p-button-secondary px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm border border-gray-200" 
              @click="closeModal" 
            />
          </div>

        </div>
      </Dialog>
    </template>

<script>
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Button from 'primevue/button';

export default {
  components: {
    Dialog,
    Tag,
    Button
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    doc: {
      type: Object,
      default: () => ({})
    },
    getProductName: {
      type: Function,
      default: () => '-'
    },
  },

  emits: ['onClose'],

  setup(props, { emit }) {
    const isDocActive = computed(() => {
      return props.doc?.status === true || props.doc?.status === 'active';
    });

    const closeModal = () => {
      emit('onClose', 'close');
    }

    return {
      isDocActive,
      closeModal
    }
  }
}
</script>

<style scoped>
/* Scoped overrides to eliminate legacy square borders from parent Prime components */
:deep(.p-dialog) {
  border-radius: 1.5rem !important;
  overflow: hidden !important;
}
:deep(.p-dialog-content) {
  padding: 0 !important;
}
</style>