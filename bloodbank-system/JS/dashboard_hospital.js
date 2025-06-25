// js/dashboard_hospital.js
// Hospital Dashboard: Shows available blood group stock in circular form

// Step 1: Get logged in hospital user from localStorage
const hospitalUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Step 2: Validate the session - only allow hospitals
if (!hospitalUser || hospitalUser.role !== "hospital") {
  alert("Access denied. Hospitals only.");
  window.location.href = "login.html";
}

// Step 3: When page is ready, show the hospital name and load stock
document.addEventListener("DOMContentLoaded", () => {
  // Display logged-in hospital name in the header
  document.getElementById("hospitalName").textContent = hospitalUser.name;

  // Load and display current blood stock in circular UI
  loadBloodStock();
});

// ==================== Function: Load Blood Stock =======================
// Fetches donors data and calculates blood group counts
async function loadBloodStock() {
  try {
    // Step 1: Get all donors from JSON Server
    const res = await fetch("http://localhost:5000/donors");
    const donors = await res.json();

    // Step 2: Create a count object for each blood group
    const stock = {}; // { 'A+': 2, 'B+': 3, ... }
    donors.forEach(donor => {
      const group = donor.bloodGroup.toUpperCase();
      stock[group] = (stock[group] || 0) + 1;
    });

    // Step 3: Render each blood group as a circle with count
    const container = document.getElementById("bloodStockContainer");
    container.innerHTML = ""; // clear previous content

    for (const group in stock) {
      const circle = document.createElement("div");
      circle.className = "blood-circle";
      circle.innerHTML = `
        <strong>${group}</strong>
        <span>${stock[group]}</span>
      `;
      container.appendChild(circle);
    }
  } catch (error) {
    console.error("Error loading blood stock:", error);
    alert("Failed to load blood stock.");
  }
}

// ==================== Logout Function =======================
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// Make logout globally available for logout button
window.logout = logout;
