function showItemsPage() {
    const content = document.querySelector('.flex-grow-1');
    content.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-12">
                <h2>Inventory Items</h2>
                <button class="btn btn-primary mb-3" onclick="showAddItemModal()">+ Add New Item</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card shadow-sm">
                    <div class="card-header">Item List</div>
                    <div class="card-body">
                        <table id="inventoryTable" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    populateItemsTable();
}

function populateItemsTable() {
    const items = getAllItems();
    const tableBody = document.querySelector('#inventoryTable tbody');

    tableBody.innerHTML = '';

    items.forEach(item => {
        const statusClass = getStatusClass(item.status);
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><span class="badge ${statusClass}">${item.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItemAction(${item.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}