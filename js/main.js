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
function generateId() {
    const products = getStorageData('products');

    if (products.length === 0) {
        return '1';
    }
    const lastId = Math.max(...products.map(p => Number(p.id)));
    return String(lastId + 1);
}

// Initialize sample data if not exists
function initializeSampleData() {
    // Sample Products
    if (!localStorage.getItem('products')) {
        saveStorageData('products', products);
    }

}


// Call on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeSampleData();
});




