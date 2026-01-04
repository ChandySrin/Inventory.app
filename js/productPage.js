
let productsData = [];

document.addEventListener('DOMContentLoaded', function () {
    // Load products from storage
    productsData = getStorageData('products');

    // Display products in table
    displayProducts();

    // Setup event listeners
    setupProductListeners();
});

function setupProductListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchProduct');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterProducts();
        });
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            filterProducts();
        });
    }

    // Save product button
    const saveBtn = document.getElementById('saveProductBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProduct);
    }

    // Modal reset on close
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('productForm').reset();
            document.getElementById('productForm').dataset.editId = '';
        });
    }

    // Load suppliers in dropdown
    loadSuppliersInDropdown();
}
function generateId() {
    const products = getStorageData('products') || [];
    if (products.length === 0) return '1';
    const lastId = Math.max(...products.map(p => Number(p.id)));
    return String(lastId + 1);

}



function displayProducts() {
    const table = document.getElementById('productsTable');
    if (!table) return;

    if (productsData.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No products found</td></tr>';
        return;
    }

    table.innerHTML = productsData.map(product => {
        const supplier = getSupplierName(product.supplier);
        const stockStatus =
            product.stock <= 10
                ? 'bg-danger'
                : product.stock <= 20
                    ? 'bg-warning text-dark'
                    : 'bg-success';

        const stockBadge = product.stock <= 10 ? 'Low Stock' : product.stock <= 20 ? 'Medium' : 'Good';

        return `
            <tr>
                <td>${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>
                    <span class="badge ${stockStatus}">${product.stock} (${stockBadge})</span>
                </td>
                <td>${supplier}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${product.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterProducts() {
    const searchValue = document.getElementById('searchProduct')?.value.toLowerCase() || '';
    const categoryValue = document.getElementById('categoryFilter')?.value || '';

    const filtered = productsData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchValue);
        const matchesCategory = !categoryValue || product.category === categoryValue;
        return matchesSearch && matchesCategory;
    });

    const table = document.getElementById('productsTable');
    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No products found</td></tr>';
        return;
    }

    table.innerHTML = filtered.map(product => {
        const supplier = getSupplierName(product.supplier);
        const stockStatus =
            product.stock <= 10
                ? 'bg-danger'
                : product.stock <= 20
                    ? 'bg-warning text-dark'
                    : 'bg-success';
        const stockBadge = product.stock <= 10 ? 'Low Stock' : product.stock <= 20 ? 'Medium' : 'Good';

        return `
            <tr>
                <td>${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>
                    <span class="badge badge-${stockStatus}">${product.stock} (${stockBadge})</span>
                </td>
                <td>${supplier}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editProduct('${product.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveProduct() {
    const form = document.getElementById('productForm');
    const editId = form.dataset.editId;

    const productData = {
        id: editId || generateId(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        supplier: document.getElementById('productSupplier').value
    };

    if (editId) {
        // Update existing product
        const index = productsData.findIndex(p => p.id === editId);
        if (index !== -1) {
            productsData[index] = productData;
        }
    } else {
        // Add new product
        productsData.push(productData);
    }

    saveStorageData('products', productsData);
    displayProducts();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();

    form.reset();
    form.dataset.editId = '';

    showNotification(editId ? 'Product updated successfully!' : 'Product added successfully!');
}

function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productSupplier').value = product.supplier;

    document.getElementById('productForm').dataset.editId = id;

    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        productsData = productsData.filter(p => String(p.id) !== String(id));
        saveStorageData('products', productsData);
        displayProducts();
        showNotification('Product deleted successfully!');
    }
}

function getSupplierName(supplierId) {
    const suppliers = getStorageData('suppliers');
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
}

function loadSuppliersInDropdown() {
    const dropdown = document.getElementById('productSupplier');
    if (!dropdown) return;

    const suppliers = getStorageData('suppliers');
    if (suppliers.length === 0) {
        dropdown.innerHTML = '<option value="">No suppliers available</option>';
        return;
    }

    dropdown.innerHTML = '<option value="">Select Supplier</option>' +
        suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
}
