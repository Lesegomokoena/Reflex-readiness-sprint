# REFLEX — QA TEST REPORT

## Project Information

**Project:** Reflex  
**Tester:** Lesego  
**Testing Date:** 29 August 2026  
**Testing Environment:** GitHub Codespaces  
**Backend:** Flask API  
**Frontend:** HTML/CSS  
**Testing Type:** Functional, UI, Navigation, Form Validation, Authentication

---

## Objective

The purpose of this QA testing is to validate the latest Reflex build before deployment.

Testing focuses on:

- Landing page and UI
- Navigation
- Authentication
- Account creation
- User roles
- Form validation
- Retailer workflow
- Dispatcher workflow
- Rider workflow
- API/frontend communication
- Delivery status updates
- Real-time dashboard synchronization

---

## Test Results

| ID     | Test Case                | Expected Result                               | Actual Result                                                 | Status             |
|--------|--------------------------|-----------------------------------------------|---------------------------------------------------------------|--------------------|
| TC-001 | Backend availability     | Backend should start and respond              | Backend started successfully and API response was displayed   | PASS               |
| TC-002 | Landing page             | Page should load correctly                    | Page loaded correctly; image zoom animation is slightly shaky | PASS - Minor Issue |
| TC-003 | Retailer login           | Valid credentials should authenticate         | "Load failed" displayed                                       | FAIL               |
| TC-004 | Login → Home             | Back should return to home                    | Returned to home correctly                                    | PASS               |
| TC-005 | Invalid login            | Invalid credentials should show a clear error | "Load failed" displayed                                       | FAIL               |
| TC-006 | Empty registration form  | Empty fields should be rejected               | User was prompted to fill empty fields                        | PASS               |
| TC-007 | Valid account creation   | Valid information should create an account    | "Load failed" displayed                                       | FAIL               |
| TC-008 | Account type options     | All roles should be available                 | Retailer, Dispatcher and Rider available                      | PASS               |
| TC-009 | Start for free           | Should open Create Account                    | Create Account opened correctly                               | PASS               |
| TC-010 | Rider account selection  | Rider should be selectable                    | Rider selected successfully                                   | PASS               |
| TC-011 | Account type switching   | Roles should be switchable                    | Retailer, Dispatcher and Rider can be selected                | PASS               |
| TC-012 | Dispatcher login         | Valid credentials should authenticate         | "Load failed" displayed                                       | FAIL               |
| TC-013 | Rider login              | Valid credentials should authenticate         | "Load failed" displayed                                       | FAIL               |
| TC-014 | Sign In → Create Account | Should open registration                      | Registration opened correctly                                 | PASS               |
| TC-015 | Create Account → Sign In | Should return to login                        | Login page opened correctly                                   | PASS               |

---

## Bugs / Issues Found

### BUG-001 — Landing Page Image Animation Is Slightly Shaky

**Severity:** Low

**Area:** Landing Page / UI

**Expected Result:**  
The image zoom animation should be smooth and stable.

**Actual Result:**  
The zoom in/out animation works, but appears slightly shaky.

**Impact:**  
Minor visual/UX issue. It does not prevent the application from being used.

**Status:** Open

---

### BUG-002 — Frontend Authentication Returns "Load failed"

**Severity:** High

**Area:** Authentication / Frontend-to-API communication

**Affected Roles:**
- Retailer
- Dispatcher
- Rider

**Steps to Reproduce:**
1. Open the Reflex landing page.
2. Select Sign In.
3. Enter valid demo credentials.
4. Select Sign In.

**Expected Result:**  
The user should successfully log in and be redirected to the appropriate area.

**Actual Result:**  
The application displays "Load failed."

**Impact:**  
Users cannot authenticate through the frontend, preventing access to the main role-based workflows.

**Status:** Open

---

### BUG-003 — Account Creation Returns "Load failed"

**Severity:** High

**Area:** Registration / Frontend-to-API communication

**Steps to Reproduce:**
1. Open Create Account.
2. Enter valid test information.
3. Select an account type.
4. Select Create Account.

**Expected Result:**  
The account should be created successfully or a clear response should be displayed.

**Actual Result:**  
The application displays "Load failed."

**Impact:**  
New users cannot create accounts through the frontend.

**Status:** Open

---

## Positive Findings

The following areas are currently working:

- Backend server starts successfully
- Backend API responds successfully
- Landing page loads
- Landing page content displays correctly
- Main navigation works
- Sign In navigation works
- Back navigation works
- Start for free opens Create Account
- Create Account page loads
- Required-field validation works
- Account type options are available
- Retailer, Dispatcher and Rider roles can be selected
- Sign In ↔ Create Account navigation works

---

## Blocked Testing

The following workflows could not be fully tested because authentication currently returns "Load failed":

### Retailer
- [ ] Retailer dashboard
- [ ] Create delivery
- [ ] View deliveries
- [ ] View delivery details
- [ ] Monitor delivery status

### Dispatcher
- [ ] View delivery requests
- [ ] Check rider availability
- [ ] Assign rider
- [ ] Manage workloads

### Rider
- [ ] View assigned deliveries
- [ ] Scan delivery QR token
- [ ] Update pickup status
- [ ] Update delivery status
- [ ] Confirm handoff

### End-to-End
- [ ] Retailer → Dispatcher → Rider → Delivery completion

### Real-Time Synchronization
- [ ] Verify dashboard updates when delivery status changes

---

## Overall QA Status

**NOT READY FOR FINAL QA SIGN-OFF**

The frontend and backend are accessible and several UI, navigation and validation features are working.

However, authentication and account creation currently fail with "Load failed". This prevents complete testing of the main retailer, dispatcher and rider workflows.

---

## Recommendation

Before deployment:

1. Investigate the authentication/API communication issue.
2. Fix the login failure.
3. Fix the account creation failure.
4. Retest retailer login.
5. Retest dispatcher login.
6. Retest rider login.
7. Retest account creation.
8. Test retailer delivery creation.
9. Test dispatcher rider assignment.
10. Test rider QR scanning.
11. Test delivery status updates.
12. Test real-time dashboard synchronization.
13. Perform end-to-end testing.
14. Perform regression testing.
15. Complete final QA sign-off.

---

## Final QA Conclusion

The latest Reflex build successfully loads the frontend and backend, and several navigation and validation features are functioning correctly.

However, authentication and account creation currently fail from the frontend with a "Load failed" message. Since authentication is required for the main retailer, dispatcher and rider workflows, these workflows remain blocked.

**Recommendation: Resolve the authentication/API communication issue and perform full regression and end-to-end testing before deployment.**
