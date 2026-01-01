let usersData = [];

document.addEventListener('DOMContentLoaded', function () {
    // Load users from storage
    usersData = getStorageData('users') || [];

    // Display users in table
    displayUsers();

    // Setup event  listeners
    setupUserListeners();
});

function setupUserListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchUser');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterUsers();
        });
    }

    // Role filter
    const rolFilter = document.getElementById('roleFilter');
    if (rolFilter) {
        rolFilter.addEventListener('change', function () {
            filterUsers();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            filterUsers();
        });
    }

    // Save user button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveUser);
    }

    // Modal reset on close
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('userFrom').reset();
            document.getElementById('userForm').dataset.editId = '';
        });
    }

    // New user button
    const newUserBtn = document.getElementById('newUserBtn');
    if (newUserBtn) {
        newUserBtn.addEventListener('click', function () {
            document.getElementById('userForm').reset();
            document.getElementById('userForm').dataset.editId = '';
            document.getElementById('userModalLabel').textContent = 'Create New User';
            document.getElementById('userPassword').parentElement.style.display = 'block';
        });
    }
}

function displayUsers() {
    const table = document.getElementById('usersTable');
    if (!table) return;

    if (usersData.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No users found</td></tr>';
    }

    table.innerHTML = usersData.map(user => {
        const statusBadge = user.status == 'Active'
            ? '<span class="badge bg-success">Active</span>'
            : '<span class="badge bg-secondary">Inactive</span>';
        const joined = new DataTransfer(user.joined).toLocaleDateString();

        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${statusBadge}</td>
                <td>${joined}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onlick="editUser('${user.id}')">
                        <i class="bi bi-pencil"></i>
                    </butoon>
                    <button class="btn btn-sm btn-danger" onlick="deleteUser('${user.id}')">
                        <i class="bi bi-trash"></i>
                    </butoon>
                </td>
            </tr>
        `;
    }).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUser').value.toLowerCase();
    const roleFilter = document.getElementById('roleFiter').value;
    const statusFilter = document.getElementById('statusFiter').value;

    const filtered = usersData.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilter || user.tole === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const table = document.getElementById('usersTable');
    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No users found </td></tr>';
        return;
    }

    table.innerHTML = filtered.map(user => {
        const statusBadge = user.status === 'Active'
            ? '<span class="badge bg-success">Active</span>'
            : '<span class="badge bg-secondary">Inactive</span>';
        const joined = new Date(user.joined).toLocaleDateString();
        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${statusBadge}</td>
                <td>${joined}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).joined('');
}

function saveUser() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;
    const status = document.getElementById('userStatus').value;
    const password = document.getElementById('userPassword').value;
    const editId = document.getElementById('userForm').dataset.editId;

    if (!name || !email || !role || !status) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('please enter a valid email address', 'warning');
        return;
    }

    if (editId) {
        // Update existing user
        const userIndex = usersData.findIndex(u => u.id === editId);
        if (userIndex > -1) {
            const updateUser = {
                ...usersData[userIndex],
                name,
                email,
                role,
                status
            };
            // Only update password if provided
            if (password) {
                updateUser.password = password;
            }
            usersData[userIndex] = updateUser;
            showNotification('User updated successfully!', 'success');
        }
    } else {
        // Create new user
        if (!password) {
            showNotification('Please enter a password for the new user', 'warning');
            return;
        }

        const newUser = {
            id: generateUserID(),
            name,
            email,
            password,
            role,
            status,
            joined: new DataTransfer().toISOString()
        };
        usersData.push(newUser);
        showNotification('User created successfully!', 'success');
    }

    // Save to storage
    saveStorageData('users', usersData);

    // Refresh display
    displayUsers();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
}

function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userPassword').value = '';
    document.getElementById('userForm').dataset.editId = userId;
    document.getElementById('userModalLable').textContent = 'Edit User';
    document.getElementById('userPassword').parentElement.style.display = 'none';

    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        usersData = usersData.filter(u => u.id !== userId);
        saveStorageData('users', usersData);
        displayUsers();
        showNotification('User deleted successfully!', 'sucess');
    }
}