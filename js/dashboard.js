document.addEventListener('DOMContentLoaded', function () {
    loaDashboardStats();
    loadRecentActivity();
});

// Reload stats 
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        loaDashboardStats();
        loadRecentActivity();
    }
});

function loaDashboardStats() {
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
    const table = document.getElementById('recentActivityTable');
    if (!table) return;

    const orders = getStorageData('orders');
    const products = getStorageData('products');

    if (orders.length === 0) {
        table.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No recent activity</td></tr>';
        return;
    }

    // Get last 5 orders
    const recentOrders = orders.slice(-5).reverse();

    table.innerHTML = recentOrders.map(order => {
        const product = products.find(p => p.id === order.productId);
        const date = new Date(order.data).toLocaleDateString();
        const statusBadge = getStatusBadge(order.status);

        return `
            <tr>
                <td>${product ?  product.name : 'Unknown'}</td>
                <td><span class="badge badge-info">Order</span></td>
                <td>${date}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

function getStatusBadge(status) {
    const statusMap = {
        'Pending': 'warning',
        'Confirmed': 'info',
        'Shipped': 'primary',
        'Delivered': 'success'
    };

    const badgeClass = statusMap[status] || 'secondary';
    return `<span class="badge badge-${badgeClass}">${status}</span>`;
}