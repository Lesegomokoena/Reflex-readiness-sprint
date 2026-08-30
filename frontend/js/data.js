const IS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_URL = IS_LOCAL
  ? "http://localhost:5000/api"
  : "https://reflex-readiness-sprint-1.onrender.com/api"; // Update this after deploying to Render!

function getToken() {
  return localStorage.getItem("reflex_token");
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const isGet = !options.method || options.method === "GET";
  const cacheKey = `reflex_cache_${endpoint}`;

  if (!isGet) {
    // Clear cache on mutations to ensure fresh data
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith("reflex_cache_")) sessionStorage.removeItem(key);
    });
  }

  // Stale-while-revalidate pattern
  if (isGet) {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      // Fetch fresh data in background silently
      fetch(`${API_URL}${endpoint}`, { ...options, headers })
        .then(async res => {
          if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
            const fresh = (await res.json()).data;
            sessionStorage.setItem(cacheKey, JSON.stringify(fresh));
          }
        }).catch(() => {});
      return JSON.parse(cached);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
    localStorage.removeItem("reflex_token");
    localStorage.removeItem("reflex_role");
    
    // Fix relative path depending on current location
    const isRoot = window.location.pathname.endsWith("/login.html") || window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("/signup.html");
    window.location.href = isRoot ? "login.html" : "../login.html";
    
    throw new Error("Session expired. Redirecting to login...");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || "An error occurred");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const responseData = (await response.json()).data;
    if (isGet) {
      sessionStorage.setItem(cacheKey, JSON.stringify(responseData));
    }
    return responseData;
  }
  return response;
}

const api = {
  login: (email, password) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password, role) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, role }) }),
  getDeliveries: async () => {
    const list = await apiFetch("/deliveries");
    return list.map(adaptDelivery);
  },
  getDelivery: async (id) => {
    const d = await apiFetch(`/deliveries/${id}`);
    return adaptDelivery(d);
  },
  createDelivery: (data) => apiFetch("/deliveries", { method: "POST", body: JSON.stringify(data) }),
  assignRider: (id, riderId) => apiFetch(`/deliveries/${id}/assign`, { method: "PATCH", body: JSON.stringify({ rider_id: riderId }) }),
  updateStatus: (id, status, note) => {
    const backendStatus = status === "Pending" ? "PENDING" :
      status === "Assigned" ? "ASSIGNED" :
        status === "Picked Up" ? "PICKED_UP" :
          status === "Delivered" ? "DELIVERED" :
            status === "Cancelled" ? "CANCELLED" : status;
    return apiFetch(`/deliveries/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: backendStatus, note }) });
  },
  scanQr: (id, token, scanType) => apiFetch(`/deliveries/${id}/scan`, { method: "POST", body: JSON.stringify({ token, scan_type: scanType }) }),
  getRiders: () => apiFetch("/riders"),
  me: () => apiFetch("/auth/me")
};

function adaptDelivery(d) {
  return {
    id: d.id,
    customer: d.customer_name,
    phone: d.customer_phone,
    address: d.delivery_address,
    item: d.item_description,
    status: d.status === "PENDING" ? "Pending" :
      d.status === "ASSIGNED" ? "Assigned" :
        d.status === "PICKED_UP" ? "Picked Up" :
          d.status === "DELIVERED" ? "Delivered" :
            d.status === "CANCELLED" ? "Cancelled" : d.status,
    riderId: d.assigned_rider_id,
    rider: d.assigned_rider_name || (d.assigned_rider_id ? "Assigned Rider" : null),
    createdAt: d.created_at,
    updatedAt: d.updated_at,
    history: (d.events || []).map(e => ({
      status: e.status === "PENDING" ? "Pending" :
        e.status === "ASSIGNED" ? "Assigned" :
          e.status === "PICKED_UP" ? "Picked Up" :
            e.status === "DELIVERED" ? "Delivered" :
              e.status === "CANCELLED" ? "Cancelled" : e.status,
      time: new Date(e.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }),
      actor: e.actor_id
    })),
    qr_token: d.qr_token
  };
}

// Stubs for legacy code compatibility
function getData() { return { deliveries: [], riders: [] }; }
function saveData() { }
function resetData() { }
function nextDeliveryId() { }
