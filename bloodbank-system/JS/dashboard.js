// js/dashboard.js
// Role-based redirection to appropriate dashboard and basic logout handling

// Get logged-in user from localStorage
const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

// If not logged in, redirect to login
if (!currentUser) {
  alert("You must be logged in.");
  window.location.href = "login.html";
}

// Redirect to appropriate dashboard page
switch (currentUser.role) {
  case "user":
    if (!window.location.href.includes("dashboard_user.html")) {
      window.location.href = "dashboard_user.html";
    }
    break;
  case "admin":
    if (!window.location.href.includes("dashboard_admin.html")) {
      window.location.href = "dashboard_admin.html";
    }
    break;
  case "hospital":
    if (!window.location.href.includes("dashboard_hospital.html")) {
      window.location.href = "dashboard_hospital.html";
    }
    break;
  default:
    alert("Invalid role.");
    window.location.href = "login.html";
}

// Logout function to clear session and redirect
window.logout = function () {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully.");
  window.location.href = "index.html";
};
