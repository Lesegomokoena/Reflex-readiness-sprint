function retailerStats(deliveries) {
  return {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === "Pending").length,
    progress: deliveries.filter(d => d.status === "Assigned" || d.status === "Picked Up").length,
    delivered: deliveries.filter(d => d.status === "Delivered").length
  };
}

function retailerTable(deliveries) {
  if (!deliveries.length) {
    return `<div class="empty_state">No deliveries found.</div>`;
  }

  return `
    <div class="table_wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Status</th>
            <th>Rider</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${deliveries.map(d => `
            <tr>
              <td><strong>${d.id}</strong></td>
              <td>${d.customer}</td>
              <td>${d.address}</td>
              <td>${statusBadge(d.status)}</td>
              <td>${d.rider || "Not assigned"}</td>
              <td>${formatDateTime(d.updatedAt)}</td>
              <td><a class="small_button" href="delivery_details.html?id=${d.id}">View</a></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

async function retailerDashboard() {
  const deliveries = await api.getDeliveries();
  const s = retailerStats(deliveries);

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Retailer Dashboard</h1>
        <p>Monitor delivery requests and current delivery status.</p>
      </div>
      <a class="dark_button" href="create_delivery.html">New Delivery</a>
    </div>

    <section class="stats">
      <div class="stat_card"><div class="stat_label">Total Deliveries</div><div class="stat_value">${s.total}</div><div class="stat_note">All requests</div></div>
      <div class="stat_card"><div class="stat_label">Pending</div><div class="stat_value">${s.pending}</div><div class="stat_note">Waiting for assignment</div></div>
      <div class="stat_card"><div class="stat_label">In Progress</div><div class="stat_value">${s.progress}</div><div class="stat_note">Assigned or picked up</div></div>
      <div class="stat_card"><div class="stat_label">Delivered</div><div class="stat_value">${s.delivered}</div><div class="stat_note">Completed requests</div></div>
    </section>

    <section class="panel">
      <div class="panel_header">
        <h2>Recent Deliveries</h2>
        <a href="deliveries.html" class="muted">View all</a>
      </div>
      ${retailerTable(deliveries.slice(0, 5))}
    </section>

    <div class="grid_two">
      <section class="panel">
        <div class="panel_header"><h2>Delivery Status</h2></div>
        <div class="panel_body">
          <div class="detail_grid">
            <div class="detail_item"><small>Pending</small><strong>${s.pending}</strong></div>
            <div class="detail_item"><small>Assigned</small><strong>${deliveries.filter(d => d.status === "Assigned").length}</strong></div>
            <div class="detail_item"><small>Picked Up</small><strong>${deliveries.filter(d => d.status === "Picked Up").length}</strong></div>
            <div class="detail_item"><small>Delivered</small><strong>${s.delivered}</strong></div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel_header"><h2>Prototype Controls</h2></div>
        <div class="panel_body">
          <p class="muted">The prototype uses browser storage so all three dashboards can share the same delivery data.</p>
          <button class="ghost_button" data-reset>Reset Demo Data</button>
        </div>
      </section>
    </div>
  `, "dashboard.html");

  bindCommon();
}

function retailerCreate() {
  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Create Delivery</h1>
        <p>Log a new delivery request for the dispatcher.</p>
      </div>
    </div>

    <section class="panel">
      <div class="panel_header"><h2>Delivery Information</h2></div>
      <div class="panel_body">
        <form id="createDeliveryForm">
          <div class="form_grid">
            <div>
              <label for="customer">Customer Name</label>
              <input id="customer" required>
            </div>
            <div>
              <label for="phone">Customer Phone</label>
              <input id="phone" required>
            </div>
            <div class="form_full">
              <label for="address">Delivery Address</label>
              <input id="address" required>
            </div>
            <div class="form_full">
              <label for="item">Item Description</label>
              <textarea id="item" required></textarea>
            </div>
          </div>

          <div class="form_actions">
            <button class="dark_button" type="submit">Create Delivery</button>
            <a class="ghost_button" href="dashboard.html">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  `, "create_delivery.html");

  document.getElementById("createDeliveryForm").addEventListener("submit", async event => {
    event.preventDefault();
    const id = nextDeliveryId();

    try {
      const result = await api.createDelivery({
        customer_name: document.getElementById("customer").value.trim(),
        customer_phone: document.getElementById("phone").value.trim(),
        delivery_address: document.getElementById("address").value.trim(),
        item_description: document.getElementById("item").value.trim()
      });
      window.location.href = `delivery_details.html?id=${result.id}`;
    } catch (err) {
      alert(err.message);
    }
  });
}

async function retailerDeliveries() {
  const deliveries = await api.getDeliveries();

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Deliveries</h1>
        <p>View every delivery request created by the retailer.</p>
      </div>
      <a class="dark_button" href="create_delivery.html">New Delivery</a>
    </div>

    <section class="panel">
      <div class="panel_header"><h2>All Deliveries</h2></div>
      ${retailerTable(deliveries)}
    </section>
  `, "deliveries.html");
}

async function retailerDetails() {
  const deliveryId = queryDeliveryId();
  if (!deliveryId) {
    window.location.href = "dashboard.html";
    return;
  }

  let delivery;
  try {
    delivery = await api.getDelivery(deliveryId);
  } catch (err) {}

  if (!delivery) {
    buildShell(`<div class="notice error">Delivery was not found.</div>`, "");
    return;
  }

  buildShell(`
    <div class="page_heading">
      <div>
        <h1>Delivery ${delivery.id}</h1>
        <p>Track the request and review its status history.</p>
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
          <div class="detail_item"><small>Rider</small><strong>${delivery.rider || "Not assigned"}</strong></div>
          <div class="detail_item"><small>Rider Phone</small><strong>${delivery.riderPhone || "-"}</strong></div>
          <div class="detail_item"><small>Last Updated</small><strong>${formatDateTime(delivery.updatedAt)}</strong></div>
        </div>
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
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.role !== "retailer") return;

  const path = window.location.pathname;

  if (path.endsWith("create_delivery.html")) retailerCreate();
  else if (path.endsWith("deliveries.html")) {
    retailerDeliveries();
    enableAutoSync(retailerDeliveries);
  }
  else if (path.endsWith("delivery_details.html")) {
    retailerDetails();
    enableAutoSync(retailerDetails);
  }
  else {
    retailerDashboard();
    enableAutoSync(retailerDashboard);
  }
});
