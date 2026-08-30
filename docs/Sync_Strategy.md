# REF-09 — Investigate Sync Strategy

## Objective

Determine how clients receive updated delivery information and
select the simplest suitable synchronisation strategy for Reflex.

---

## Approaches Considered

### HTTP Polling

The client periodically requests updated delivery information
from the backend.

Advantages:

- Simple to implement
- Easy to debug
- Suitable for near-real-time updates
- Does not require a persistent connection

Disadvantages:

- Generates repeated requests
- Updates are not instantaneous

---

### REST API

REST provides the client/server communication mechanism used to
retrieve and update delivery information.

Advantages:

- Simple and widely supported
- Easy to integrate with the frontend
- Suitable for delivery status operations
- Works well with polling

Disadvantages:

- Requires the client to request updated information
- Does not automatically push changes to the client

---

### WebSockets

WebSockets provide a persistent connection between the client
and server and allow the server to push updates immediately.

Advantages:

- True real-time communication
- Immediate status updates
- Suitable for applications requiring frequent updates

Disadvantages:

- More complex to implement
- Requires persistent connections
- Additional error handling and infrastructure
- Not necessary for the current Reflex requirements

---

## Decision

SELECTED APPROACH:

REST API + HTTP Polling

---

## Justification

The Reflex Delivery Management System does not require
second-by-second real-time communication.

Delivery status changes occur relatively infrequently and
near-real-time updates are sufficient for the current application.

REST combined with periodic polling provides a simple,
maintainable and reliable approach without introducing the
additional complexity of WebSockets.

---

## Testing Evidence

The complete delivery workflow was successfully tested:

Customer/Retailer
        ↓
Create Delivery
        ↓
Dispatcher
        ↓
Assign Rider
        ↓
Rider
        ↓
Picked Up
        ↓
Delivered
        ↓
Customer/Retailer
        ↓
Delivered

A completed test delivery displayed:

01:29 PM — Pending
01:31 PM — Assigned
01:33 PM — Picked Up
01:33 PM — Delivered

This confirms that delivery status changes can reach the
relevant interfaces.

---

## Conclusion

REST API communication combined with HTTP polling is the
simplest suitable synchronisation strategy for the current
Reflex prototype.

WebSockets are not required unless future requirements
introduce a need for true real-time updates.
