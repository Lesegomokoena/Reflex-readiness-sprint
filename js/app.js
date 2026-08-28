function roleName(role) {
  return {
    retailer: "Retailer Staff",
    dispatcher: "Dispatcher",
    rider: "Rider"
  }[role] || "User";
}

function currentRole() {
  return document.body.dataset.role || localStorage.getItem("reflex_role") || "retailer";
}

function basePath() {
  return currentRole() === "retailer" ? "../" : "../";
}

function navItems(role) {
  if (role === "retailer") {
    return [
      ["dashboard.html", "Dashboard"],
      ["deliveries.html", "Deliveries"],
      ["create_delivery.html", "Create Delivery"],
      ["delivery_details.html", "Delivery Details"]
    ];
  }

  if (role === "dispatcher") {
    return [
      ["dashboard.html", "Dashboard"],
      ["requests.html", "Requests"],
      ["assignments.html", "Assignments"],
      ["riders.html", "Riders"]
    ];
  }

  return [
    ["dashboard.html", "Dashboard"],
    ["deliveries.html", "My Deliveries"],
    ["delivery_details.html", "Delivery Details"],
    ["scan.html", "Scan Confirmation"]
  ];
}

function buildShell(content, activeFile) {
  const role = currentRole();
  const nav = navItems(role).map(([file, label]) => {
    const active = file === activeFile ? "active" : "";
    return `<a class="nav_link ${active}" href="${file}">${label}</a>`;
  }).join("");

  document.getElementById("app").innerHTML = `
    <div class="app_shell">
      <aside class="sidebar">
        <div class="sidebar_brand">REFLEX</div>
        <div class="sidebar_role">${roleName(role).toUpperCase()}</div>
        <nav class="nav_list">${nav}</nav>
        <a class="nav_link logout_link" href="../index.html" onclick="localStorage.removeItem('reflex_role')">Sign out</a>
      </aside>

      <section class="main_area">
        <header class="topbar">
          <div class="topbar_title">Delivery Management System</div>
          <div class="user_area">
            <span>${roleName(role)}</span>
            <span class="user_circle">${roleName(role).charAt(0)}</span>
          </div>
        </header>
        <main class="content">${content}</main>
      </section>
    </div>
  `;
}

function statusBadge(status) {
  const cls = status.toLowerCase().replaceAll(" ", "_");
  return `<span class="status ${cls}">${status}</span>`;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function getDelivery(id) {
  return getData().deliveries.find(item => item.id === id);
}

function queryDeliveryId() {
  return new URLSearchParams(window.location.search).get("id");
}

function bindCommon() {
  document.querySelectorAll("[data-reset]").forEach(button => {
    button.addEventListener("click", () => {
      resetData();
      window.location.reload();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", event => {
      event.preventDefault();
      const role = document.getElementById("role").value;
      localStorage.setItem("reflex_role", role);

      const target = {
        retailer: "retailer/dashboard.html",
        dispatcher: "dispatcher/dashboard.html",
        rider: "rider/dashboard.html"
      }[role];

      window.location.href = target;
    });
  }
});
