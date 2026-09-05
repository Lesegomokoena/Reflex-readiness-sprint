# Reflex — Project Design

### 1. Project Overview

Reflex is a delivery coordination system designed for small Kenyan retailers. It replaces fragmented WhatsApp and phone-based coordination with a centralized system for creating, assigning, tracking, and confirming deliveries.

### 2. System Architecture

**Frontend**

* Provides interfaces for retailer staff, dispatchers, and riders.
* Allows users to create, view, assign, and update deliveries.

**Backend**

* Handles business logic, validation, authentication, authorization, and delivery-state management.
* Controls how deliveries move through their lifecycle.

**REST APIs**

* Connect the frontend and backend using HTTP and JSON.
* Provide endpoints for delivery management, rider assignment, authentication, and status updates.

**Authentication & Authorization**

* Authenticates users and uses role-based access to control available operations.
* Supports different permissions for retailer staff, dispatchers, and riders.

**Data / Storage**

* Stores users, riders, delivery requests, assignments, statuses, and relevant timestamps.

**QR Scanning**

* Supports order confirmation by allowing delivery/order information to be verified through scanning.

### 3. Core Data

**Delivery:** ID, customer details, address, item description, status, assigned rider, and timestamps.

**Rider:** ID, name/contact information, availability, and assigned deliveries.

**User:** Account information and assigned role.

**JSON:** Structured format used to exchange data between the frontend and backend.

### 4. Main System Flow

Retailer creates delivery request
→ Backend validates and stores request
→ Dispatcher views open requests
→ Dispatcher assigns rider
→ Rider views assigned delivery
→ Rider updates delivery status
→ QR scanning supports order confirmation
→ Delivery reaches completed state.

### 5. Key Design Trade-offs

* **Simplicity vs. scalability:** The system prioritizes a manageable MVP architecture over production-scale infrastructure.
* **Simple storage vs. full database:** Easier and faster to develop, but less suitable for high concurrency and large-scale persistence.
* **REST APIs vs. message queues:** REST keeps communication straightforward, while queues could provide better resilience for asynchronous events.
* **Role-based access vs. fine-grained permissions:** Simpler to implement and explain, but less flexible for complex permission requirements.

### 6. Design Objective

The architecture is designed to provide retailers with a single, trackable workflow for delivery requests, rider assignment, status visibility, and order confirmation.

### Live System

https://reflex-readiness-sprint.vercel.app/
