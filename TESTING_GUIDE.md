# LMS Testing Guide - Updated Requirements

## Overview
This guide covers testing for the updated Leave Management System with new features including LWP logic, academic year tracking, and enhanced balance display.

## Files Created (Ready for Testing)

### Core Modules:
1. **leaveCalculations.js** - Leave calculation engine
2. **lwpWarningDialog.js** - LWP warning dialogs
3. **leaveBalanceDisplay.js** - Balance display with used/pending/available
4. **leaveHistoryAcademicYear.js** - Academic year leave history

### Integration Required:
- These modules need to be imported in `dashboard.html`
- Existing `leaves.js` needs to be updated to call these modules

## Key Features to Test

### 1. Leave Allocation (Base + Current Year Credit)
**Expected Behavior:**
- New users start with 0 CL base
- For current academic year (July 2025 - June 2026), users should have 5 CL (Nov = 5 months passed since July)
- SL: 0 initially, 10 added on joining anniversary

**Test Steps:**
1. Create new user account
2. Check leave balance
3. Verify CL = 5, SL = 0, OD = 0, CO = 0

---

### 2. 3-Day Monthly Paid Leave Limit
**Expected Behavior:**
- Any month, employee can take max 3 days of paid leave (CL/SL combo)
- 4th day onwards automatically becomes LWP
- LWP warning dialog should appear BEFORE submitting

**Test Steps:**
1. Apply for 2 days CL in November
2. Apply for 3 more days CL in November
3. **Expected**: Warning dialog showing:
   - 1 day will be paid
   - 2 days will be LWP
4. User can cancel or proceed

**Test Scenarios:**
- Scenario A: 3 CL (all paid) ✅
- Scenario B: 2 CL + 2 SL = 4 days → 3 paid + 1 LWP
- Scenario C: Already took 3 CL, applying 1 more → 0 paid + 1 LWP

---

### 3. Zero Balance = Auto LWP
**Expected Behavior:**
- If user has 0 CL balance and applies for CL → Auto marked as LWP
- Dialog should warn user before submission

**Test Steps:**
1. User with 0 CL balance
2. Try to apply CL
3. **Expected**: Zero balance warning dialog
4. If user proceeds, leave is marked as LWP

---

### 4. Date Overlap Validation
**Expected Behavior:**
- Cannot apply leave on dates that are already applied (even if pending/not approved)

**Test Steps:**
1. Apply leave: 25-Nov to 27-Nov (Status: Pending)
2. Try to apply another leave: 26-Nov to 28-Nov
3. **Expected**: Date overlap error dialog
4. Application should be blocked

---

### 5. Leave Balance Display (Used/Pending/Available)
**Expected Display Format:**
```
CL Card:
  Total: 5
  ✔ Used: 2
  ⏳ Pending: 1
  ✨ Available: 2
```

**Test Steps:**
1. Click "Leave Balance" on dashboard
2. Verify all 5 leave types shown (CL, SL, OD, CO, LWP)
3. Verify calculation: Available = Total - Used - Pending
4. Check color coding:
   - Low balance (< 3 CL): Yellow/Orange
   - Zero balance: Orange
   - LWP card: Red

---

### 6. Academic Year History (July-June)
**Expected Behavior:**
- Shows all leaves for current academic year
- Role-based filtering:
  - **Individual**: Own leaves only
  - **HOD**: Department employees + own
  - **Principal/Admin**: Whole college

**Test Steps:**
1. Click "Leave History" or view academic year report
2. Verify header shows: "Academic Year: 2025-2026 (July 2025 - June 2026)"
3. Verify summary cards showing:
   - Applied, Approved, Pending, Rejected counts per leave type
4. Verify detailed table with all columns
5. **Role-based test**:
   - Login as HOD → should see all dept employees
   - Login as Individual → should see only own leaves

---

### 7. LWP Warning Dialogs
**Three Types of Dialogs:**

**Dialog A: Monthly Limit Exceeded**
```
⚠️ Leave Without Pay (LWP) Warning

You have exceeded the 3-day paid leave limit for this month!

📊 Paid leaves already taken this month: 3 days
📝 You are requesting: 2 days
✅ Will be marked as paid: 0 days  
❌ Will be LWP (unpaid): 2 days

💡 Note: LWP means you will not receive salary for 2 day(s).

Buttons: [Cancel] [Continue with LWP]
```

**Dialog B: Zero Balance**
```
⚠️ No Leave Balance Available

❌ You don't have any CL balance!

📊 Your CL balance: 0 days
💰 This leave will be marked as LWP (Leave Without Pay)

Buttons: [Cancel] [Apply as LWP]
```

**Dialog C: Date Overlap**
```
❌ Date Already Applied

⚠️ You have already applied for leave on these dates!

Existing leave applications:
• CL: 2025-11-25 to 2025-11-27 (pending)

Button: [OK]
```

---

## Testing Checklist

### Balance Calculations
- [ ] New user gets 5 CL (Nov 2025)
- [ ] Available = Total - Used - Pending
- [ ] Pending reserves balance immediately
- [ ] Approved moves from pending to used
- [ ] Rejected releases pending back

### LWP Logic
- [ ] 3-day monthly limit enforced
- [ ] Warning shows correct breakdown
- [ ] Zero balance triggers LWP warning
- [ ] User can cancel before submitting
- [ ] LWP leaves properly tracked

### Date Validation
- [ ] Cannot apply on overlapping dates
- [ ] Validation checks pending + approved leaves
- [ ] Clear error message shown

### Display & UI
- [ ] Balance cards show all 5 types
- [ ] Used/Pending/Available all visible
- [ ] Academic year header correct
- [ ] Role-based filtering works
- [ ] Summary cards match detail table

### Role-Based Access
- [ ] Individual sees only own leaves
- [ ] HOD sees department leaves
- [ ] Principal sees all college leaves
- [ ] Admin sees all college leaves

---

## Integration Steps (For Developer)

To make these modules work, update `dashboard.html`:

```html
<!-- Add before </body> tag -->
<script src="leaveCalculations.js"></script>
<script src="lwpWarningDialog.js"></script>
<script src="leaveBalanceDisplay.js"></script>
<script src="leaveHistoryAcademicYear.js"></script>
<script src="leaves.js"></script>
```

---

## Known Issues to Watch For

1. **Month boundary**: Test on last day of month transitioning to next
2. **Academic year transition**: Test in June/July for year changeover
3. **Multiple pending applications**: Ensure balance reserves correctly
4. **Dialog z-index**: Ensure dialogs appear on top

---

## Test Data Setup

### Create Test Users:
1. **Employee 1**: 5 CL, 0 SL (fresh user)
2. **Employee 2**: 3 CL already used this month
3. **Employee 3**: 0 CL balance
4. **HOD**: Access to department
5. **Admin**: Access to all

### Create Test Leaves:
- Some approved in current month
- Some pending
- Some from previous months
- Mix of all leave types

---

## Success Criteria

✅ All dialogs appear correctly
✅ Balance calculations are accurate
✅ LWP auto-conversion works
✅ Date overlap blocked
✅ Role-based visibility correct
✅ Academic year display accurate

---

## Contact
For issues or questions during testing, document them with:
- Screenshot
- Steps to reproduce
- Expected vs Actual behavior
- User role and leave balance state
