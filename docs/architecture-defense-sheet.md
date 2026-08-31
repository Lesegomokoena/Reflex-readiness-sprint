# Reflex — Architecture Defense Sheet

## 1. What is the overall architecture of Reflex?

### State

Reflex uses a backend API architecture to support the delivery workflow between the retailer, dispatcher, and rider.

### Context

The three roles interact with the same delivery information at different stages of the delivery lifecycle.

### Evidence

The backend exposes APIs that support the application's delivery operations.

### Follow-up

The architecture separates the application's interaction with users from the backend operations that process delivery information.

---

## 2. Why did we use APIs?

### State

We used APIs as the communication interface between the application and the backend.

### Context

Reflex has multiple user workflows: retailers create delivery requests, dispatchers assign deliveries, and riders update delivery status.

### Evidence

The backend was implemented around API endpoints that allow these operations to be requested by the application.

### Limitation

API communication introduces a dependency on communication with the backend. If the backend is unavailable, operations that require it cannot be completed.

---

## 3. Why separate the frontend from the backend?

### State

The frontend and backend have separate responsibilities.

### Context

The frontend is responsible for user interaction, while the backend handles the application's delivery operations.

### Evidence

The frontend communicates with the backend through APIs rather than directly implementing the backend operations.

### Benefit

This separation gives the system a clearer structure and allows the backend logic to serve the application's different workflows through a consistent interface.

---

## 4. How does a retailer create a delivery?

### State

The retailer enters the delivery information through the application, which communicates the request to the backend.

### Context

The case study requires the retailer to provide the customer's name, phone number, address, and item description.

### Evidence

These fields form the basis of the delivery request described in the Reflex specification.

### Expected Flow

Retailer → Application → API → Backend → Delivery information

---

## 5. How does dispatcher assignment work?

### State

The dispatcher is responsible for assigning an open delivery request to a rider.

### Context

This reflects the second stage of the specified Reflex workflow.

### Evidence

The dispatcher persona is explicitly responsible for seeing open requests and assigning them to riders.

### Expected Flow

Open delivery → Dispatcher → Rider assignment

---

## 6. How does the rider interact with the system?

### State

The rider receives assigned deliveries and updates their delivery status.

### Context

The case study defines the rider's workflow as progressing a delivery through statuses such as Assigned, Picked Up, and Delivered.

### Evidence

These statuses are explicitly defined in the project specification.

### Expected Flow

Assigned → Picked Up → Delivered

---

## 7. Why is delivery status important?

### State

Status provides visibility into the current stage of a delivery.

### Context

The original problem is that retailers currently coordinate deliveries through WhatsApp and phone calls without reliable status visibility.

### Evidence

Reflex specifically addresses this by allowing riders to update delivery status so that the retailer can know where the delivery stands.

### Key Point

The status flow is therefore not merely a UI feature; it directly addresses the original business problem.

---

## 8. How does Reflex improve the original WhatsApp/phone-call process?

### State

Reflex turns an informal coordination process into a structured delivery workflow.

### Context

The original process provides no reliable record of assignment, status visibility, or proof of delivery.

### Evidence

Reflex introduces a defined sequence involving retailer request creation, dispatcher assignment, and rider status updates.

### Key Point

The value is not simply replacing WhatsApp with an application; it is creating a structured process around the delivery lifecycle.

---

## 9. Why wasn't a specific technology stack mandated?

### State

The case study deliberately left the stack and architecture to the team.

### Context

The specification states that there was no pre-built architecture and no mandated stack.

### Evidence

The team therefore selected its own implementation approach and must justify those decisions.

### Key Point

Our architectural decisions were made according to the requirements of the problem rather than following a prescribed technology.

---

## 10. What is the biggest architectural limitation?

### State

The current system should be viewed as a sprint-level solution rather than a complete production platform.

### Context

The project was developed within a constrained sprint and the team also had to adjust after losing a member.

### Evidence

The team reduced its scope and prioritised the core delivery workflow and final presentation.

### Future Direction

A production version would require further work around areas such as scalability, security, reliability, deployment, and operational monitoring.

---

## 11. What would we change if Reflex had to support much larger usage?

### State

We would evolve the current architecture rather than simply scaling the prototype unchanged.

### Context

A production system serving many retailers, dispatchers, and riders would have greater requirements for reliability and scale.

### Evidence

The current project was designed as a sprint prototype around the core workflow.

### Future Direction

We would evaluate the system's storage, API infrastructure, security, monitoring, deployment, and real-time communication requirements at production scale.

---

## 12. What happens if the backend becomes unavailable?

### State

Operations requiring the backend cannot be completed while the backend is unavailable.

### Context

The application communicates with the backend through APIs.

### Architectural implication

The backend is therefore a dependency for operations that require server-side processing.

### Future Improvement

A production implementation would need appropriate availability, failure handling, monitoring, and recovery mechanisms.

---

# Questions We Must Be Able to Answer From the Actual Implementation

Before the presentation, the backend owner should confirm the exact answers to these:

* What backend language/framework are we using?
* Where exactly is delivery data stored?
* What are our actual API endpoints?
* What HTTP methods do they use?
* How is a delivery identified?
* How is rider assignment represented?
* How are status changes validated?
* How does syncing work in the actual implementation?
* How does scanning work in the actual implementation?
* What authentication/authorization exists, if any?
* What happens when an API request fails?
* What happens if two operations affect the same delivery at the same time?
* What happens to the data if the backend restarts?
* What parts of the system are currently prototype-level rather than production-ready?

**Do not guess these answers.** They should come directly from the implemented code.
