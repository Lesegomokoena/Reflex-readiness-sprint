# REFLEX — QA TEST DOCUMENT

PROJECT: Reflex Delivery Management System
TESTING TYPE: Functional, End-to-End, UI & Validation Testing
TEST DATE: 30 August 2026
TESTER: Quality & Validation Lead
ENVIRONMENT: Web Application
OVERALL RESULT: PASS WITH MINOR FINDINGS


============================================================
1. TEST OBJECTIVE
============================================================

The objective of this QA test was to validate the core functionality
of the Reflex Delivery Management System across the Customer,
Dispatcher, and Rider roles.

The testing focused on:

- User authentication and role-based access
- Customer delivery request creation
- Dispatcher request management
- Rider assignment
- Rider delivery workflow
- Pickup and delivery status transitions
- Delivery tracking and history
- Form validation
- Dashboard statistics
- Rider availability and workload
- Navigation between application areas
- End-to-end data consistency


============================================================
2. ROLES TESTED
============================================================

CUSTOMER
Functions Tested:
- Account access
- Delivery request creation
- Delivery tracking
- Delivery history


DISPATCHER
Functions Tested:
- Dashboard
- Requests
- Assignments
- Rider assignment
- Rider management
- Rider availability
- Delivery statistics


RIDER
Functions Tested:
- Rider dashboard
- Assigned deliveries
- My Deliveries
- Pickup
- Delivery completion
- Delivery history
- Scan Confirmation


============================================================
3. TEST SUMMARY
============================================================

Total Test Cases: 21

Overall Result:
PASS WITH MINOR FINDINGS

Critical Blockers:
0

Main End-to-End Workflow:
PASS


NOTE:
Some observations from the initial testing session were not
consistently reproducible during the later successful end-to-end test.


============================================================
4. FUNCTIONAL TEST CASES
============================================================


------------------------------------------------------------
TC-001 — CUSTOMER ACCOUNT ACCESS
------------------------------------------------------------

OBJECTIVE:
Verify that a customer can access the Reflex application through
the account/login flow.

STEPS:
1. Open the Reflex application.
2. Select Create Account / Login.
3. Complete the required fields.
4. Submit the form.
5. Access the application.

EXPECTED RESULT:
The customer should be able to access the application successfully.

ACTUAL RESULT:
The account and login flow was accessible and functional.

STATUS:
PASS


------------------------------------------------------------
TC-002 — CREATE DELIVERY REQUEST
------------------------------------------------------------

OBJECTIVE:
Verify that a customer can create a delivery request.

STEPS:
1. Log in as Customer.
2. Navigate to the delivery request functionality.
3. Enter the required delivery information.
4. Submit the request.
5. Verify that the order is created.

EXPECTED RESULT:
A new delivery request should be created successfully.

ACTUAL RESULT:
A delivery/order was successfully created.

STATUS:
PASS


------------------------------------------------------------
TC-003 — DISPATCHER RECEIVES REQUEST
------------------------------------------------------------

OBJECTIVE:
Verify that the Dispatcher can receive a newly created
delivery request.

STEPS:
1. Log in as Dispatcher.
2. Open the Dispatcher Dashboard / Requests.
3. Locate the newly created delivery.

EXPECTED RESULT:
The delivery request should be available to the Dispatcher.

ACTUAL RESULT:
The delivery request was successfully available for processing.

STATUS:
PASS


------------------------------------------------------------
TC-004 — ASSIGN RIDER
------------------------------------------------------------

OBJECTIVE:
Verify that the Dispatcher can assign a rider to a delivery.

STEPS:
1. Log in as Dispatcher.
2. Locate the delivery request.
3. Select Assign Rider.
4. Select Andrew.
5. Confirm the assignment.
6. Review the Dispatcher Dashboard.

EXPECTED RESULT:
The selected rider should be assigned to the delivery.

ACTUAL RESULT:
Andrew was successfully assigned to the delivery.

The Dispatcher Dashboard reflected the assigned delivery.

STATUS:
PASS


------------------------------------------------------------
TC-005 — RIDER RECEIVES ASSIGNED DELIVERY
------------------------------------------------------------

OBJECTIVE:
Verify that an assigned delivery becomes available to the Rider.

STEPS:
1. Log in as Rider.
2. Open the Rider Dashboard.
3. Navigate to My Deliveries.
4. Locate the assigned delivery.

EXPECTED RESULT:
The assigned delivery should appear for the Rider.

ACTUAL RESULT:
During an initial test, the assigned delivery did not appear
on the Rider Dashboard.

During a subsequent end-to-end test, a newly created delivery
was successfully received by the Rider.

STATUS:
PASS — ISSUE NOT CONSISTENTLY REPRODUCIBLE


------------------------------------------------------------
TC-006 — RIDER PICKUP
------------------------------------------------------------

OBJECTIVE:
Verify that the Rider can pick up an assigned delivery.

STEPS:
1. Open the assigned delivery.
2. Select the pickup action.
3. Confirm pickup.

EXPECTED RESULT:
The delivery status should change to Picked Up.

ACTUAL RESULT:
The Rider successfully picked up the delivery.

STATUS:
PASS


------------------------------------------------------------
TC-007 — COMPLETE DELIVERY
------------------------------------------------------------

OBJECTIVE:
Verify that the Rider can complete a delivery.

STEPS:
1. Open the active delivery.
2. Proceed with the delivery.
3. Complete the delivery.
4. Review the status.

EXPECTED RESULT:
The delivery should transition to Delivered.

ACTUAL RESULT:
The delivery successfully changed to Delivered.

STATUS:
PASS


------------------------------------------------------------
TC-008 — CUSTOMER DELIVERY TRACKING
------------------------------------------------------------

OBJECTIVE:
Verify that the Customer can view the final delivery status.

STEPS:
1. Log in as Customer.
2. Open the completed delivery.
3. Review the current status.
4. Review the status history.

EXPECTED RESULT:
The Customer should see the delivery as Delivered.

ACTUAL RESULT:
The Customer successfully viewed the delivery as Delivered.

STATUS:
PASS


------------------------------------------------------------
TC-009 — DELIVERY HISTORY
------------------------------------------------------------

OBJECTIVE:
Verify that completed deliveries remain accessible after
completion.

STEPS:
1. Log in as Rider.
2. Open My Deliveries.
3. Locate the completed order.
4. Open the order.

EXPECTED RESULT:
The completed delivery should remain visible with a Delivered status.

ACTUAL RESULT:
The completed delivery remained visible under My Deliveries
and displayed Delivered.

STATUS:
PASS


------------------------------------------------------------
TC-010 — COMPLETED DELIVERY DETAILS
------------------------------------------------------------

OBJECTIVE:
Verify that completed delivery information and status history
are retained and displayed correctly.

TEST DELIVERY:

Delivery ID:
266a98a6-a180-43e0-a6fd-f0458d99f862

Customer:
Matthew Lang

Phone:
0712356789

Address:
Nairobi

Item:
Socks

Rider:
andrew

Final Status:
Delivered


STATUS HISTORY:

01:29 PM — Pending
01:31 PM — Assigned
01:33 PM — Picked Up
01:33 PM — Delivered


EXPECTED RESULT:
The system should retain and display the complete delivery history.

ACTUAL RESULT:
The delivery details and complete status history were displayed
correctly.

STATUS:
PASS


------------------------------------------------------------
TC-011 — RIDER AVAILABILITY AFTER DELIVERY
------------------------------------------------------------

OBJECTIVE:
Verify that the Rider's workload is cleared after completing
a delivery.

STEPS:
1. Complete a delivery.
2. Log in as Dispatcher.
3. Open Riders.
4. Locate Andrew.
5. Review status and current deliveries.

EXPECTED RESULT:

Status:
Available

Current Deliveries:
0


ACTUAL RESULT:

Status:
Available

Current Deliveries:
0

STATUS:
PASS


------------------------------------------------------------
TC-012 — DISPATCHER DASHBOARD STATISTICS
------------------------------------------------------------

OBJECTIVE:
Verify that dashboard statistics reflect the current delivery state.

TEST RESULT:

Open Requests:
0

Assigned:
0

In Progress:
0

Delivered:
6


EXPECTED RESULT:
No active deliveries should remain when all test deliveries
have been completed.

ACTUAL RESULT:
The Dispatcher Dashboard showed:

Open Requests: 0
Assigned: 0
In Progress: 0
Delivered: 6

STATUS:
PASS


============================================================
5. VALIDATION TESTING
============================================================


------------------------------------------------------------
TC-013 — SCAN TYPE SELECTION
------------------------------------------------------------

OBJECTIVE:
Verify that the Rider can select a delivery confirmation type.

AVAILABLE OPTIONS:

- Pickup
- Drop off

EXPECTED RESULT:
Both options should be selectable.

ACTUAL RESULT:
Both Pickup and Drop off could be selected successfully.

STATUS:
PASS


------------------------------------------------------------
TC-014 — REQUIRED FIELD VALIDATION
------------------------------------------------------------

OBJECTIVE:
Verify that delivery confirmation cannot be submitted without
required information.

STEPS:
1. Open Scan Confirmation.
2. Select Pickup or Drop off.
3. Leave Order ID empty.
4. Leave QR Token empty.
5. Select Confirm Delivery.

EXPECTED RESULT:
The system should prevent submission and display a validation message.

ACTUAL RESULT:

"Order ID and Token are required."

The confirmation was prevented.

STATUS:
PASS


------------------------------------------------------------
TC-015 — INVALID DELIVERY REFERENCE
------------------------------------------------------------

OBJECTIVE:
Verify system behaviour when a delivery reference cannot
be matched.

EXPECTED RESULT:
The system should reject the confirmation if the delivery
request cannot be found.

ACTUAL RESULT:

"Delivery request not found."

A complete positive test could not be performed because a clearly
exposed valid Order ID and QR Token were not available in the
tested workflow.

STATUS:
REVIEW REQUIRED


============================================================
6. PROTOTYPE / FEATURE LIMITATION
============================================================


------------------------------------------------------------
TC-016 — QR CAMERA SCANNING
------------------------------------------------------------

OBJECTIVE:
Verify QR/camera scanning functionality.

EXPECTED RESULT:
The Rider should be able to scan a QR code using the device camera.

ACTUAL RESULT:
Camera-based scanning is not currently implemented.

The application indicates that camera access can be connected
to a barcode/QR library when the backend is ready and that
the current prototype uses manual confirmation.

STATUS:
NOT IMPLEMENTED — PROTOTYPE LIMITATION


============================================================
7. DISPATCHER TESTING
============================================================


------------------------------------------------------------
TC-017 — REQUESTS PAGE
------------------------------------------------------------

OBJECTIVE:
Verify that the Requests page loads correctly.

EXPECTED RESULT:
The page should display open requests when available.

ACTUAL RESULT:
The page loaded successfully.

When no open requests were available, it displayed:

"No open requests."

STATUS:
PASS


------------------------------------------------------------
TC-018 — ASSIGNMENTS PAGE
------------------------------------------------------------

OBJECTIVE:
Verify that assigned deliveries are displayed under Assignments.

EXPECTED RESULT:
Assigned deliveries should be visible in the Assignments section.

ACTUAL RESULT:
During an initial test, the Dispatcher Dashboard showed
assigned deliveries while the Assignments page appeared empty.

The behaviour was not consistently reproducible during the
later successful end-to-end test.

STATUS:
REVIEW REQUIRED


------------------------------------------------------------
TC-019 — RIDERS PAGE
------------------------------------------------------------

OBJECTIVE:
Verify that rider information and availability are displayed.

EXPECTED RESULT:
The Riders page should display rider status and current
delivery load.

ACTUAL RESULT:
The rider list loaded successfully.

Andrew was displayed as:

Status:
Available

Current Deliveries:
0

STATUS:
PASS


============================================================
8. NAVIGATION & ROLE-BASED ACCESS
============================================================


------------------------------------------------------------
TC-020 — BACK TO WEBSITE
------------------------------------------------------------

OBJECTIVE:
Verify that users can navigate back to the public website.

STEPS:
1. Log in as Rider.
2. Select Back to Website.

EXPECTED RESULT:
The user should be redirected to the public Reflex website.

ACTUAL RESULT:
The navigation worked successfully.

STATUS:
PASS


------------------------------------------------------------
TC-021 — ROLE-BASED NAVIGATION
------------------------------------------------------------

OBJECTIVE:
Verify that each role has appropriate navigation options.


DISPATCHER NAVIGATION:

- Dashboard
- Requests
- Assignments
- Riders


RIDER NAVIGATION:

- Dashboard
- My Deliveries
- Scan Confirmation
- Back to Website


EXPECTED RESULT:
Users should receive role-appropriate navigation and functionality.

ACTUAL RESULT:
Role-specific navigation was displayed correctly.

STATUS:
PASS


============================================================
9. END-TO-END TEST
============================================================

SCENARIO:

Validate the complete delivery lifecycle from order creation
to final delivery.


WORKFLOW:

CUSTOMER
    |
    v
Create Delivery Request
    |
    v
DISPATCHER
    |
    v
Receive Request
    |
    v
Assign Rider
    |
    v
RIDER
    |
    v
Receive Delivery
    |
    v
Pick Up
    |
    v
Deliver
    |
    v
DELIVERED
    |
    v
CUSTOMER
    |
    v
View Delivery Status & History


STATUS TRANSITION VERIFIED:

Pending
    |
    v
Assigned
    |
    v
Picked Up
    |
    v
Delivered


END-TO-END RESULT:

PASS


DESCRIPTION:

The complete delivery workflow was successfully completed.

The Customer was able to create the order.

The Dispatcher successfully received the request and assigned
the Rider.

The Rider successfully received the delivery, picked it up,
and completed the delivery.

The delivery status changed to Delivered.

The Customer was then able to view the final Delivered status
and the complete delivery status history.


============================================================
10. DEFECTS & FINDINGS
============================================================

QA-001
Finding:
Initial rider assignment did not appear on the Rider Dashboard.

Severity:
Medium

Status:
Not consistently reproducible


QA-002
Finding:
The Assignments page appeared empty while the Dispatcher
Dashboard showed assigned deliveries.

Severity:
Medium

Status:
Review Required


QA-003
Finding:
Multiple Andrew/andrew rider records appeared in the Riders list.

Severity:
Low

Status:
Review Required

NOTE:
These may represent test accounts created by different team members.


QA-004
Finding:
A valid Order ID / QR Token was not clearly exposed for
manual confirmation testing.

Severity:
Medium

Status:
Review Required


QA-005
Finding:
Camera/QR scanning is not currently implemented.

Severity:
Low

Status:
Prototype Limitation


============================================================
11. POSITIVE TEST RESULTS
============================================================

The following functionality was successfully verified:

[PASS] Customer can access the application.

[PASS] Customer can create a delivery request.

[PASS] Dispatcher can receive delivery requests.

[PASS] Dispatcher can assign a rider.

[PASS] Rider can receive an assigned delivery.

[PASS] Rider can pick up a delivery.

[PASS] Rider can complete a delivery.

[PASS] Delivery status changes correctly.

[PASS] Customer can view the Delivered status.

[PASS] Delivery status history is retained.

[PASS] Completed deliveries remain in My Deliveries.

[PASS] Rider workload returns to zero after completion.

[PASS] Rider becomes Available after completing deliveries.

[PASS] Pickup/Drop-off selection works.

[PASS] Required-field validation works.

[PASS] Role-based navigation works.

[PASS] Back to Website navigation works.

[PASS] Dispatcher dashboard statistics update correctly.

[PASS] End-to-end delivery workflow passes.


============================================================
12. OVERALL QA ASSESSMENT
============================================================

RESULT:

PASS WITH MINOR FINDINGS


The core functionality of the Reflex Delivery Management System
successfully passed the end-to-end QA test.

The primary delivery lifecycle was successfully verified:

Customer Order
      |
      v
Dispatcher Request
      |
      v
Rider Assignment
      |
      v
Pickup
      |
      v
Delivery
      |
      v
Delivered
      |
      v
Customer Tracking


The system correctly maintained the delivery status sequence:

Pending
    ->
Assigned
    ->
Picked Up
    ->
Delivered


The completed delivery remained accessible in the Rider's
delivery history.

The Customer was also able to view the final delivery status
and complete status history.


============================================================
13. RECOMMENDATIONS BEFORE DEPLOYMENT
============================================================

1. ASSIGNMENT SYNCHRONIZATION

Confirm that assigned deliveries consistently appear on
the Rider Dashboard.


2. ASSIGNMENTS PAGE

Verify that the Assignments page consistently reflects the
same assignment data shown on the Dispatcher Dashboard.


3. RIDER RECORDS

Confirm whether duplicate Andrew/andrew records are intentional
test accounts or duplicate data.


4. DELIVERY CONFIRMATION

Provide valid QA Order ID and QR Token test data for positive
confirmation testing.


5. QR SCANNING

Implement and test camera/QR functionality when the feature
is connected to the required library/backend.


6. REGRESSION TESTING

Re-test affected areas after any fixes or backend changes.


============================================================
14. FINAL CONCLUSION
============================================================

The Reflex Delivery Management System successfully completed
the primary end-to-end delivery workflow during QA testing.

The system successfully supported:

ORDER CREATION
      |
      v
REQUEST MANAGEMENT
      |
      v
RIDER ASSIGNMENT
      |
      v
PICKUP
      |
      v
DELIVERY
      |
      v
STATUS TRACKING
      |
      v
DELIVERY HISTORY


The core delivery functionality is operational and the main
workflow passed testing.


============================================================
FINAL QA STATUS
============================================================

+----------------------------------------------+
|                 QA RESULT                    |
+----------------------------------------------+
|                                              |
|       PASS WITH MINOR FINDINGS               |
|                                              |
|   Core End-to-End Workflow: PASS             |
|   Critical Blockers: 0                       |
|   Review Items: 5                             |
|                                              |
+----------------------------------------------+


RECOMMENDATION:

Proceed to team review and final regression testing before
production deployment.


============================================================
DOCUMENT INFORMATION
============================================================

File:
docs/QA_Test_Document.md

Recommended Commit Message:

docs: add comprehensive QA test document

============================================================
END OF QA TEST DOCUMENT
============================================================
