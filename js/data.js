const REFLEX_KEY = "reflex_deliveries_v1";

const defaultData = {
  riders: [
    { id: "R01", name: "John Rider", phone: "0712 100 201", status: "Available", deliveries: 2 },
    { id: "R02", name: "Mary Rider", phone: "0712 100 202", status: "Busy", deliveries: 4 },
    { id: "R03", name: "David Rider", phone: "0712 100 203", status: "Available", deliveries: 1 },
    { id: "R04", name: "Samuel Rider", phone: "0712 100 204", status: "Busy", deliveries: 3 }
  ],
  deliveries: [
    {
      id: "RFX0012",
      retailer: "Jane Retail",
      customer: "Jane Doe",
      phone: "0712 345 678",
      address: "Nairobi CBD",
      item: "Electronics",
      status: "Assigned",
      riderId: "R01",
      rider: "John Rider",
      createdAt: "2026-08-28T10:30:00",
      updatedAt: "2026-08-28T10:30:00",
      history: [
        { status: "Pending", time: "10:20 AM", actor: "Retailer" },
        { status: "Assigned", time: "10:30 AM", actor: "Dispatcher" }
      ]
    },
    {
      id: "RFX0011",
      retailer: "Jane Retail",
      customer: "Peter Smith",
      phone: "0712 345 679",
      address: "Westlands",
      item: "Router",
      status: "Picked Up",
      riderId: "R02",
      rider: "Mary Rider",
      createdAt: "2026-08-28T10:15:00",
      updatedAt: "2026-08-28T10:15:00",
      history: [
        { status: "Pending", time: "09:55 AM", actor: "Retailer" },
        { status: "Assigned", time: "10:00 AM", actor: "Dispatcher" },
        { status: "Picked Up", time: "10:15 AM", actor: "Mary Rider" }
      ]
    },
    {
      id: "RFX0010",
      retailer: "Jane Retail",
      customer: "Grace Lee",
      phone: "0712 345 680",
      address: "Kilimani",
      item: "Television",
      status: "Delivered",
      riderId: "R03",
      rider: "David Rider",
      createdAt: "2026-08-28T09:45:00",
      updatedAt: "2026-08-28T09:45:00",
      history: [
        { status: "Pending", time: "09:05 AM", actor: "Retailer" },
        { status: "Assigned", time: "09:15 AM", actor: "Dispatcher" },
        { status: "Picked Up", time: "09:30 AM", actor: "David Rider" },
        { status: "Delivered", time: "09:45 AM", actor: "David Rider" }
      ]
    },
    {
      id: "RFX0009",
      retailer: "Jane Retail",
      customer: "Kevin Otieno",
      phone: "0712 345 681",
      address: "Kasarani",
      item: "Speaker",
      status: "Pending",
      riderId: null,
      rider: null,
      createdAt: "2026-08-28T09:20:00",
      updatedAt: "2026-08-28T09:20:00",
      history: [
        { status: "Pending", time: "09:20 AM", actor: "Retailer" }
      ]
    },
    {
      id: "RFX0008",
      retailer: "Jane Retail",
      customer: "Alice Mutua",
      phone: "0712 345 682",
      address: "Ngara",
      item: "Phone",
      status: "Pending",
      riderId: null,
      rider: null,
      createdAt: "2026-08-28T08:50:00",
      updatedAt: "2026-08-28T08:50:00",
      history: [
        { status: "Pending", time: "08:50 AM", actor: "Retailer" }
      ]
    }
  ]
};

function seedData() {
  if (!localStorage.getItem(REFLEX_KEY)) {
    localStorage.setItem(REFLEX_KEY, JSON.stringify(defaultData));
  }
}

function getData() {
  seedData();
  return JSON.parse(localStorage.getItem(REFLEX_KEY));
}

function saveData(data) {
  localStorage.setItem(REFLEX_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("reflexDataChanged"));
}

function resetData() {
  localStorage.setItem(REFLEX_KEY, JSON.stringify(defaultData));
  window.dispatchEvent(new Event("reflexDataChanged"));
}

function nextDeliveryId() {
  const data = getData();
  const highest = data.deliveries.reduce((max, item) => {
    const number = Number(item.id.replace("RFX", ""));
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 0);
  return `RFX${String(highest + 1).padStart(4, "0")}`;
}

seedData();
