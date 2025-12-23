<template>
    <div class="mx-5 font-noto">
        <!-- Back Button -->
        <button @click="handleNavigateBack"
            class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
            aria-label="Go back">
            <ChevronLeftIcon class="w-6 h-6" />
            <span class="ml-1 text-sm">Back</span>
        </button>

        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
            <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-4">Users</h1>

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3 flex-wrap">
                    <input v-model="searchText" placeholder="Search by username or full name"
                        class="border rounded-md px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />

                    <select v-model="genderFilter"
                        class="border rounded-md px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#5B9717]">
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <select v-model="mainRoleFilter"
                        class="border rounded-md px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#5B9717]">
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Staff">Staff</option>
                        <option value="User">User</option>
                    </select>

                    <select v-model="statusFilter"
                        class="border rounded-md px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#5B9717]">
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add New</span>
        </button>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow overflow-x-auto border">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-[#045B1B] text-white">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Profile</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Main Role</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Permissions</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bot Token</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(user, index) in filteredUsers" :key="user.id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="w-12 h-12 rounded-full overflow-hidden border border-[#82B215]">
                                <img v-if="user.profilePicture" :src="user.profilePicture" alt="Profile"
                                    class="w-full h-full object-cover">
                                <div v-else class="w-full h-full bg-[#82B215]/10 flex items-center justify-center">
                                    <svg class="w-6 h-6 text-[#5B9717]" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ user.username }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ user.fullName || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ user.gender || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ user.phoneNumber || '-' }}</td>
                        <td class="px-6 py-4 text-gray-700">{{ user.address || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ user.mainRole || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ user.permissions?.join(', ') || '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ user.botToken ? 'Yes' : 'No' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span @click="toggleStatus(user)"
                                class="cursor-pointer inline-flex px-3 py-1 text-xs font-medium rounded-full"
                                :class="user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                {{ user.status ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div class="flex items-center justify-center gap-2">
                                <!-- View / Reset Password Button -->
                                <button
                                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#045B1B] hover:bg-[#f9faf5] transition"
                                    @click="resetPassword(user.id)" title="Reset Password">
                                    <i class="pi pi-key text-base" />
                                </button>

                                <!-- Edit Button -->
                                <button v-if="canEdit"
                                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#045B1B] hover:bg-[#f9faf5] transition"
                                    @click="openEditForm(user)" title="Edit">
                                    <i class="pi pi-pencil text-base" />
                                </button>

                                <!-- Delete Button -->
                                <button v-if="canDelete"
                                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:bg-red-50 transition"
                                    @click="confirmDelete(user.id)" title="Delete">
                                    <i class="pi pi-trash text-base" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="filteredUsers.length === 0">
                        <td colspan="11" class="px-6 py-16 text-center text-gray-500">
                            No users found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- User Form Modal -->
        <UserFormModal :open="showFormModal" :is-edit="isEditDoc" :initial-data="selectedUser" @close="closeForm"
            @save="handleSave" />
    </div>
</template>

<script>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import UserFormModal from '../components/Modal/UserForm.vue';
import { useRouter } from 'vue-router';

export default {
    name: 'UserView',
    components: { UserFormModal, ChevronLeftIcon },

    setup() {
        const router = useRouter();
        const handleNavigateBack = () => router.push('/');

        return { handleNavigateBack };
    },

    data() {
        return {
            searchText: '',
            genderFilter: '',
            mainRoleFilter: '',
            statusFilter: '',
            showFormModal: false,
            isEditDoc: false,
            selectedUser: null,
            users: [
                {
                    id: 1,
                    username: 'sokdara',
                    fullName: 'Sok Dara',
                    gender: 'Male',
                    phoneNumber: '012 345 678',
                    address: 'Phnom Penh, Cambodia',
                    mainRole: 'Admin',
                    permissions: ['view:branches', 'edit:users', 'delete:all'],
                    botToken: 'abc123-bot-token',
                    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
                    status: true,
                },
            ],
        };
    },

    computed: {
        filteredUsers() {
            let result = this.users;

            if (this.searchText.trim()) {
                const query = this.searchText.toLowerCase();
                result = result.filter(
                    (u) =>
                        u.username.toLowerCase().includes(query) ||
                        (u.fullName && u.fullName.toLowerCase().includes(query))
                );
            }

            if (this.genderFilter) {
                result = result.filter((u) => u.gender === this.genderFilter);
            }

            if (this.mainRoleFilter) {
                result = result.filter((u) => u.mainRole === this.mainRoleFilter);
            }

            if (this.statusFilter !== '') {
                const status = this.statusFilter === 'true';
                result = result.filter((u) => u.status === status);
            }

            return result;
        },

        // Permission checks (replace with real auth logic)
        canEdit() {
            // Example: only Admin can edit
            return this.users.some(u => u.mainRole === 'Admin'); // or use store/user role
        },

        canDelete() {
            // Example: only Admin can delete
            return this.users.some(u => u.mainRole === 'Admin');
        },
    },

    methods: {
        openAddForm() {
            this.isEditDoc = false;
            this.selectedUser = null;
            this.showFormModal = true;
        },

        openEditForm(user) {
            if (!this.canEdit) {
                alert('You do not have permission to edit users.');
                return;
            }
            this.isEditDoc = true;
            this.selectedUser = { ...user };
            this.showFormModal = true;
        },

        closeForm() {
            this.showFormModal = false;
            this.selectedUser = null;
        },

        toggleStatus(user) {
            user.status = !user.status;
            // TODO: call API
        },

        confirmDelete(id) {
            if (!this.canDelete) {
                alert('You do not have permission to delete users.');
                return;
            }
            if (confirm('Are you sure you want to delete this user?')) {
                this.users = this.users.filter((u) => u.id !== id);
                // TODO: call API
            }
        },

        resetPassword(id) {
            alert(`Password reset requested for user ID: ${id}`);
            // TODO: Implement real password reset logic (send email, etc.)
        },

        handleSave(savedUser) {
            if (this.isEditDoc) {
                const index = this.users.findIndex((u) => u.id === savedUser.id);
                if (index !== -1) this.users[index] = { ...savedUser };
            } else {
                const newId = Math.max(...this.users.map((u) => u.id), 0) + 1;
                this.users.push({ ...savedUser, id: newId, status: true });
            }
            this.closeForm();
        },
    },
};
</script>

<style scoped>
/* Optional: make action buttons nicer */
button:hover {
    transform: scale(1.05);
    transition: all 0.15s ease;
}
</style>