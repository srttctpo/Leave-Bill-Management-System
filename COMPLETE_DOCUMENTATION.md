# LMS - Complete Documentation
**Leave & Bill Management System with Updated Requirements**

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Updated Leave Rules](#updated-leave-rules)
3. [Modular Architecture](#modular-architecture)
4. [Testing Guide](#testing-guide)
5. [Implementation Instructions](#implementation-instructions)
6. [Files to Delete](#files-to-delete)

---

## System Overview

Complete employee leave and bill management system with:
- Role-based workflows (Individual/HOD/Principal/Admin)
- Automated leave calculations
- LWP (Leave Without Pay) logic
- Academic year tracking (July-June)
- Approval processes

---

## Updated Leave Rules

### Leave Allocation
- **Base Allocation**: 0 CL on joining
- **Current Year Credit**: Months passed since July (e.g., Nov 2025 = 5 CL)
- **Monthly Credit**: +1 CL every month
- **SL**: 0 initially, +10 on joining anniversary
- **OD/CO**: 0 (credit on application approval)

### 3-Day Monthly Paid Leave Limit
- Any employee can take max **3 days paid leave per month** (any combo of CL/SL)
- 4th day onwards automatically becomes **LWP**
- System shows warning dialog **before** submission
- LWP = Leave Without Pay (no salary for those days)

### Leave Balance Calculation
```
Available = Total - Used - Pending
```

- **Total**: CL credited from July
- **Used**: Approved and taken leaves
- **Pending**: Applications submitted but not yet approved (reserves balance)

### LWP Trigger Scenarios
1. **Monthly limit exceeded**: 4+ days in a month → excess = LWP
2. **Zero balance**: Applying when balance = 0 → Auto LWP
3. **User consent required**: Warning dialog must be accepted before submission

### Date Validation
- **Cannot apply** on dates already applied (even if pending/not approved)
- Prevents duplicate leave applications
- Shows error dialog with existing applications

### Academic Year Tracking
- **Period**: July 1 - June 30
- **CL Reset**: July 1 (balance = 0, restart)
- **SL**: Never lapses, accumulates
- **History**: Shows all leaves within academic year

---

## Modular Architecture

### Core Modules Created

#### 1. `leaveCalculations.js`
**Purpose**: Calculation engine
**Functions**:
- `getMonthsSinceJuly()` - Calculates months passed for CL credit
- `getCurrentAcademicYear()` - Returns current AY (e.g., "2025-2026")
- `initializeLeaveBalance(user)` - Sets up leave balance structure
- `getAvailableBalance(user, leaveType)` - Returns available balance
- `checkMonthlyLimitAndLWP()` - Checks 3-day limit, returns LWP breakdown
- `areDatesAlreadyApplied()` - Validates date overlap
- `getAcademicYearLeaveHistory()` - Gets filtered history by role
- `reserveLeaveBalance()` - Reserves balance when application submitted
- `updateLeaveBalanceAfterApproval/Rejection()` - Updates balance post-approval

#### 2. `lwpWarningDialog.js`
**Purpose**: LWP warning modals
**Functions**:
- `showLWPWarningDialog(lwpInfo, callback)` - Monthly limit exceeded warning
- `showZeroBalanceDialog(leaveType, callback)` - Zero balance warning
- `showDateOverlapDialog(overlappingLeaves)` - Date overlap error

**Dialog Types**:
- **Monthly Limit**: Shows paid vs LWP days breakdown
- **Zero Balance**: Warns salary won't be paid
- **Date Overlap**: Lists existing applications

#### 3. `leaveBalanceDisplay.js`
**Purpose**: Visual balance display
**Functions**:
- `displayLeaveBalanceCard(user)` - Full balance cards (all 5 types)
- `displayCompactLeaveBalance(user)` - Compact view for forms
- `showLeaveBalance()` - Dashboard integration

**Display Format**:
```
CL Card:
  Total: 5
  ✔ Used: 2
  ⏳ Pending: 1
  ✨ Available: 2
```

#### 4. `leaveHistoryAcademicYear.js`
**Purpose**: Academic year leave history
**Functions**:
- `showAcademicYearLeaveHistory()` - Displays filtered history

**Features**:
- Summary cards by leave type (Applied/Approved/Pending/Rejected)
- Detailed table with all leave records
- Role-based filtering:
  - **Individual**: Own leaves only
  - **HOD**: Department + own
  - **Principal/Admin**: Whole college

### Centralized Files

#### `strings.js`
- All UI text/messages
- Error messages
- Success messages
- Dialog content

#### `dialog.js`
- Centralized dialog system
- `Dialog.show()` - Universal dialog method
- `Dialog.hide()` - Close dialog

---

## Testing Guide

### Test Scenarios

#### 1. Leave Allocation Test
**Steps**:
1. Create new user (Nov 2025)
2. Check balance
**Expected**: CL=5, SL=0, OD=0, CO=0

#### 2. Monthly Limit Test
**Steps**:
1. Apply 2 days CL
2. Apply 3 more days CL (same month)
**Expected**: Warning showing 1 paid + 2 LWP

#### 3. Zero Balance Test
**Steps**:
1. User with 0 CL
2. Try to apply CL
**Expected**: Zero balance warning, option to apply as LWP

#### 4. Date Overlap Test
**Steps**:
1. Apply: Nov 25-27 (Pending)
2. Try: Nov 26-28
**Expected**: Date overlap error, blocked

#### 5. Balance Display Test
**Check**:
- All 5 leave types visible
- Used/Pending/Available calculated correctly
- Color coding (low balance = orange/yellow)

#### 6. Academic Year History Test
**Check**:
- Header shows correct AY
- Summary cards match detail table
- Role-based filtering works

### Testing Checklist
- [ ] New user gets 5 CL
- [ ] Available = Total - Used - Pending
- [ ] 3-day limit enforced
- [ ] LWP warning shows before submit
- [ ] Zero balance triggers LWP
- [ ] Date overlap blocked
- [ ] Balance cards show correctly
- [ ] Academic year filtering works
- [ ] Role-based visibility correct

---

## Implementation Instructions

### Step 1: Add Script Imports to `dashboard.html`

Add before `</body>` tag:
```html
<!-- Core Modules -->
<script src="strings.js"></script>
<script src="dialog.js"></script>
<script src="errors.js"></script>

<!-- Leave Modules -->
<script src="leaveCalculations.js"></script>
<script src="lwpWarningDialog.js"></script>
<script src="leaveBalanceDisplay.js"></script>
<script src="leaveHistoryAcademicYear.js"></script>
<script src="leaves.js"></script>

<!-- Other Modules -->
<script src="notifications.js"></script>
<script src="script.js"></script>
```

### Step 2: Update `leaves.js`

Integrate new modules:
```javascript
// In applyLeave() function:
function submitLeaveApplication() {
    // ... existing code ...
    
    // Check monthly limit
    const lwpCheck = checkMonthlyLimitAndLWP(
        currentUser.email,
        fromDate,
        toDate,
        days,
        leaveType
    );
    
    if (lwpCheck.willExceedLimit) {
        showLWPWarningDialog(lwpCheck, (proceed) => {
            if (proceed) {
                // Submit with LWP
                finalLeaveType = 'LWP';
                submitApplication();
            }
        });
        return;
    }
    
    // Check zero balance
    if (!hasSufficientBalance(currentUser, leaveType, days)) {
        showZeroBalanceDialog(leaveType, (proceed) => {
            if (proceed) {
                finalLeaveType = 'LWP';
                submitApplication();
            }
        });
        return;
    }
    
    // Check date overlap
    if (areDatesAlreadyApplied(currentUser.email, fromDate, toDate)) {
        const overlapping = /* get overlapping leaves */;
        showDateOverlapDialog(overlapping);
        return;
    }
    
    // Reserve balance
    reserveLeaveBalance(currentUser, leaveType, days);
    
    // Submit application
    submitApplication();
}
```

### Step 3: Initialize User Balances

Run once for existing users:
```javascript
function migrateExistingUsers() {
    const users = JSON.parse(localStorage.getItem('lbs-users')) || [];
    users.forEach(user => {
        user = initializeLeaveBalance(user);
    });
    localStorage.setItem('lbs-users', JSON.stringify(users));
}
```

---

## Files to Delete

After merging into this file, **delete** these MD files:
1. `IMPLEMENTATION_GUIDE_UPDATED_REQUIREMENTS.md`
2. `MODULAR_ARCHITECTURE.md`
3. `MODULAR_FILES_COMPLETE.md`
4. `TESTING_GUIDE.md`

**Keep**:
- `README.md` (project overview)
- `COMPLETE_DOCUMENTATION.md` (this file)

---

## Quick Reference

### Leave Types
- **CL**: Casual Leave (monthly credit)
- **SL**: Sick Leave (anniversary credit)
- **OD**: On Duty (application-based)
- **CO**: Compensatory Off (application-based, 60-day validity)
- **LWP**: Leave Without Pay (auto-assigned)

### Key Numbers
- **3**: Max paid days per month
- **0**: Base CL allocation
- **5**: Current CL (Nov 2025 = 5 months since July)
- **10**: SL credit on anniversary
- **60**: Comp Off validity days

### Integration Status
✅ **Created**: leaveCalculations.js, lwpWarningDialog.js, leaveBalanceDisplay.js, leaveHistoryAcademicYear.js
✅ **Centralized**: strings.js (exists), dialog.js (exists)
⏳ **To Update**: leaves.js, dashboard.html

---

**For issues or questions, refer to the specific module sections above or check the code comments in each JS file.**
