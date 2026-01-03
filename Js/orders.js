
let ordersData = [];
let productsData = [];

document.addEventListener('DOMContentLoaded', function () {
    // Load orders and products from storage
    ordersData = getStorageData('orders') || [];
    productsData = getStorageData('products') || [];

    // Display orders in table
    displayOrders();

    // Setup event listeners
    setupOrderListeners();
});


function setupOrderListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchOrder');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterOrders();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            filterOrders();
        });
    }

    // Save order button
    const saveBtn = document.getElementById('saveOrderBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveOrder);
    }

    // Modal reset on close
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.addEventListener('hidden.bs.modal', function () {
            document.getElementById('orderForm').reset();
            document.getElementById('orderForm').dataset.editId = '';
        });
    }

    // Load products in dropdown
    loadProductsInDropdown();

    // New order button
    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', function () {
            document.getElementById('orderForm').reset();
            document.getElementById('orderForm').dataset.editId = '';
            document.getElementById('orderModalLabel').textContent = 'Create New Order';
            // Refresh products when opening modal
            loadProductsInDropdown();
        });
    }
}

function loadProductsInDropdown() {
    const productSelect = document.getElementById('orderProductId');
    if (!productSelect) return;

    // Refresh products data from storage
    productsData = getStorageData('products');

    if (productsData.length === 0) {
        productSelect.innerHTML = '<option value="">No products available</option>';
        return;
    }

    productSelect.innerHTML = '<option value="">Select a product</option>';
    productsData.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${product.category})`;
        productSelect.appendChild(option);
    });
}

function displayOrders() {
    const table = document.getElementById('ordersTable');
    if (!table) return;

    if (ordersData.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No orders found</td></tr>';
        return;
    }

    table.innerHTML = ordersData.map(order => {
        const product = productsData.find(p => p.id === order.productId);
        const productName = product ? product.name : 'Unknown Product';
        const statusBadge = getStatusBadge(order.status);
        const date = new Date(order.date).toLocaleDateString();

        return `
            <tr>
                <td>${order.id}</td>
                <td>${productName}</td>
                <td>${order.quantity}</td>
                <td>$${parseFloat(order.totalPrice).toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editOrder('${order.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterOrders() {
    const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const filtered = ordersData.filter(order => {
        const product = productsData.find(p => p.id === order.productId);
        const productName = product ? product.name.toLowerCase() : '';
        const matchesSearch = productName.includes(searchTerm) || String(order.id).includes(searchTerm);
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const table = document.getElementById('ordersTable');
    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No orders found</td></tr>';
        return;
    }

    table.innerHTML = filtered.map(order => {
        const product = productsData.find(p => p.id == order.productId);
        const productName = product ? product.name : 'Unknown Product';
        const statusBadge = getStatusBadge(order.status);
        const date = new Date(order.date).toLocaleDateString();

        return `
            <tr>
                <td>${order.id}</td>
                <td>${productName}</td>
                <td>${order.quantity}</td>
                <td>$${parseFloat(order.totalPrice).toFixed(2)}</td>
                <td>${statusBadge}</td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editOrder('${order.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveOrder() {
    const productId = document.getElementById('orderProductId').value;
    const quantity = document.getElementById('orderQuantity').value;
    const status = document.getElementById('orderStatus').value;
    const editId = document.getElementById('orderForm').dataset.editId;

    if (!productId || !quantity || !status) {
        showNotification('Please fill all required fields', 'warning');
        return;
    }

    const product = productsData.find(p => p.id == productId);
    if (!product) {
        showNotification('Selected product not found', 'danger');
        return;
    }

    const totalPrice = parseFloat(product.price) * parseInt(quantity);

    if (editId) {

        const orderIndex = ordersData.findIndex(o => o.id == editId);
        if (orderIndex > -1) {
            ordersData[orderIndex] = {
                ...ordersData[orderIndex],
                productId,
                quantity: parseInt(quantity),
                totalPrice,
                status
            };
            showNotification('Order updated successfully!', 'success');
        }
    } else {
    
        const newOrder = {
            id: generateOrderId(),   // 1, 2, 3, ...
            productId,
            quantity: parseInt(quantity),
            totalPrice,
            status,
            date: new Date().toISOString()
        };

        ordersData.push(newOrder); 
        showNotification('Order created successfully!', 'success');
    }

    saveStorageData('orders', ordersData);
    displayOrders();

    const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
    modal.hide();
}


function generateOrderId() {
    if (!ordersData || ordersData.length === 0) {
        return 1;
    }

    const ids = ordersData
        .map(o => Number(o.id))
        .filter(id => !isNaN(id));

    return ids.length ? Math.max(...ids) + 1 : 1;
}

function editOrder(orderId) {
    const order = ordersData.find(o => o.id === Number(orderId));
    if (!order) return;

    document.getElementById('orderProductId').value = order.productId;
    document.getElementById('orderQuantity').value = order.quantity;
    document.getElementById('orderStatus').value = order.status;
    document.getElementById('orderForm').dataset.editId = order.id;
    document.getElementById('orderModalLabel').textContent = 'Edit Order';

    new bootstrap.Modal(document.getElementById('orderModal')).show();
}


function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        ordersData = ordersData.filter(o => o.id !== Number(orderId));

        saveStorageData('orders', ordersData);
        displayOrders();
        showNotification('Order deleted successfully!', 'success');
    }
}

function getStatusBadge(status) {
    const statusMap = {
        'Pending': 'warning',
        'Confirmed': 'info',
        'Shipped': 'primary',
        'Delivered': 'success'
    };

    const badgeClass = statusMap[status] || 'secondary';
    return `<span class="badge bg-${badgeClass}">${status}</span>`;

}
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
