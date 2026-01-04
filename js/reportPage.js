// load products from localStorage
let reportProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    reportProducts = getStorageData('products');
    loadStockReport();
});


function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function loadStockReport() {
    const tableBody = document.getElementById('stockReportTable');
    const totalValueEl = document.getElementById('totalInventoryValue');
    const lowStockEl = document.getElementById('lowStockCount');

    tableBody.innerHTML = '';

    if (reportProducts.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              No data available
            </td>
          </tr>
        `;
        return;
    }

    let totalValue = 0;
    let lowStockCount = 0;

    reportProducts.forEach(product => {

        // Stock status logic
        let status = 'In Stock';
        let badge = 'bg-success';

        if (product.stock === 0) {
            status = 'Out of Stock';
            badge = 'bg-danger';
        } else if (product.stock <= 10) {
            status = 'Low Stock';
            badge = 'bg-warning text-dark';
            lowStockCount++;
        }


        totalValue += product.stock * product.price;

        tableBody.innerHTML += `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.stock}</td>
            <td>10</td>
            <td><span class="badge ${badge}">${status}</span></td>
            <td>${formatDate(new Date())}</td>
          </tr>
        `;
    });

    totalValueEl.innerText = formatCurrency(totalValue);
    lowStockEl.innerText = lowStockCount;
}
document.getElementById('exportBtn').addEventListener('click', () => {
    const reportSection = document.getElementById('stockReportSection');

    if (!reportSection) {
        alert("Nothing to export");
        return;
    }

    // --- Export PDF ---
    const pdfOptions = {
        margin: 0.5,
        filename: 'Stock_Inventory_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(pdfOptions).from(reportSection).save();

    // --- Export Excel ---
    const table = reportSection.querySelector('table');
    if (table) {
        const wb = XLSX.utils.table_to_book(table, { sheet: "Stock Report" });
        XLSX.writeFile(wb, "Stock_Inventory_Report.xlsx");
    }
});






