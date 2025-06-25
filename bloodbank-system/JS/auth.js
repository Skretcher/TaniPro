// js/auth.js

// ===================== REGISTER USER SCRIPT =======================

// Get the register form element
const registerForm = document.getElementById("registerForm");

// Check if the page has the form
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page reload on submit

    // Capture form inputs
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const city = document.getElementById("city").value.trim();
    const bloodGroup = document.getElementById("bloodGroup").value.trim();

    // Validate all fields
    if (!name || !email || !password || !role || !mobile || !city || !bloodGroup) {
      alert("Please fill in all fields.");
      return;
    }

    // Determine the correct endpoint (users/admins/hospitals)
    const endpoint = `http://localhost:5000/${role}s`; // users, admins, hospitals

    // First: Check if the email already exists in *any* collection
    const rolesToCheck = ["users", "admins", "hospitals"];
    let emailExists = false;

    for (const r of rolesToCheck) {
      const res = await fetch(`http://localhost:5000/${r}?email=${email}`);
      const data = await res.json();
      if (data.length > 0) {
        emailExists = true;
        break;
      }
    }

    if (emailExists) {
      alert("This email is already registered.");
      return;
    }

    // Prepare user data
    const newUser = {
      id: Date.now(), // unique ID
      name,
      email,
      password,
      role,           // will be "user", "admin", or "hospital"
      mobile,
      city,
      bloodGroup,
      registeredAt: new Date().toISOString()
    };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        alert(`${role} registered successfully!`);
        window.location.href = "login.html";
      } else {
        alert("Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Please try later.");
    }
  });
}
// ===================== LOGIN SCRIPT ==========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = new URLSearchParams(window.location.search).get("role");

    if (!email || !password || !role) {
      alert("Please fill all fields and select a valid role.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/${role}s`); // e.g. /users, /admins, /hospitals
      const data = await res.json();

      const matchedUser = data.find(
        user => user.email === email && user.password === password
      );

      if (matchedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        alert("Login successful!");

        // Redirect based on role
        if (role === "admin") {
          window.location.href = "dashboard_admin.html";
        } else if (role === "hospital") {
          window.location.href = "dashboard_hospital.html";
        } else {
          window.location.href = "dashboard.html";
        }
      } else {
        alert("Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    }
  });
}
