// Dashboard specific functions
function initializeDashboard() {
    // Load inventory data from localStorage
    initializeInventoryData();

    displaySummaryCards();
    displayRecentActivity();
    displayLowStockAlerts();
    initializeChart();
    initializeTable();
}

function displaySummaryCards() {
    const summary = getInventorySummary();
    const summaryCardsContainer = document.getElementById('summaryCards');

    const cards = [
        {
            title: 'Total Items',
            value: summary.totalItems,
            icon: 'box',
            color: 'primary'
        },
        {
            title: 'Total Quantity',
            value: summary.totalQuantity,
            icon: 'boxes',
            color: 'success'
        },
        {
            title: 'Low Stock',
            value: summary.lowStockCount,
            icon: 'exclamation-triangle',
            color: 'warning'
        },
        {
            title: 'Out of Stock',
            value: summary.outOfStockCount,
            icon: 'x-circle',
            color: 'danger'
        },
        {
            title: 'Total Value',
            value: '$' + summary.totalValue.toFixed(2),
            icon: 'dollar-sign',
            color: 'info'
        }
    ];

    summaryCardsContainer.innerHTML = '';

    cards.forEach(card => {
        const cardHtml = `
            <div class="col-md-2 mb-3">
                <div class="card border-left-${card.color} shadow-sm h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="flex-grow-1">
                            <div class="small text-muted">${card.title}</div>
                            <div class="h3 mb-0">${card.value}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        summaryCardsContainer.innerHTML += cardHtml;
    });
}

function displayRecentActivity() {
    const activities = getRecentActivity(5);
    const activityContainer = document.getElementById('recentActivity');

    activityContainer.innerHTML = '';

    activities.forEach(activity => {
        const activityItem = document.createElement('li');
        activityItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        activityItem.innerHTML = `
            <div>
                <strong>${activity.action}</strong><br>
                <small class="text-muted">${activity.item} (${activity.quantity})</small><br>
                <small class="text-secondary">${activity.date}</small>
            </div>
            <span class="badge bg-primary">${activity.user}</span>
        `;
        activityContainer.appendChild(activityItem);
    });
}

function displayLowStockAlerts() {
    const lowStockItems = getLowStockItems();
    const alertsContainer = document.getElementById('lowStockAlerts');

    alertsContainer.innerHTML = '';

    if (lowStockItems.length === 0) {
        alertsContainer.innerHTML = '<p class="text-success">✓ No low stock alerts</p>';
        return;
    }

    lowStockItems.forEach(item => {
        const alertType = item.stock === 0 ? 'danger' : (item.stock <= item.minStock / 2 ? 'danger' : 'warning');
        const alertHtml = `
            <div class="alert alert-${alertType} d-flex justify-content-between align-items-center mb-2" role="alert">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Stock: ${item.stock} / Min: ${item.minStock}</small>
                </div>
                <button class="btn btn-sm btn-outline-secondary" onclick="quickRestockModal(${item.id})">Restock</button>
            </div>
        `;
        alertsContainer.innerHTML += alertHtml;
    });
}

function quickRestockModal(itemId) {
    const item = inventoryData.find(i => i.id === itemId);

    Swal.fire({
        title: `Restock ${item.name}`,
        html: `
            <div class="form-group mb-3">
                <label class="form-label">Current Stock: ${item.stock}</label>
                <input type="number" id="restockQuantity" class="form-control" placeholder="Enter quantity to add" min="1" value="${item.minStock - item.stock}">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Restock',
        preConfirm: () => {
            const quantity = parseInt(document.getElementById('restockQuantity').value);
            if (isNaN(quantity) || quantity <= 0) {
                Swal.showValidationMessage('Please enter a valid quantity');
                return false;
            }
            return quantity;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const newStock = item.stock + result.value;
            updateItem(itemId, { stock: newStock });
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            addActivity('Stock Added', item.name, result.value, user.username);
            refreshDashboard();
            Swal.fire('Success!', `${item.name} restocked by ${result.value} units`, 'success');
        }
    });
}

function refreshDashboard() {
    displaySummaryCards();
    displayRecentActivity();
    displayLowStockAlerts();
    updateChart();
    initializeTable();
}
