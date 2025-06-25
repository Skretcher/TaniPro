// js/dashboard_admin.js
// Admin Dashboard: Manage all users, hospitals, and view donation requests

const adminUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!adminUser || adminUser.role !== "admin") {
  alert("Access denied. Admins only.");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("adminName").textContent = adminUser.name;
  loadAllUsers();
  loadAllHospitals();
  loadAllRequests();
});

// ================== Load All Users ====================
async function loadAllUsers() {
  try {
    const res = await fetch("http://localhost:5000/users");
    const users = await res.json();
    const container = document.getElementById("userList");
    container.innerHTML = "<h3>Registered Users:</h3>";
    users.forEach(user => {
      const div = document.createElement("div");
      div.className = "list-card";
      div.innerHTML = `
        <strong>${user.name}</strong> (${user.bloodGroup})<br>
        ${user.email} | ${user.city} | ${user.mobile}
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load users:", err);
  }
}

// ================== Load All Hospitals ====================
async function loadAllHospitals() {
  try {
    const res = await fetch("http://localhost:5000/hospitals");
    const hospitals = await res.json();
    const container = document.getElementById("hospitalList");
    container.innerHTML = "<h3>Registered Hospitals:</h3>";
    hospitals.forEach(hospital => {
      const div = document.createElement("div");
      div.className = "list-card";
      div.innerHTML = `
        <strong>${hospital.name}</strong><br>
        ${hospital.email}
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load hospitals:", err);
  }
}

// ================== Load All Requests ====================
async function loadAllRequests() {
  try {
    const res = await fetch("http://localhost:5000/requests");
    const requests = await res.json();
    const container = document.getElementById("requestList");
    container.innerHTML = "<h3>Blood Requests:</h3>";
    requests.forEach(req => {
      const div = document.createElement("div");
      div.className = "list-card";
      div.innerHTML = `
        <strong>${req.name}</strong> requested <strong>${req.bloodGroup}</strong><br>
        Location: ${req.city} | Contact: ${req.mobile}
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load requests:", err);
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
window.logout = logout;
