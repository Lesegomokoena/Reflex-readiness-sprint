function dispatcherStats(deliveries) {
  return {
    open: deliveries.filter(d => d.status === "Pending").length,
    assigned: deliveries.filter(d => d.status === "Assigned").length,
    progress: deliveries.filter(d => d.status === "Picked Up").length,
    delivered: deliveries.filter(d => d.status === "Delivered").length
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

function dispatcherDashboard() {
  const data = getData();
  const s = dispatcherStats(data.deliveries);

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
        ${requestTable(data.deliveries.filter(d => d.status === "Pending").slice(0, 6))}
      </section>

      <section class="panel">
        <div class="panel_header"><h2>Rider Overview</h2></div>
        <div class="table_wrap">
          <table>
            <thead><tr><th>Rider</th><th>Status</th><th>Deliveries</th></tr></thead>
            <tbody>
              ${data.riders.map(r => `
                <tr>
                  <td>${r.name}</td>
                  <td>${statusBadge(r.status)}</td>
                  <td>${r.deliveries}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `, "dashboard.html");
}

function dispatcherRequests() {
  const data = getData();
  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Delivery Requests</h1>
        <p>Open requests waiting for rider assignment.</p>
      </div>
    </div>

    <section class="panel">
      <div class="panel_header"><h2>Open Requests</h2></div>
      ${requestTable(data.deliveries.filter(d => d.status === "Pending"))}
    </section>
  `, "requests.html");
}

function dispatcherAssignments() {
  const data = getData();
  const delivery = queryDeliveryId() ? getDelivery(queryDeliveryId()) : null;

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
        ${requestTable(data.deliveries.filter(d => d.status === "Pending"))}
      </section>
    `, "assignments.html");
    return;
  }

  const availableRiders = data.riders.filter(r => r.status !== "Offline");

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
            ${availableRiders.map(r => `<option value="${r.id}">${r.name} | ${r.status} | ${r.deliveries} current deliveries</option>`).join("")}
          </select>

          <div class="form_actions">
            <button class="dark_button" type="submit">Assign Delivery</button>
            <a class="ghost_button" href="requests.html">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  `, "assignments.html");

  document.getElementById("assignmentForm").addEventListener("submit", event => {
    event.preventDefault();

    const riderId = document.getElementById("rider").value;
    const updated = getData();
    const rider = updated.riders.find(r => r.id === riderId);
    const target = updated.deliveries.find(d => d.id === delivery.id);

    if (!rider || !target) return;

    target.status = "Assigned";
    target.riderId = rider.id;
    target.rider = rider.name;
    target.updatedAt = new Date().toISOString();
    target.history.push({
      status: "Assigned",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actor: "Dispatcher"
    });

    rider.deliveries += 1;
    rider.status = "Busy";

    saveData(updated);
    window.location.href = `assignments.html?id=${delivery.id}`;
  });
}

function dispatcherRiders() {
  const data = getData();

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
          <thead><tr><th>Name</th><th>Phone</th><th>Status</th><th>Current Deliveries</th></tr></thead>
          <tbody>
            ${data.riders.map(r => `
              <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.phone}</td>
                <td>${statusBadge(r.status)}</td>
                <td>${r.deliveries}</td>
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

  if (path.endsWith("requests.html")) dispatcherRequests();
  else if (path.endsWith("assignments.html")) dispatcherAssignments();
  else if (path.endsWith("riders.html")) dispatcherRiders();
  else dispatcherDashboard();
});
