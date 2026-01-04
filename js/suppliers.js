
let suppliersData = [];

document.addEventListener('DOMContentLoaded', function () {
    // Load suppliers from storage
    suppliersData = getStorageData('suppliers');

    // Display suppliers in table
    displaySuppliers();

    // Setup event listeners
    setupSupplierListeners();
});

function setupSupplierListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchSupplier');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterSuppliers();
        });
    }

    // Save supplier button
    const saveBtn = document.getElementById('saveSupplierBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSupplier);
    }

    // Modal reset on close
    const supplierModal = document.getElementById('supplierModal');
    if (supplierModal) {
        supplierModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('supplierForm').reset();
            document.getElementById('supplierForm').dataset.editId = '';
        });
    }
}

function displaySuppliers() {
    const table = document.getElementById('suppliersTable');
    if (!table) return;

    if (suppliersData.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No suppliers found</td></tr>';
        return;
    }

    table.innerHTML = suppliersData.map(supplier => `
        <tr>
            <td>${supplier.id}</td>
            <td><strong>${supplier.name}</strong></td>
            <td>${supplier.contact}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.city}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editSupplier('${supplier.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteSupplier('${supplier.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}
function filterSuppliers() {
    const searchValue = document.getElementById('searchSupplier')?.value.toLowerCase() || '';

    const filtered = suppliersData.filter(supplier =>
        supplier.name.toLowerCase().includes(searchValue) ||
        supplier.email.toLowerCase().includes(searchValue) ||
        supplier.contact.toLowerCase().includes(searchValue)
    );

    const table = document.getElementById('suppliersTable');
    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No suppliers found</td></tr>';
        return;
    }

    table.innerHTML = filtered.map(supplier => `
        <tr>
            <td>${supplier.id}</td>
            <td><strong>${supplier.name}</strong></td>
            <td>${supplier.contact}</td>
            <td>${supplier.email}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.city}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editSupplier('${supplier.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteSupplier('${supplier.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function saveSupplier() {
    const form = document.getElementById('supplierForm');
    const editId = form.dataset.editId;

    const supplierData = {
        id: editId || generateId('suppliers'), // <- call generateId here
        name: document.getElementById('supplierName').value,
        contact: document.getElementById('contactPerson').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        city: document.getElementById('supplierCity').value
    };

    if (editId) {
        const index = suppliersData.findIndex(s => s.id === editId);
        suppliersData[index] = supplierData;
    } else {
        suppliersData.push(supplierData);
    }

    saveStorageData('suppliers', suppliersData);
    displaySuppliers();

    // Close modal
    const modalEl = document.getElementById('supplierModal');
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();

    form.reset();
    form.dataset.editId = '';

    showNotification(editId ? 'Supplier updated successfully!' : 'Supplier added successfully!');
}


function editSupplier(id) {
    const supplier = suppliersData.find(s => s.id === id);
    if (!supplier) return;

    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('contactPerson').value = supplier.contact;
    document.getElementById('supplierEmail').value = supplier.email;
    document.getElementById('supplierPhone').value = supplier.phone;
    document.getElementById('supplierCity').value = supplier.city;

    document.getElementById('supplierForm').dataset.editId = id;

    const modal = new bootstrap.Modal(document.getElementById('supplierModal'));
    modal.show();
}

function deleteSupplier(id) {
    if (confirm('Are you sure you want to delete this supplier?')) {
        suppliersData = suppliersData.filter(s => s.id !== id);
        saveStorageData('suppliers', suppliersData);
        displaySuppliers();
        showNotification('Supplier deleted successfully!');
    }
}
