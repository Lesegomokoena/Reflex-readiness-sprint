function dispatcherStats(deliveries) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return {
    open: deliveries.filter(d => d.status === "Pending").length,
    assigned: deliveries.filter(d => d.status === "Assigned").length,
    progress: deliveries.filter(d => d.status === "Picked Up").length,
    delivered: deliveries.filter(d => {
      if (d.status !== "Delivered") return false;
      return new Date(d.updatedAt) >= todayStart;
    }).length
  };
}

function requestTable(deliveries) {
  if (!deliveries.length) {
    return `<div class="empty_state">No open requests.</div>`;
  }

  return `
    <div class="table_wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Item</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${deliveries.map(d => `
            <tr>
              <td><strong>${d.id}</strong></td>
              <td>${d.customer}</td>
              <td>${d.address}</td>
              <td>${d.item}</td>
              <td>${formatDateTime(d.createdAt)}</td>
              <td><a class="small_button" href="assignments.html?id=${d.id}">Assign Rider</a></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function dispatcherDashboard() {
  const deliveries = await api.getDeliveries();
  const riders = await api.getRiders();
  const s = dispatcherStats(deliveries);

  const riderStats = riders.map(r => {
    const active = deliveries.filter(d => d.riderId === r.id && (d.status === "Assigned" || d.status === "Picked Up")).length;
    const completed = deliveries.filter(d => d.riderId === r.id && d.status === "Delivered").length;
    return {
      ...r,
      activeDeliveries: active,
      completedDeliveries: completed,
      status: active > 0 ? "Busy" : "Available"
    };
  });

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Dispatcher Dashboard</h1>
        <p>Manage open requests, assignments and delivery progress.</p>
      </div>
    </div>

    <section class="stats">
      <div class="stat_card"><div class="stat_label">Open Requests</div><div class="stat_value">${s.open}</div><div class="stat_note">Waiting for assignment</div></div>
      <div class="stat_card"><div class="stat_label">Assigned</div><div class="stat_value">${s.assigned}</div><div class="stat_note">Rider assigned</div></div>
      <div class="stat_card"><div class="stat_label">In Progress</div><div class="stat_value">${s.progress}</div><div class="stat_note">Picked up</div></div>
      <div class="stat_card"><div class="stat_label">Delivered</div><div class="stat_value">${s.delivered}</div><div class="stat_note">Completed today</div></div>
    </section>

    <div class="grid_two">
      <section class="panel">
        <div class="panel_header">
          <h2>Open Delivery Requests</h2>
          <a class="muted" href="requests.html">View all</a>
        </div>
        ${requestTable(deliveries.filter(d => d.status === "Pending").slice(0, 6))}
      </section>

      <section class="panel">
        <div class="panel_header"><h2>Rider Overview</h2></div>
        <div class="table_wrap">
          <table>
            <thead><tr><th>Rider</th><th>Phone</th><th>Status</th><th>Active</th><th>Completed</th></tr></thead>
            <tbody>
              ${riderStats.map(r => `
                <tr>
                  <td>${r.name}</td>
                  <td>${r.phone || "-"}</td>
                  <td>${statusBadge(r.status)}</td>
                  <td>${r.activeDeliveries}</td>
                  <td>${r.completedDeliveries}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `, "dashboard.html");
}

async function dispatcherRequests() {
  const deliveries = await api.getDeliveries();
  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Delivery Requests</h1>
        <p>Open requests waiting for rider assignment.</p>
      </div>
    </div>

    <section class="panel">
      <div class="panel_header"><h2>Open Requests</h2></div>
      ${requestTable(deliveries.filter(d => d.status === "Pending"))}
    </section>
  `, "requests.html");
}

async function dispatcherAssignments() {
  const deliveries = await api.getDeliveries();
  const deliveryId = queryDeliveryId();
  let delivery = null;
  if (deliveryId) {
    try {
      delivery = await api.getDelivery(deliveryId);
    } catch (e) {}
  }

  if (!delivery) {
    buildShell(`
      <div class="page_heading">
        <div>
          <h1>Assignments</h1>
          <p>Select an open request to assign a rider.</p>
        </div>
      </div>
      <section class="panel">
        <div class="panel_header"><h2>Requests Awaiting Assignment</h2></div>
        ${requestTable(deliveries.filter(d => d.status === "Pending"))}
      </section>
    `, "assignments.html");
    return;
  }

  const riders = await api.getRiders();
  const availableRiders = riders;

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Assign ${delivery.id}</h1>
        <p>Choose a rider for this delivery request.</p>
      </div>
      ${statusBadge(delivery.status)}
    </div>

    <section class="panel">
      <div class="panel_header"><h2>Delivery Summary</h2></div>
      <div class="panel_body">
        <div class="detail_grid">
          <div class="detail_item"><small>Customer</small><strong>${delivery.customer}</strong></div>
          <div class="detail_item"><small>Phone</small><strong>${delivery.phone}</strong></div>
          <div class="detail_item"><small>Address</small><strong>${delivery.address}</strong></div>
          <div class="detail_item"><small>Item</small><strong>${delivery.item}</strong></div>
        </div>

        <form id="assignmentForm">
          <label for="rider">Select Rider</label>
          <select id="rider" required>
            <option value="">Choose rider</option>
            ${availableRiders.map(r => `<option value="${r.id}">${r.name}</option>`).join("")}
          </select>

          <div class="form_actions">
            <button class="dark_button" type="submit">Assign Delivery</button>
            <a class="ghost_button" href="requests.html">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  `, "assignments.html");

  document.getElementById("assignmentForm").addEventListener("submit", async event => {
    event.preventDefault();

    const riderId = document.getElementById("rider").value;
    try {
      await api.assignRider(delivery.id, riderId);
      window.location.href = `assignments.html?id=${delivery.id}`;
    } catch (err) {
      alert(err.message);
    }
  });
}

async function dispatcherRiders() {
  const riders = await api.getRiders();
  const deliveries = await api.getDeliveries();

  const riderStats = riders.map(r => {
    const active = deliveries.filter(d => d.riderId === r.id && (d.status === "Assigned" || d.status === "Picked Up")).length;
    const completed = deliveries.filter(d => d.riderId === r.id && d.status === "Delivered").length;
    return {
      ...r,
      activeDeliveries: active,
      completedDeliveries: completed,
      status: active > 0 ? "Busy" : "Available"
    };
  });

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Riders</h1>
        <p>Review rider availability and current delivery load.</p>
      </div>
    </div>

    <section class="panel">
      <div class="panel_header"><h2>Rider List</h2></div>
      <div class="table_wrap">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Status</th><th>Active</th><th>Completed</th></tr></thead>
          <tbody>
            ${riderStats.map(r => `
              <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.phone || "-"}</td>
                <td>${statusBadge(r.status)}</td>
                <td>${r.activeDeliveries}</td>
                <td>${r.completedDeliveries}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `, "riders.html");
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.role !== "dispatcher") return;

  const path = window.location.pathname;

  if (path.endsWith("requests.html")) {
    dispatcherRequests();
    enableAutoSync(dispatcherRequests);
  }
  else if (path.endsWith("assignments.html")) {
    dispatcherAssignments();
    // We shouldn't auto-sync assignments fully because it contains a form select that would get reset.
  }
  else if (path.endsWith("riders.html")) {
    dispatcherRiders();
    enableAutoSync(dispatcherRiders);
  }
  else {
    dispatcherDashboard();
    enableAutoSync(dispatcherDashboard);
  }
});
