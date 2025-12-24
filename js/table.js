function loadTable() {
  const table = document.getElementById("inventoryTable");
  if (!table) return;

  table.innerHTML = "";

  inventoryData.forEach(item => {
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>$${item.price}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}
