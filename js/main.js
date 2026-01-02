// =======================
// ORDERS LOGIC
// =======================

const ordersTable = document.getElementById("ordersTable");
const saveOrderBtn = document.getElementById("saveOrderBtn");
const orderForm = document.getElementById("orderForm");
const searchOrder = document.getElementById("searchOrder");
const statusFilter = document.getElementById("statusFilter");

// Load data from localStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];

// 1. POPULATE DROPDOWNS (This fixes the "undefined" issue)
function populateDropdowns() {
    const productSelect = document.getElementById("orderProduct");
    const supplierSelect = document.getElementById("orderSupplier");

    // Clear existing options except the first one
    productSelect.innerHTML = '<option value="">Select Product</option>';
    supplierSelect.innerHTML = '<option value="">Select Supplier</option>';

    products.forEach(product => {
        let opt = document.createElement("option");
        opt.value = product.name; // Assumes your product object has a .name property
        opt.textContent = product.name;
        productSelect.appendChild(opt);
    });

    suppliers.forEach(supplier => {
        let opt = document.createElement("option");
        opt.value = supplier.name; // Assumes your supplier object has a .name property
        opt.textContent = supplier.name;
        supplierSelect.appendChild(opt);
    });
}

// 2. RENDER TABLE
function renderOrders(list = orders) {
    ordersTable.innerHTML = "";

    if (list.length === 0) {
        ordersTable.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No orders found</td></tr>`;
        return;
    }

    list.forEach((order, index) => {
        // Validation to prevent "undefined" showing in UI if data is corrupted
        const productName = order.product || "Unknown Product";
        const supplierName = order.supplier || "Unknown Supplier";
        
        ordersTable.innerHTML += `
            <tr>
                <td>#${index + 1}</td>
                <td>${productName}</td>
                <td>${supplierName}</td>
                <td>${order.quantity}</td>
                <td>${order.date}</td>
                <td><span class="badge ${getStatusClass(order.status)}">${order.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteOrder(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

// Helper for status colors
function getStatusClass(status) {
    switch(status) {
        case 'Pending': return 'bg-warning text-dark';
        case 'Confirmed': return 'bg-info';
        case 'Shipped': return 'bg-primary';
        case 'Delivered': return 'bg-success';
        default: return 'bg-secondary';
    }
}

// 3. SAVE ORDER
saveOrderBtn.addEventListener("click", () => {
    if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
    }

    const newOrder = {
        supplier: document.getElementById("orderSupplier").value,
        product: document.getElementById("orderProduct").value,
        quantity: document.getElementById("orderQuantity").value,
        status: document.getElementById("orderStatus").value,
        date: new Date().toISOString().split('T')[0] // Cleaner date format (YYYY-MM-DD)
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    orderForm.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("orderModal"));
    modal.hide();

    renderOrders();
});

// 4. DELETE ORDER
function deleteOrder(index) {
    if (confirm("Delete this order?")) {
        orders.splice(index, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        renderOrders();
    }
}
// Export function
// function exportToCSV(data, filename) {
//     const csv = convertArrayToCSV(data);
//     const link = document.createElement('a');
//     link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
//     link.download = filename;
//     link.click();
// }

// function convertArrayToCSV(data) {
//     if (!data || data.length === 0) return '';

//     const headers = Object.keys(data[0]);
//     let csv = headers.join(',') + '\n';

//     data.forEach(row => {
//         const values = headers.map(header => {
//             const value = row[header];
//             // Escape quotes in values
//             return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
//         });
//         csv += values.join(',') + '\n';
//     });

//     return csv;
// }

// 5. FILTERS
searchOrder.addEventListener("input", () => {
    const val = searchOrder.value.toLowerCase();
    const filtered = orders.filter(o => 
        o.product.toLowerCase().includes(val) || o.supplier.toLowerCase().includes(val)
    );
    renderOrders(filtered);
});

statusFilter.addEventListener("change", () => {
    const status = statusFilter.value;
    const filtered = status === "" ? orders : orders.filter(o => o.status === status);
    renderOrders(filtered);
});

// INITIALIZE PAGE
populateDropdowns();
renderOrders();



// Show notification toast
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fade-in`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(alertDiv, main.firstChild);
    }

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Format date to YYYY-MM-DD format
function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
}



// Get data from localStorage or return empty array
function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// Delete item from localStorage
function deleteFromStorage(key, id) {
    const data = getStorageData(key);
    const filtered = data.filter(item => item.id !== id);
    saveStorageData(key, filtered);
}

// Generate unique ID
function generateId(storageKey) {
    const data = getStorageData(storageKey) || [];

    if (data.length === 0) {
        return '1';
    }

    const lastId = Math.max(...data.map(item => Number(item.id)));
    return String(lastId + 1);
}
const newProductId = generateId('products');
const newSupplierId = generateId('suppliers');


// Initialize sample data if not exists
function initializeSampleData() {
    // Sample Products
    if (!localStorage.getItem('products')) {
        saveStorageData('products', products);
    }
    // Sample Suppliers
    if (!localStorage.getItem('suppliers')) {
        saveStorageData('suppliers', suppliers);
    }
}


// Call on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeSampleData();
});
