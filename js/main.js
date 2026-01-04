
// Initialize sample data if none exists
function initializeData() {
    if (!localStorage.getItem("products") || JSON.parse(localStorage.getItem("products")).length === 0) {
        const sampleProducts = [
            { id: "1", name: "Laptop", category: "Electronics", price: 999.99, stock: 15, supplier: "1" },
            { id: "2", name: "Mouse", category: "Accessories", price: 29.99, stock: 5, supplier: "1" },
            { id: "3", name: "Keyboard", category: "Accessories", price: 79.99, stock: 20, supplier: "2" }
        ];
        localStorage.setItem("products", JSON.stringify(sampleProducts));
    }

    if (!localStorage.getItem("suppliers") || JSON.parse(localStorage.getItem("suppliers")).length === 0) {
        const sampleSuppliers = [
            { id: "1", name: "TechCorp", email: "info@techcorp.com", phone: "123-456-7890", location: "New York" },
            { id: "2", name: "ElectroSupply", email: "contact@electrosupply.com", phone: "098-765-4321", location: "Los Angeles" }
        ];
        localStorage.setItem("suppliers", JSON.stringify(sampleSuppliers));
    }

    if (!localStorage.getItem("orders") || JSON.parse(localStorage.getItem("orders")).length === 0) {
        const sampleOrders = [
        ];
        localStorage.setItem("orders", JSON.stringify(sampleOrders));
    }
}

// Run initialization on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeData);
} else {
    initializeData();
}




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
const newOrderId = generateId('orders');


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

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}

