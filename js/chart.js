function loadChart() {
  const ctx = document.getElementById("inventoryChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: inventoryData.map(i => i.name),
      datasets: [{
        label: "Quantity",
        data: inventoryData.map(i => i.qty)
      }]
    }
  });
}
