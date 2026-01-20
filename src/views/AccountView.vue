<template>
  <div class="mx-5 font-noto">
    <button
      @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Accounts Management</h1>

      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="w-full md:w-96">
          <label class="text-sm font-medium text-gray-700 mb-1 block">Filter by Customer Name</label>
          <select
            v-model="searchQuery"
            class="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9717]"
          >
            <option value="">All Customers</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer.name">
              {{ customer.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-x-auto border relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Balance</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Deposit & Withdraw</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(account, index) in accountData"
            :key="account._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'"
          >
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ account.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
              ${{ account.balance?.toLocaleString() || '0.00' }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="flex justify-center gap-2">
                <button @click="handleDeposit(account)" class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Deposit</button>
                <button @click="handleWithdraw(account)" class="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600">Withdraw</button>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="handlePopStatusChange(account)" class="inline-flex items-center">
                <i class="pi mr-2" :class="account.status ? 'pi-check-circle text-green-600' : 'pi-times-circle text-red-600'" />
                <span :class="account.status ? 'text-green-700' : 'text-red-700'" class="text-sm font-medium">
                  {{ account.status ? 'Active' : 'Inactive' }}
                </span>
              </button>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button class="text-[#045B1B] hover:bg-gray-100 p-2 rounded" @click="openEditForm(account)">
                <i class="pi pi-pencil" />
              </button>
              <button class="text-red-600 hover:bg-red-50 p-2 rounded" @click="confirmDelete(account)">
                <i class="pi pi-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-5">
      <Pagination :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchQuery" collectionName="Account" @onEmitDataFromPagination="handleListenToPagination" @onEmitIsLoading="handleListenIsLoading" />
    </div>

    <AccountFormModal :visible="showFormModal" :is-edit-doc="true" :doc="selectedAccount" @onClose="closeForm" />
    <DepositForm :visible="showDepositModal" :doc="selectedAccount" @onClose="handleCloseDeposit" />
    <WithdrawForm :visible="showWithdrawModal" :doc="selectedAccount" @onClose="handleCloseWithdraw" />
    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedAccount?.name || ''" collectionName="Account" @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AccountFormModal from '../components/Modal/AccountForm.vue';
import DepositForm from '../components/Modal/DepositForm.vue';
import WithdrawForm from '../components/Modal/WithdrawForm.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';
import { getDocument } from '@/composable/getDocument';
import { useDocument } from '@/composable/useDocument';
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'AccountView',
  components: { AccountFormModal, DepositForm, WithdrawForm, Pagination, DeleteConfirmation, ChevronLeftIcon },
  setup() {
    const router = useRouter();
    const { getDocs } = getDocument();
    const { updateDoc } = useDocument();

    const accountData = ref([]);
    const customers = ref([]);
    const isLoading = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(50);
    const searchQuery = ref('');

    const showFormModal = ref(false);
    const showDepositModal = ref(false);
    const showWithdrawModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedAccount = ref(null);
    const deleteId = ref(null);

    const fetchCustomers = async () => {
      try {
        const response = await getDocs("Customer", { dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }]) });
        customers.value = response.data?.data || response.data || [];
      } catch (err) { console.error(err); }
    };

    onMounted(() => { fetchCustomers(); });

    const handleListenToPagination = (items) => { accountData.value = items || []; };
    const handleListenIsLoading = (status) => { isLoading.value = status; };

    const openEditForm = (acc) => { selectedAccount.value = acc; showFormModal.value = true; };
    const handleDeposit = (acc) => { selectedAccount.value = acc; showDepositModal.value = true; };
    const handleWithdraw = (acc) => { selectedAccount.value = acc; showWithdrawModal.value = true; };
    const confirmDelete = (acc) => { deleteId.value = acc._id; selectedAccount.value = acc; showDeleteModal.value = true; };

    const handlePopStatusChange = async (account) => {
      const newStatus = !account.status;
      try {
        await updateDoc('Account', account._id, { fields: { status: newStatus } });
        account.status = newStatus;
      } catch (err) { console.error(err); }
    };

    return {
      handleNavigateBack: () => router.push('/'),
      accountData, customers, isLoading, currentPage, pageSize, searchQuery,
      showFormModal, showDepositModal, showWithdrawModal, selectedAccount, showDeleteModal, deleteId,
      handleListenToPagination, handleListenIsLoading, openEditForm, confirmDelete, 
      handlePopStatusChange, handleDeposit, handleWithdraw,
      closeForm: () => showFormModal.value = false,
      handleCloseDeposit: (s) => { showDepositModal.value = false; if(s==='update') searchQuery.value = searchQuery.value; },
      handleCloseWithdraw: (s) => { showWithdrawModal.value = false; if(s==='update') searchQuery.value = searchQuery.value; },
      handleCloseDelete: () => showDeleteModal.value = false
    };
  }
};
</script>