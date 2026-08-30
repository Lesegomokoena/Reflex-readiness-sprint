# REF-10 — Implement Order Scanning

## Objective

Support delivery order identification and confirmation through
order ID / QR token input.

---

## Current Scanning Flow

The current prototype provides a manual confirmation flow.

The intended process is:

Scan / Input
     ↓
Order ID
     ↓
Backend Lookup
     ↓
Delivery Found
     ↓
Delivery Confirmation

---

## Current Interface

The Rider Scan Confirmation interface provides:

- Order Reference ID
- QR Token
- Scan Type
- Confirm Delivery

Available scan types:

- Pickup
- Drop off

---

## Test 1 — Valid Delivery Identification

OBJECTIVE:

Verify that an existing delivery can be identified using its
delivery information.

RESULT:

A valid delivery was successfully created and tracked through
the system.

The following delivery was successfully identified:

Delivery ID:
266a98a6-a180-43e0-a6fd-f0458d99f862

Customer:
Matthew Lang

Item:
Socks

Rider:
andrew

Final Status:
Delivered

STATUS:

PASS

---

## Test 2 — Missing Required Data

OBJECTIVE:

Verify that confirmation cannot be submitted when the required
Order ID and Token fields are empty.

EXPECTED:

The system should prevent submission and display a validation
message.

ACTUAL:

Order ID and Token are required.

STATUS:

PASS

---

## Test 3 — Invalid / Unknown Order ID

OBJECTIVE:

Verify that an unknown delivery reference is rejected.

EXPECTED:

The system should reject the request when the delivery cannot
be found.

ACTUAL:

Delivery request not found.

STATUS:

PASS

---

## Test 4 — Scan Type Selection

OBJECTIVE:

Verify that the Rider can select the appropriate delivery
confirmation type.

AVAILABLE OPTIONS:

Pickup
Drop off

RESULT:

Both options were selectable.

STATUS:

PASS

---

## Camera / QR Scanning

Camera-based QR/barcode scanning is not currently implemented
in the prototype.

The current implementation uses manual order/reference input.

The application indicates that camera access can be connected
to a barcode/QR library when the backend is ready.

STATUS:

KNOWN PROTOTYPE LIMITATION

---

## Conclusion

The manual order identification and validation flow is
functional.

The system:

- Accepts order/reference information
- Validates required fields
- Rejects unknown delivery IDs
- Supports Pickup and Drop off selection
- Allows the delivery confirmation workflow to proceed

Actual camera-based QR scanning remains a future enhancement.
