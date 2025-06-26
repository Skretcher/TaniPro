// js/hospital_stock.js

const hospitalUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!hospitalUser || hospitalUser.role !== "hospital") {
  alert("Access denied. Hospitals only.");
  window.location.href = "login.html";
}

const API_URL = `http://localhost:5000/hospital_stock`;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("hospitalName").textContent = hospitalUser.name;
  document.getElementById("stockForm").addEventListener("submit", handleStockSubmit);
  loadStockData();
});

let chartRef = null;

// -----------------------------
// Load Stock Data (Table + Chart)
// -----------------------------
async function loadStockData() {
  try {
    const res = await fetch(`${API_URL}?hospitalId=${hospitalUser.id}`);
    const stock = await res.json();

    renderStockTable(stock);
    renderStockChart(stock);
  } catch (error) {
    console.error("Error loading stock data:", error);
    alert("Failed to load stock.");
  }
}

// -----------------------------
// Add / Update Stock Handler
// -----------------------------
async function handleStockSubmit(e) {
  e.preventDefault();
  const bloodGroup = document.getElementById("bloodGroup").value.trim().toUpperCase();
  const units = parseInt(document.getElementById("units").value);

  if (!bloodGroup || isNaN(units)) {
    alert("Please enter valid values.");
    return;
  }

  try {
    // Check if this blood group already exists for this hospital
    const res = await fetch(`${API_URL}?hospitalId=${hospitalUser.id}&bloodGroup=${bloodGroup}`);
    const existing = await res.json();

    if (existing.length > 0) {
      // Update existing
      const stockId = existing[0].id;
      await fetch(`${API_URL}/${stockId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units })
      });
    } else {
      // Add new entry
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: hospitalUser.id,
          bloodGroup,
          units
        })
      });
    }

    document.getElementById("stockForm").reset();
    loadStockData();
  } catch (error) {
    console.error("Error saving stock:", error);
    alert("Failed to save stock.");
  }
}

// -----------------------------
// Render Table View
// -----------------------------
function renderStockTable(stock) {
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";

  stock.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.bloodGroup}</td>
      <td>${entry.units}</td>
      <td>
        <button onclick="editStock('${entry.id}', '${entry.bloodGroup}', ${entry.units})">Edit</button>
        <button onclick="deleteStock('${entry.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -----------------------------
// Render Doughnut Chart
// -----------------------------
function renderStockChart(stock) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  const labels = stock.map(s => s.bloodGroup);
  const data = stock.map(s => s.units);

  if (chartRef) chartRef.destroy(); // Clear previous
  chartRef = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        label: "Blood Stock",
        data,
        backgroundColor: getColors(data.length)
      }]
    }
  });
}

// -----------------------------
// Edit Function (Prefill form)
// -----------------------------
function editStock(id, group, units) {
  document.getElementById("bloodGroup").value = group;
  document.getElementById("units").value = units;
}

// -----------------------------
// Delete Function
// -----------------------------
async function deleteStock(id) {
  if (!confirm("Are you sure you want to delete this stock entry?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadStockData();
  } catch (error) {
    console.error("Error deleting stock:", error);
    alert("Failed to delete.");
  }
}

// -----------------------------
// Chart Colors
// -----------------------------
function getColors(count) {
  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#66BB6A", "#D32F2F"
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}

// -----------------------------
// Logout
// -----------------------------
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
window.logout = logout;
