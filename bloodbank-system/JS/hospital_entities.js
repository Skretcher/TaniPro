// js/hospital_entities.js

const hospital = JSON.parse(localStorage.getItem("loggedInUser"));
if (!hospital || hospital.role !== "hospital") {
  alert("Access denied. Hospitals only.");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("hospitalName").textContent = hospital.name;
  loadDonors();
  loadReceivers();

  document.getElementById("donorForm").addEventListener("submit", handleDonorForm);
  document.getElementById("receiverForm").addEventListener("submit", handleReceiverForm);
});

// ---------------- DONORS ----------------

async function loadDonors() {
  const res = await fetch(`http://localhost:5000/hospital_donors?hospitalId=${hospital.id}`);
  const donors = await res.json();
  displayTable("donorTable", donors, "donor");
}

async function handleDonorForm(e) {
  e.preventDefault();
  const id = document.getElementById("donorId").value;
  const donor = {
    name: document.getElementById("donorName").value,
    bloodGroup: document.getElementById("donorBloodGroup").value,
    mobile: document.getElementById("donorMobile").value,
    city: document.getElementById("donorCity").value,
    hospitalId: hospital.id
  };

  const url = id
    ? `http://localhost:5000/hospital_donors/${id}`
    : `http://localhost:5000/hospital_donors`;

  const method = id ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donor)
  });

  if (res.ok) {
    loadDonors();
    e.target.reset();
    document.getElementById("donorId").value = "";
  }
}

async function editDonor(id) {
  const res = await fetch(`http://localhost:5000/hospital_donors/${id}`);
  const donor = await res.json();

  document.getElementById("donorId").value = donor.id;
  document.getElementById("donorName").value = donor.name;
  document.getElementById("donorBloodGroup").value = donor.bloodGroup;
  document.getElementById("donorMobile").value = donor.mobile;
  document.getElementById("donorCity").value = donor.city;
}

async function deleteDonor(id) {
  if (confirm("Delete this donor?")) {
    await fetch(`http://localhost:5000/hospital_donors/${id}`, { method: "DELETE" });
    loadDonors();
  }
}

function filterDonors() {
  const search = document.getElementById("searchDonor").value.toLowerCase();
  const rows = document.querySelectorAll("#donorTable tr");
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(search) ? "" : "none";
  });
}

// ---------------- RECEIVERS ----------------

async function loadReceivers() {
  const res = await fetch(`http://localhost:5000/hospital_receivers?hospitalId=${hospital.id}`);
  const receivers = await res.json();
  displayTable("receiverTable", receivers, "receiver");
}

async function handleReceiverForm(e) {
  e.preventDefault();
  const id = document.getElementById("receiverId").value;
  const receiver = {
    name: document.getElementById("receiverName").value,
    bloodGroup: document.getElementById("receiverBloodGroup").value,
    mobile: document.getElementById("receiverMobile").value,
    city: document.getElementById("receiverCity").value,
    hospitalId: hospital.id
  };

  const url = id
    ? `http://localhost:5000/hospital_receivers/${id}`
    : `http://localhost:5000/hospital_receivers`;

  const method = id ? "PUT" : "POST";
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receiver)
  });

  if (res.ok) {
    loadReceivers();
    e.target.reset();
    document.getElementById("receiverId").value = "";
  }
}

async function editReceiver(id) {
  const res = await fetch(`http://localhost:5000/hospital_receivers/${id}`);
  const receiver = await res.json();

  document.getElementById("receiverId").value = receiver.id;
  document.getElementById("receiverName").value = receiver.name;
  document.getElementById("receiverBloodGroup").value = receiver.bloodGroup;
  document.getElementById("receiverMobile").value = receiver.mobile;
  document.getElementById("receiverCity").value = receiver.city;
}

async function deleteReceiver(id) {
  if (confirm("Delete this receiver?")) {
    await fetch(`http://localhost:5000/hospital_receivers/${id}`, { method: "DELETE" });
    loadReceivers();
  }
}

function filterReceivers() {
  const search = document.getElementById("searchReceiver").value.toLowerCase();
  const rows = document.querySelectorAll("#receiverTable tr");
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(search) ? "" : "none";
  });
}

// ---------------- TABLE RENDERING ----------------

function displayTable(tableId, list, type) {
  const tbody = document.getElementById(tableId);
  tbody.innerHTML = "";
  list.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.bloodGroup}</td>
      <td>${item.mobile}</td>
      <td>${item.city}</td>
      <td>
        <button onclick="edit${capitalize(type)}(${item.id})">Edit</button>
        <button onclick="delete${capitalize(type)}(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}
window.logout = logout;
