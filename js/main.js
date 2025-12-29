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

// Export function
function exportToCSV(data, filename) {
    const csv = convertArrayToCSV(data);
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = filename;
    link.click();
}

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



