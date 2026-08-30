function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
initTheme();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function roleName(role) {
  return {
    retailer: "Retailer Staff",
    dispatcher: "Dispatcher",
    rider: "Rider"
  }[role] || "User";
}

function currentRole() {
  let role = document.body.dataset.role || localStorage.getItem("reflex_role");
  if (role === "retailer_staff") role = "retailer";
  return role || "retailer";
}

function basePath() {
  return currentRole() === "retailer" ? "../" : "../";
}

function navItems(role) {
  if (role === "retailer") {
    return [
      ["dashboard.html", "Dashboard"],
      ["deliveries.html", "Deliveries"],
      ["create_delivery.html", "Create Delivery"]
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
    ["scan.html", "Scan Confirmation"]
  ];
}

function buildShell(content, activeFile) {
  const role = currentRole();
  const nav = navItems(role).map(([file, label]) => {
    const active = file === activeFile ? "active" : "";
    return `<a class="nav_link ${active}" href="${file}">${label}</a>`;
  }).join("");

  const app = document.getElementById("app");
  if (app.querySelector(".app_shell")) {
    app.querySelector(".content").innerHTML = content;
    return;
  }

  app.innerHTML = `
    <div class="app_shell">
      <aside class="sidebar" style="display: flex; flex-direction: column;">
        <a href="../index.html" class="sidebar_brand" style="color: inherit;">REFLEX</a>
        <div class="sidebar_role">${roleName(role).toUpperCase()}</div>
        <nav class="nav_list">${nav}</nav>
        
        <div style="margin-top: auto;">
          <a class="nav_link" href="../index.html" style="color: #98a2b3;">&larr; Back to Website</a>
          <a class="nav_link logout_link" href="../login.html" onclick="localStorage.removeItem('reflex_token'); localStorage.removeItem('reflex_role'); sessionStorage.clear();" style="margin-top: 4px;">Sign out</a>
        </div>
      </aside>

      <section class="main_area">
        <header class="topbar">
          <div class="topbar_title">Delivery Management System</div>
          <div class="user_area">
            <button onclick="toggleTheme()" class="ghost_button theme_toggle" style="padding: 6px 10px; font-size: 16px; border: none; background: transparent;" title="Toggle Theme">🌓</button>
            <span>${roleName(role)}</span>
            <span class="user_circle">${roleName(role).charAt(0)}</span>
          </div>
        </header>
        <main class="content">${content}</main>
      </section>
    </div>
  `;
}

let syncInterval = null;
function enableAutoSync(syncFunction, intervalMs = 5000) {
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(syncFunction, intervalMs);
}

function statusBadge(status) {
  const cls = status.toLowerCase().replaceAll(" ", "_");
  return `<span class="status ${cls}">${status}</span>`;
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi"
  });
}

function getDelivery(id) {
  return getData().deliveries.find(item => item.id === id);
}

function queryDeliveryId() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id || id === "null" || id === "undefined") return null;
  return id;
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
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const res = await api.login(email, password);
        localStorage.setItem("reflex_token", res.access_token);
        localStorage.setItem("reflex_role", res.role);

        const target = {
          retailer_staff: "retailer/dashboard.html",
          dispatcher: "dispatcher/dashboard.html",
          rider: "rider/dashboard.html"
        }[res.role];

        if (target) window.location.href = target;
      } catch (err) {
        alert(err.message);
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async event => {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const role = document.getElementById("role").value;
      
      const phoneInput = document.getElementById("phone");
      const phone = phoneInput ? phoneInput.value.trim() : null;

      try {
        const res = await api.register(name, email, password, role, phone);
        localStorage.setItem("reflex_token", res.access_token);
        localStorage.setItem("reflex_role", res.role);

        const target = {
          retailer_staff: "retailer/dashboard.html",
          dispatcher: "dispatcher/dashboard.html",
          rider: "rider/dashboard.html"
        }[res.role];

        if (target) window.location.href = target;
      } catch (err) {
        alert(err.message);
      }
    });
  }
});
