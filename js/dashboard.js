
document.addEventListener('DOMContentLoaded', function () {
    loadDashboardStats();
    loadRecentActivity();
});

// Reload stats when page becomes visible (user returns from another page)
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        loadDashboardStats();
        loadRecentActivity();
    }
});

function loadDashboardStats() {
    // Get data from storage
    const products = getStorageData('products');
    const suppliers = getStorageData('suppliers');
    const orders = getStorageData('orders');

    // Calculate statistics
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock <= 10).length;
    const totalSuppliers = suppliers.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    // Update UI
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('totalSuppliers').textContent = totalSuppliers;
    document.getElementById('pendingOrders').textContent = pendingOrders;
}

function loadRecentActivity() {
    const tableBody = document.getElementById('recentActivityTable');
    if (!tableBody) return;

    const orders = getStorageData('orders');
    const products = getStorageData('products');

    if (!orders || orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent activity</td></tr>';
        return;
    }

    const recentOrders = orders.slice(-5).reverse();

    tableBody.innerHTML = recentOrders.map(order => {
        const product = products.find(p => p.id === order.productId);
        const productName = product ? product.name : 'Unknown';
        const date = new Date(order.date).toLocaleDateString();

        const typeBadge = `<span class="badge rounded-pill bg-info text-dark">Order</span>`;

        const statusBadge = getStatusBadge(order.status);

        return `
            <tr>
                <td>${productName}</td>
                <td>${typeBadge}</td>
                <td>${date}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function getStatusBadge(status) {
    const statusMap = {
        'Pending': 'bg-warning text-dark',
        'Confirmed': 'bg-info text-dark',
        'Shipped': 'bg-primary',
        'Delivered': 'bg-success'
    };
    const badgeClass = statusMap[status] || 'bg-secondary';
    return `<span class="badge rounded-pill ${badgeClass}">${status}</span>`;
}

