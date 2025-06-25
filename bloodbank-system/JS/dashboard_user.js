// js/dashboard_user.js
// User Dashboard: Search for donors by city

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.role !== "user") {
  alert("Access denied. Users only.");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcomeUser").textContent = `Welcome, ${user.name}`;
});

// Function to search donors by city
async function searchDonors() {
  const city = document.getElementById("searchCity").value.trim();
  if (!city) {
    alert("Please enter a city to search.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/donors");
    const donors = await res.json();

    const filtered = donors.filter(d => d.city.toLowerCase() === city.toLowerCase());
    const resultContainer = document.getElementById("donorResults");
    resultContainer.innerHTML = "";

    if (filtered.length === 0) {
      resultContainer.textContent = "No donors found in this city.";
      return;
    }

    filtered.forEach(d => {
      const div = document.createElement("div");
      div.className = "donor-card";
      div.innerHTML = `
        <strong>Name:</strong> ${d.name}<br>
        <strong>Blood Group:</strong> ${d.bloodGroup}<br>
        <strong>Mobile:</strong> ${d.mobile}<br>
        <strong>City:</strong> ${d.city}<br>
      `;
      resultContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching donors:", error);
    alert("Server error while searching.");
  }
}

// Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

window.searchDonors = searchDonors;
window.logout = logout;
