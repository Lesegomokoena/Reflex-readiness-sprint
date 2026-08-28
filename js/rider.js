const RIDER_ID = "R01";

function riderDeliveries() {
  return getData().deliveries.filter(d => d.riderId === RIDER_ID);
}

function riderTable(deliveries) {
  if (!deliveries.length) {
    return `<div class="empty_state">No deliveries are currently assigned to you.</div>`;
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
            <th>Status</th>
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
              <td>${statusBadge(d.status)}</td>
              <td><a class="small_button" href="delivery_details.html?id=${d.id}">View</a></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function riderDashboard() {
  const deliveries = riderDeliveries();
  const assigned = deliveries.filter(d => d.status === "Assigned").length;
  const progress = deliveries.filter(d => d.status === "Picked Up").length;
  const delivered = deliveries.filter(d => d.status === "Delivered").length;
  const next = deliveries.find(d => d.status !== "Delivered");

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Rider Dashboard</h1>
        <p>View assigned deliveries and update delivery progress.</p>
      </div>
      <a class="dark_button" href="scan.html">Scan Confirmation</a>
    </div>

    <section class="stats">
      <div class="stat_card"><div class="stat_label">Assigned</div><div class="stat_value">${assigned}</div><div class="stat_note">Waiting for pickup</div></div>
      <div class="stat_card"><div class="stat_label">In Progress</div><div class="stat_value">${progress}</div><div class="stat_note">Picked up</div></div>
      <div class="stat_card"><div class="stat_label">Delivered</div><div class="stat_value">${delivered}</div><div class="stat_note">Completed</div></div>
      <div class="stat_card"><div class="stat_label">Total Assigned</div><div class="stat_value">${deliveries.length}</div><div class="stat_note">Current workload</div></div>
    </section>

    <div class="grid_two">
      <section class="panel">
        <div class="panel_header"><h2>My Deliveries</h2><a class="muted" href="deliveries.html">View all</a></div>
        ${riderTable(deliveries)}
      </section>

      <section class="panel">
        <div class="panel_header"><h2>Next Delivery</h2></div>
        <div class="panel_body">
          ${next ? `
            <div class="detail_grid">
              <div class="detail_item"><small>Delivery</small><strong>${next.id}</strong></div>
              <div class="detail_item"><small>Status</small><strong>${next.status}</strong></div>
              <div class="detail_item"><small>Customer</small><strong>${next.customer}</strong></div>
              <div class="detail_item"><small>Address</small><strong>${next.address}</strong></div>
            </div>
            <div class="form_actions">
              <a class="dark_button" href="delivery_details.html?id=${next.id}">View Details</a>
            </div>
          ` : `<div class="empty_state">No active delivery.</div>`}
        </div>
      </section>
    </div>
  `, "dashboard.html");
}

function riderDeliveriesPage() {
  buildShell(`
    <div class="page_heading">
      <div>
        <h1>My Deliveries</h1>
        <p>Deliveries currently assigned to this rider.</p>
      </div>
    </div>
    <section class="panel">
      <div class="panel_header"><h2>Assigned Deliveries</h2></div>
      ${riderTable(riderDeliveries())}
    </section>
  `, "deliveries.html");
}

function riderDetails() {
  const delivery = getDelivery(queryDeliveryId());

  if (!delivery) {
    buildShell(`<div class="notice error">Delivery was not found.</div>`, "");
    return;
  }

  const nextStatus = delivery.status === "Assigned"
    ? "Picked Up"
    : delivery.status === "Picked Up"
      ? "Delivered"
      : null;

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Delivery ${delivery.id}</h1>
        <p>Review delivery information and update its status.</p>
      </div>
      ${statusBadge(delivery.status)}
    </div>

    <section class="panel">
      <div class="panel_header"><h2>Delivery Information</h2></div>
      <div class="panel_body">
        <div class="detail_grid">
          <div class="detail_item"><small>Customer</small><strong>${delivery.customer}</strong></div>
          <div class="detail_item"><small>Phone</small><strong>${delivery.phone}</strong></div>
          <div class="detail_item"><small>Address</small><strong>${delivery.address}</strong></div>
          <div class="detail_item"><small>Item</small><strong>${delivery.item}</strong></div>
        </div>

        ${nextStatus ? `
          <div class="form_actions">
            <button class="dark_button" id="updateStatus">${nextStatus}</button>
            ${nextStatus === "Delivered" ? `<a class="ghost_button" href="scan.html?id=${delivery.id}">Scan Confirmation</a>` : ""}
          </div>
        ` : `
          <div class="notice success" style="margin-top:20px">This delivery has been completed.</div>
        `}
      </div>
    </section>

    <section class="panel">
      <div class="panel_header"><h2>Status History</h2></div>
      <div class="panel_body">
        <div class="timeline">
          ${delivery.history.map(h => `
            <div class="timeline_item">
              <div class="timeline_time">${h.time}</div>
              <div><strong>${h.status}</strong><div class="muted">${h.actor}</div></div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `, "delivery_details.html");

  const updateButton = document.getElementById("updateStatus");

  if (updateButton) {
    updateButton.addEventListener("click", () => {
      const data = getData();
      const target = data.deliveries.find(d => d.id === delivery.id);

      if (!target) return;

      const next = target.status === "Assigned" ? "Picked Up" : "Delivered";
      target.status = next;
      target.updatedAt = new Date().toISOString();
      target.history.push({
        status: next,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actor: "John Rider"
      });

      if (next === "Delivered") {
        const rider = data.riders.find(r => r.id === RIDER_ID);
        if (rider && rider.deliveries > 0) rider.deliveries -= 1;
        if (rider && rider.deliveries === 0) rider.status = "Available";
      }

      saveData(data);
      window.location.reload();
    });
  }
}

function riderScan() {
  const requestedId = queryDeliveryId();
  const riderOwned = riderDeliveries();
  const selected = requestedId ? riderOwned.find(d => d.id === requestedId) : riderOwned.find(d => d.status === "Picked Up" || d.status === "Assigned");

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Delivery Confirmation</h1>
        <p>Use the order reference to confirm the delivery.</p>
      </div>
    </div>

    <section class="panel">
      <div class="panel_body scan_box">
        <h2>Scan Order</h2>
        <p class="muted">Camera access can be connected to a barcode or QR library when the backend is ready. This prototype provides a working manual confirmation flow.</p>

        <div class="scan_frame">
          <div class="scan_lines">SCAN AREA</div>
        </div>

        <label for="scanCode">Order Reference</label>
        <input id="scanCode" value="${selected ? selected.id : ""}" placeholder="Example: RFX0012">

        <div class="form_actions" style="justify-content:center">
          <button class="dark_button" id="confirmScan">Confirm Delivery</button>
        </div>

        <div id="scanMessage"></div>
      </div>
    </section>
  `, "scan.html");

  document.getElementById("confirmScan").addEventListener("click", () => {
    const code = document.getElementById("scanCode").value.trim().toUpperCase();
    const data = getData();
    const target = data.deliveries.find(d => d.id === code && d.riderId === RIDER_ID);
    const message = document.getElementById("scanMessage");

    if (!target) {
      message.innerHTML = `<div class="notice error">Order reference was not found among this rider's deliveries.</div>`;
      return;
    }

    if (target.status === "Delivered") {
      message.innerHTML = `<div class="notice success">This delivery is already confirmed.</div>`;
      return;
    }

    target.status = "Delivered";
    target.updatedAt = new Date().toISOString();
    target.history.push({
      status: "Delivered",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actor: "John Rider"
    });

    const rider = data.riders.find(r => r.id === RIDER_ID);
    if (rider && rider.deliveries > 0) rider.deliveries -= 1;
    if (rider && rider.deliveries === 0) rider.status = "Available";

    saveData(data);
    message.innerHTML = `<div class="notice success">Delivery ${target.id} has been confirmed as delivered.</div>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.role !== "rider") return;

  const path = window.location.pathname;

  if (path.endsWith("deliveries.html")) riderDeliveriesPage();
  else if (path.endsWith("delivery_details.html")) riderDetails();
  else if (path.endsWith("scan.html")) riderScan();
  else riderDashboard();
});
