# REF-11 — Edge-Case Testing

## Objective

Test failure conditions and unusual workflows to ensure that
the Reflex Delivery Management System handles invalid input,
duplicate actions and unexpected states safely.

---

## Test Results

| Test ID | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| EC-01 | Unknown delivery | Reject unknown delivery | "Delivery request not found." | PASS |
| EC-02 | Unknown rider | Reject invalid rider | No valid unknown rider could be selected through the normal UI | REVIEW |
| EC-03 | Duplicate assignment | Prevent or safely handle duplicate assignment | Assignment behaviour reviewed during testing | REVIEW |
| EC-04 | Invalid status transition | Prevent invalid status transition | Normal workflow enforced through available actions | PASS |
| EC-05 | Duplicate status update | Prevent duplicate status update | Completed delivery did not provide repeated completion action | PASS |
| EC-06 | Missing required data | Prevent submission | "Order ID and Token are required." | PASS |
| EC-07 | Two assignment attempts | Prevent conflicting assignments | Assignment behaviour reviewed | REVIEW |
| EC-08 | Failed network request | Handle unavailable backend safely | Requires dedicated network simulation | REVIEW |
| EC-09 | Delayed sync | Eventually reflect updated status | Status changes successfully reflected across views | PASS |
| EC-10 | Invalid scan/order ID | Reject invalid ID | "Delivery request not found." | PASS |

---

# EC-01 — Unknown Delivery

EXPECTED:

Unknown delivery references should be rejected.

ACTUAL:

Delivery request not found.

RESULT:

PASS


---

# EC-02 — Unknown Rider

EXPECTED:

The system should prevent assignment to a rider that does
not exist.

ACTUAL:

The normal UI did not provide an invalid/non-existent rider
for selection.

RESULT:

REVIEW REQUIRED

NOTE:

This scenario requires controlled invalid input or backend
testing to fully validate.


---

# EC-03 — Duplicate Assignment

EXPECTED:

A delivery should not be assigned incorrectly multiple times.

ACTUAL:

Assignment behaviour was reviewed during the delivery testing.

RESULT:

REVIEW REQUIRED

NOTE:

Further controlled testing may be required to confirm backend
duplicate-assignment protection.


---

# EC-04 — Invalid Status Transition

EXPECTED:

The system should prevent invalid delivery status transitions.

Example:

Pending → Delivered

without:

Assigned → Picked Up

ACTUAL:

The normal Rider workflow followed the expected sequence:

Pending
   ↓
Assigned
   ↓
Picked Up
   ↓
Delivered

RESULT:

PASS


---

# EC-05 — Duplicate Status Update

EXPECTED:

The system should prevent a completed delivery from being
completed repeatedly.

ACTUAL:

After the delivery reached Delivered, no additional delivery
completion action was available through the normal workflow.

RESULT:

PASS


---

# EC-06 — Missing Required Data

EXPECTED:

The system should reject incomplete confirmation requests.

ACTUAL:

Order ID and Token are required.

RESULT:

PASS


---

# EC-07 — Two Assignment Attempts

EXPECTED:

The system should safely handle multiple assignment attempts
for the same delivery.

ACTUAL:

The assignment workflow was reviewed during testing.

RESULT:

REVIEW REQUIRED

NOTE:

Further controlled testing is recommended to confirm the
backend behaviour under simultaneous assignment attempts.


---

# EC-08 — Failed Network Request

EXPECTED:

The application should handle backend/network failure
without corrupting delivery data.

ACTUAL:

A dedicated network-failure simulation was not completed
during the current test session.

RESULT:

REVIEW REQUIRED


---

# EC-09 — Delayed Synchronisation

EXPECTED:

A delivery status change should eventually be reflected
across the relevant interfaces.

ACTUAL:

The delivery successfully progressed across the system and
the final Delivered state was visible to the relevant user.

RESULT:

PASS


---

# EC-10 — Invalid Scan / Order ID

EXPECTED:

An invalid order ID should be rejected.

ACTUAL:

Delivery request not found.

RESULT:

PASS


---

## Edge-Case Summary

PASS:

- Unknown delivery handling
- Invalid order ID handling
- Missing required field validation
- Normal status transition protection
- Duplicate completion prevention
- Delivery status synchronisation

REVIEW REQUIRED:

- Unknown rider through controlled invalid input
- Duplicate assignment protection
- Two simultaneous assignment attempts
- Failed network request simulation

---

## Conclusion

The system successfully handled the major invalid-input and
workflow edge cases tested.

The remaining review items require either controlled backend
testing or network simulation that is not exposed through the
normal application interface.
