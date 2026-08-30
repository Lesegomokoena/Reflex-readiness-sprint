REFLEX DELIVERY MANAGEMENT SYSTEM
QA TEST DOCUMENT

1. QA TEST OVERVIEW

Project: Reflex Delivery Management System
Testing Type: Functional / End-to-End / UI Validation / Role-Based Testing
Test Date: 30 August 2026
Tester: QA / Quality & Validation Lead

OBJECTIVE
The objective of this QA testing was to verify that the Reflex Delivery Management System functions correctly across the Customer, Dispatcher, and Rider roles.

The testing focused on:
- Customer account and delivery request functionality
- Dispatcher request and rider assignment functionality
- Rider delivery workflow
- Delivery status updates
- Delivery history and tracking
- Form validation
- Navigation
- Role-specific access
- Synchronization of delivery information between users


2. USER ROLES TESTED

CUSTOMER
- Create/login to an account
- Create a delivery request
- View delivery status
- View delivery history/tracking

DISPATCHER
- View dashboard
- View delivery requests
- Assign riders
- View rider availability
- View delivery statistics

RIDER
- View assigned deliveries
- View delivery history
- Pick up deliveries
- Complete deliveries
- Use delivery confirmation functionality


3. TEST ENVIRONMENT

Application: Reflex Delivery Management System
Testing Method: Manual Functional Testing
Browser/Application: Web Application
Test Data: Test customer, test delivery and rider accounts
Primary Test Rider: Andrew


4. TEST CASES


TEST CASE 01: Customer Account / Login

Objective:
Verify that the customer can access the application using the account flow.

Steps:
1. Open the Reflex application.
2. Select Create Account / Login.
3. Enter the required account information.
4. Submit the form.
5. Access the application.

Expected Result:
The user should be able to create/access an account and enter the application.

Actual Result:
The account/login flow was accessible and functional.

Status:
PASS


TEST CASE 02: Customer Creates Delivery Request

Objective:
Verify that a customer can create a delivery/order.

Steps:
1. Log in as a customer.
2. Navigate to the delivery/request functionality.
3. Enter the required delivery information.
4. Submit the delivery request.
5. Verify that the order is created.

Expected Result:
A delivery request should be created successfully and become available for processing.

Actual Result:
A delivery/order was successfully created.

Status:
PASS


TEST CASE 03: Dispatcher Receives Delivery Request

Objective:
Verify that the dispatcher can receive and manage a delivery request.

Steps:
1. Log out of the customer account.
2. Log in as Dispatcher.
3. Navigate to the Dispatcher Dashboard / Requests.
4. Check for the newly created delivery request.

Expected Result:
The delivery request should be available to the dispatcher.

Actual Result:
The delivery request was successfully available for dispatcher processing.

Status:
PASS


TEST CASE 04: Dispatcher Assigns Rider

Objective:
Verify that a dispatcher can assign a rider to a delivery.

Steps:
1. Log in as Dispatcher.
2. Locate the delivery request.
3. Select Assign Rider.
4. Select Andrew as the rider.
5. Confirm the assignment.
6. Check the Dispatcher Dashboard.

Expected Result:
The rider should be assigned successfully and the delivery should move to the assigned state.

Actual Result:
Andrew was successfully assigned to the delivery. The Dispatcher Dashboard reflected the assigned delivery.

Status:
PASS


TEST CASE 05: Rider Receives Assigned Delivery

Objective:
Verify that an assigned delivery is available to the rider.

Steps:
1. Log out of the Dispatcher account.
2. Log in as the Rider.
3. Open the Rider Dashboard.
4. Open My Deliveries.
5. Check for the assigned delivery.

Expected Result:
The assigned delivery should appear on the Rider Dashboard and under My Deliveries.

Actual Result:
During an initial test, the assigned delivery did not appear on the Rider Dashboard and My Deliveries showed no delivery.

During a subsequent end-to-end test, a newly created delivery was successfully received by the rider.

Status:
PASS / ISSUE OBSERVED DURING INITIAL TEST


TEST CASE 06: Rider Pickup

Objective:
Verify that the rider can pick up an assigned delivery.

Steps:
1. Log in as Rider.
2. Open the assigned delivery.
3. Select the pickup action.
4. Confirm the pickup.

Expected Result:
The delivery status should change from Assigned to Picked Up.

Actual Result:
The rider successfully picked up the delivery.

Status:
PASS


TEST CASE 07: Rider Delivery Completion

Objective:
Verify that the rider can complete a delivery.

Steps:
1. Open the assigned/picked-up delivery.
2. Proceed with the delivery.
3. Complete the delivery.
4. Verify the delivery status.

Expected Result:
The delivery status should change to Delivered.

Actual Result:
The delivery was successfully completed and the Rider side displayed Delivered.

Status:
PASS


TEST CASE 08: Customer Delivery Status Tracking

Objective:
Verify that the customer can view the updated delivery status.

Steps:
1. Log in as the customer.
2. Open the completed delivery.
3. Review the delivery status.
4. Review the status history.

Expected Result:
The customer should see the delivery as Delivered and be able to view the delivery status history.

Actual Result:
The customer successfully viewed the delivery as Delivered.

The status history displayed:

Pending
→ Assigned
→ Picked Up
→ Delivered

The timestamps were also displayed correctly.

Status:
PASS


TEST CASE 09: Delivery History

Objective:
Verify that completed deliveries remain accessible after completion.

Steps:
1. Log in as Rider.
2. Open My Deliveries.
3. Locate the completed delivery.
4. Open the delivery details.

Expected Result:
The completed delivery should remain visible in delivery history with the Delivered status.

Actual Result:
The completed delivery remained visible under My Deliveries and displayed Delivered.

Status:
PASS


TEST CASE 10: Completed Delivery Details

Objective:
Verify that completed delivery information is retained and displayed correctly.

Steps:
1. Open a completed delivery.
2. Review the delivery details.
3. Verify customer, item, rider, status and status history.

Expected Result:
The completed delivery should display accurate delivery information.

Actual Result:
The delivery details were displayed correctly.

Example tested delivery:

Delivery ID:
266a98a6-a180-43e0-a6fd-f0458d99f862

Customer:
Matthew Lang

Item:
Socks

Rider:
andrew

Address:
Nairobi

Status:
Delivered

Status History:
01:29 PM - Pending
01:31 PM - Assigned
01:33 PM - Picked Up
01:33 PM - Delivered

Status:
PASS


TEST CASE 11: Rider Availability After Delivery

Objective:
Verify that a rider's workload is cleared after completing a delivery.

Steps:
1. Complete a delivery as Rider.
2. Log in as Dispatcher.
3. Navigate to Riders.
4. Locate Andrew.
5. Check Status and Current Deliveries.

Expected Result:
The rider should become Available and Current Deliveries should return to 0 after completing all assigned deliveries.

Actual Result:
Andrew displayed:

Status: Available
Current Deliveries: 0

Status:
PASS


TEST CASE 12: Dispatcher Dashboard Statistics

Objective:
Verify that delivery statistics are updated after completing deliveries.

Steps:
1. Log in as Dispatcher.
2. Open the Dispatcher Dashboard.
3. Review Open Requests.
4. Review Assigned.
5. Review In Progress.
6. Review Delivered.

Expected Result:
Completed deliveries should be reflected in the delivery statistics and there should be no active deliveries if all test deliveries have been completed.

Actual Result:
The dashboard displayed:

Open Requests: 0
Assigned: 0
In Progress: 0
Delivered: 6

This represented a clean state at the time of testing.

Status:
PASS


TEST CASE 13: Scan Confirmation - Scan Type Selection

Objective:
Verify that the Rider can select the appropriate delivery confirmation type.

Steps:
1. Log in as Rider.
2. Open Scan Confirmation.
3. Open the Scan Type field.
4. Select Pickup.
5. Select Drop off.

Expected Result:
The system should allow the rider to select the appropriate scan type.

Actual Result:
Both Pickup and Drop off could be selected successfully.

Status:
PASS


TEST CASE 14: Scan Confirmation - Required Field Validation

Objective:
Verify that the system prevents confirmation when required information is missing.

Steps:
1. Open Scan Confirmation.
2. Select Pickup or Drop off.
3. Leave Order ID empty.
4. Leave QR Token empty.
5. Select Confirm Delivery.

Expected Result:
The system should prevent confirmation and display a validation message.

Actual Result:
The system displayed:

"Order ID and Token are required."

The delivery was not confirmed.

Status:
PASS


TEST CASE 15: Scan Confirmation - Invalid Delivery Reference

Objective:
Verify system behaviour when delivery confirmation information does not match a delivery request.

Steps:
1. Open Scan Confirmation.
2. Enter delivery confirmation information.
3. Attempt to confirm the delivery.

Expected Result:
The system should identify whether the delivery request exists before confirming it.

Actual Result:
The system displayed:

"Delivery request not found."

This test could not be fully validated because a clearly exposed valid Order ID and QR Token were not available in the tested delivery workflow.

Status:
NOT FULLY TESTABLE / REVIEW REQUIRED


TEST CASE 16: QR / Camera Scanning

Objective:
Verify QR scanning functionality.

Steps:
1. Open Scan Confirmation.
2. Attempt to use the scanning functionality.

Expected Result:
The system should open the camera and scan a QR code if the feature is implemented.

Actual Result:
Camera-based scanning was not implemented.

The application itself states that camera access can be connected to a barcode/QR library when the backend is ready and that the current prototype provides a manual confirmation flow.

Status:
NOT IMPLEMENTED / EXPECTED PROTOTYPE LIMITATION


TEST CASE 17: Dispatcher Requests Page

Objective:
Verify that the Requests section is accessible.

Steps:
1. Log in as Dispatcher.
2. Open Requests.

Expected Result:
The Requests page should load and display available requests when requests exist.

Actual Result:
The page loaded successfully but displayed no open requests when there were none available.

Status:
PASS


TEST CASE 18: Dispatcher Assignments Page

Objective:
Verify that the Assignments section displays assigned deliveries.

Steps:
1. Log in as Dispatcher.
2. Assign a delivery to a rider.
3. Open Assignments.
4. Check whether the assigned delivery is displayed.

Expected Result:
Assigned deliveries should be displayed in the Assignments section.

Actual Result:
During an initial test, the Dispatcher Dashboard showed assigned deliveries while the Assignments page appeared empty.

This behaviour was not consistently reproducible during the later successful end-to-end test.

Status:
ISSUE OBSERVED / REVIEW REQUIRED


TEST CASE 19: Dispatcher Riders Page

Objective:
Verify that rider information and availability are displayed.

Steps:
1. Log in as Dispatcher.
2. Open Riders.
3. Review the rider list.
4. Check rider status and current delivery count.

Expected Result:
The rider list should display rider information, status and current delivery load.

Actual Result:
The rider list loaded successfully.

Andrew was later confirmed as:

Status: Available
Current Deliveries: 0

Status:
PASS


TEST CASE 20: Back to Website Navigation

Objective:
Verify navigation from the application back to the public website.

Steps:
1. Log in as Rider.
2. Select Back to Website.

Expected Result:
The user should be redirected to the Reflex public website/landing page.

Actual Result:
The application successfully redirected to the website.

Status:
PASS


TEST CASE 21: Role-Based Navigation

Objective:
Verify that different user roles have access to appropriate navigation options.

Steps:
1. Log in as Dispatcher.
2. Review available navigation.
3. Log out.
4. Log in as Rider.
5. Review available navigation.

Expected Result:
Each role should have role-specific navigation and functionality.

Actual Result:

Dispatcher navigation:
- Dashboard
- Requests
- Assignments
- Riders

Rider navigation:
- Dashboard
- My Deliveries
- Scan Confirmation
- Back to Website

The navigation was appropriate for the respective roles.

Status:
PASS


5. END-TO-END TEST

TEST SCENARIO:
Complete a delivery from customer order creation to final delivery.

FLOW:

Customer
    ↓
Creates Delivery Request
    ↓
Dispatcher
    ↓
Receives Request
    ↓
Assigns Rider
    ↓
Rider
    ↓
Receives Delivery
    ↓
Picks Up Delivery
    ↓
Delivers Order
    ↓
Delivery Status = Delivered
    ↓
Customer
    ↓
Views Delivered Status and Status History

RESULT:

The complete end-to-end delivery workflow was successfully completed.

The tested delivery progressed through:

Pending
↓
Assigned
↓
Picked Up
↓
Delivered

FINAL END-TO-END STATUS:
PASS


6. ISSUES / FINDINGS

ISSUE 01: Initial Rider Assignment Visibility

Description:
During the initial test, a delivery assigned to Andrew on the Dispatcher side did not immediately appear on the Rider Dashboard or My Deliveries.

Impact:
The assignment appeared successful on the Dispatcher side but was initially not visible to the rider.

Later Result:
A subsequent end-to-end test successfully delivered an order through the same workflow, so the issue was not consistently reproducible.

Recommendation:
Review assignment synchronization and monitor for recurrence.


ISSUE 02: Assignments Page

Description:
During an initial test, the Dispatcher Dashboard displayed assigned deliveries while the Assignments page appeared empty.

Impact:
Potential inconsistency between dashboard statistics and assignment records.

Later Result:
The behaviour was not consistently reproducible.

Recommendation:
Review the Assignments page data retrieval and synchronization.


ISSUE 03: Duplicate Rider Records

Description:
The Riders page displayed multiple Andrew/andrew entries during testing.

Impact:
Duplicate rider records may cause confusion when assigning deliveries.

Recommendation:
Confirm whether these are intentional test accounts or duplicate rider records.


ISSUE 04: Manual Delivery Confirmation

Description:
The Scan Confirmation flow requires an Order ID and QR Token, but these values were not clearly exposed in the tested delivery workflow.

Impact:
The manual confirmation flow could not be fully tested with a valid delivery reference.

Recommendation:
Provide or expose valid test Order ID and QR Token values for QA testing.


ISSUE 05: QR Camera Scanning

Description:
Camera-based QR scanning is not currently implemented.

Impact:
Automatic QR scanning could not be tested.

Recommendation:
Implement/connect the QR/barcode scanning library when the backend/feature is ready.


7. POSITIVE TEST RESULTS

The following functionality was successfully verified:

- Customer can create a delivery request.
- Dispatcher can receive delivery requests.
- Dispatcher can assign a rider.
- Rider can receive assigned deliveries.
- Rider can pick up a delivery.
- Rider can complete a delivery.
- Delivery status changes correctly.
- Customer can see the Delivered status.
- Delivery status history is retained.
- Completed deliveries remain visible in My Deliveries.
- Rider workload returns to 0 after completion.
- Rider becomes Available after completing deliveries.
- Scan type selection works.
- Required-field validation works.
- Role-specific navigation works.
- Back to Website navigation works.
- Dispatcher dashboard statistics update correctly.
- End-to-end delivery workflow successfully completed.


8. OVERALL QA RESULT

Overall Result:
PASS WITH MINOR FINDINGS

The core Reflex delivery workflow was successfully tested from customer order creation through dispatcher assignment, rider pickup, delivery completion and customer tracking.

The system successfully maintained the delivery status sequence:

Pending → Assigned → Picked Up → Delivered

The major functional workflow is operational.

A small number of findings were observed during testing, mainly related to assignment visibility, the Assignments page, duplicate rider records and the current limitations of the manual/QR confirmation flow.

Some of the initially observed assignment issues were not consistently reproducible during subsequent end-to-end testing.


9. QA RECOMMENDATION

Recommendation:
READY FOR FURTHER TEAM REVIEW / PRE-DEPLOYMENT REVIEW

The core functionality has passed the manual QA test.

Before deployment, the development team should review:
1. Rider assignment synchronization.
2. Assignments page data consistency.
3. Duplicate rider records.
4. Availability of valid Order ID and QR Token test data.
5. Future implementation of QR/camera scanning.

After these items are reviewed, a final regression test should be performed before production deployment.


10. FINAL CONCLUSION

The Reflex Delivery Management System successfully completed the primary end-to-end delivery workflow.

The system was able to process a delivery through:

CUSTOMER ORDER
→ DISPATCHER REQUEST
→ RIDER ASSIGNMENT
→ PICKUP
→ DELIVERY
→ CUSTOMER TRACKING

The final delivery status and status history were correctly maintained and displayed.

Overall QA Assessment:
PASS WITH MINOR FINDINGS
