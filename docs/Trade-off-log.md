# Reflex — Trade-Off Log

## Trade-Off 1: API-Based Architecture

### Decision

The backend was built around APIs to allow the different parts of the Reflex system to communicate.

### Why We Chose It

The case study required interaction between the retailer, dispatcher, and rider workflows. An API provides a clear interface through which these different parts of the system can send and retrieve delivery information.

### Trade-Off

Using an API-based architecture introduces communication between separate components rather than keeping the entire system in one place. This means the system has to handle requests and responses between components.

### Acceptable Because

The project is intended to demonstrate a working delivery-management workflow and the API structure gives the system a clear separation between user-facing functionality and backend operations.

### Future Improvement

With more time, the API layer could be expanded and hardened for production requirements such as stronger security, reliability, monitoring, and larger-scale usage.

---

## Trade-Off 2: Scope Focused on the Core Delivery Workflow

### Decision

The project focused on the core workflow described in the case study: creating a delivery request, assigning it to a rider, and updating its status.

### Why We Chose It

The problem statement identifies these as the essential activities required to give retailers visibility over their deliveries.

### Trade-Off

Additional functionality outside the core workflow could not receive the same level of development attention within the sprint.

### Acceptable Because

The objective was to demonstrate a coherent working solution to the stated problem rather than attempt to build a complete commercial delivery platform within the available sprint.

### Future Improvement

Additional capabilities could be developed after the core workflow has been validated, including further operational and reporting functionality.

---

## Trade-Off 3: Prototype vs Production-Ready System

### Decision

Reflex was developed as a sprint prototype rather than attempting to implement every requirement that would be necessary for a production deployment.

### Why We Chose It

The sprint prioritised designing, building, and defending a solution to the case study within a limited timeframe.

### Trade-Off

The resulting system should be understood as a prototype demonstrating the intended workflow rather than a fully production-hardened delivery platform.

### Acceptable Because

The evaluation focuses on the team's architectural reasoning, trade-offs, and ability to defend the solution, in addition to the functionality of the build.

### Future Improvement

A production version would require further work around reliability, security, scalability, deployment, and operational monitoring.

---

## Trade-Off 4: Reduced Team Capacity

### Decision

The project scope and task distribution were adjusted after the team was reduced from the planned five-member structure.

### Why We Chose It

The team had to continue delivering the project despite losing a member.

### Trade-Off

There was less available development capacity, meaning the team had to prioritise the most important parts of the product and presentation rather than expanding the scope.

### Acceptable Because

Maintaining a smaller, coherent working solution was more valuable than adding unfinished functionality.

### Future Improvement

With the original team capacity or additional development time, work could be distributed across more specialised areas and additional functionality could be developed and tested.

---

## Trade-Off 5: Independent Backend Development

### Decision

The backend implementation was primarily developed by the backend team member.

### Why We Chose It

Dividing responsibility allowed the available team members to work in parallel on their respective areas while maintaining a clear owner for backend implementation.

### Trade-Off

Knowledge of the backend implementation became more concentrated in one team member, creating a potential dependency when explaining or modifying backend behaviour.

### Acceptable Because

The team was working under sprint time constraints and assigning clear ownership allowed development to progress.

### Future Improvement

The team could improve shared technical knowledge through code walkthroughs, documentation, pair programming, and cross-review of important backend components.
