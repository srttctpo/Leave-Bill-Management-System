// LEAVE CALCULATIONS MODULE
// Handles all leave balance calculations, monthly limits, LWP logic, and academic year tracking

// Calculate current month from academic year start (July = 0, August = 1, etc.)
function getMonthsSinceJuly() {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11 (Jan=0)
    const currentYear = today.getFullYear();
    
    // If we're in July-Dec, months since July = current month - 6
    // If we're in Jan-June, months since July = current month + 6
    if (currentMonth >= 6) { // July onwards
        return currentMonth - 6; // July=0, Aug=1, Sep=2, Oct=3, Nov=4, Dec=5
    } else { // Jan to June
        return currentMonth + 6; // Jan=6, Feb=7, Mar=8, Apr=9, May=10, June=11
    }
}

// Get academic year based on current date
function getCurrentAcademicYear() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if (currentMonth >= 6) { // July onwards
        return `${currentYear}-${currentYear + 1}`;
    } else { // Jan to June
        return `${currentYear - 1}-${currentYear}`;
    }
}

// Initialize leave balance for new user or update existing users
function initializeLeaveBalance(user) {
    if (!user.leaveBalance) {
        const monthsPassed = getMonthsSinceJuly();
        user.leaveBalance = {
            CL: monthsPassed, // 0 base + months passed since July
            SL: 0,
            OD: 0,
            CO: 0,
            LWP: 0
        };
        user.leaveUsed = {
            CL: 0,
            SL: 0,
            OD: 0,
            CO: 0,
            LWP: 0
        };
        user.leavePending = {
            CL: 0,
            SL: 0,
            OD: 0,
            CO: 0,
            LWP: 0
        };
    }
    return user;
}

// Calculate available leave balance (total - used - pending)
function getAvailableBalance(user, leaveType) {
    if (!user.leaveBalance) user = initializeLeaveBalance(user);
    
    const total = user.leaveBalance[leaveType] || 0;
    const used = user.leaveUsed[leaveType] || 0;
    const pending = user.leavePending[leaveType] || 0;
    
    return total - used - pending;
}

// Get paid leaves taken in current month
function getPaidLeavesInMonth(userEmail, month, year) {
    const leaveApps = getLeaveApplications();
    
    const monthLeaves = leaveApps.filter(leave => {
        if (leave.applicantEmail !== userEmail) return false;
        if (leave.status === 'rejected') return false;
        
        const leaveDate = new Date(leave.fromDate);
        const leaveMonth = leaveDate.getMonth();
        const leaveYear = leaveDate.getFullYear();
        
        // Only count non-LWP leaves
        return leaveMonth === month && leaveYear === year && leave.leaveType !== 'LWP';
    });
    
    return monthLeaves.reduce((total, leave) => total + leave.days, 0);
}

// Check if leave will exceed 3-day monthly limit and calculate LWP days
function checkMonthlyLimitAndLWP(userEmail, fromDate, toDate, requestedDays, leaveType) {
    const from = new Date(fromDate);
    const month = from.getMonth();
    const year = from.getFullYear();
    
    const paidDaysInMonth = getPaidLeavesInMonth(userEmail, month, year);
    const totalPaidDays = paidDaysInMonth + requestedDays;
    
    let lwpDays = 0;
    let paidDays = requestedDays;
    
    // If exceeding 3 days and not already LWP/OD/CO
    if (totalPaidDays > 3 && leaveType !== 'LWP' && leaveType !== 'OD' && leaveType !== 'CO') {
        const remainingPaidAllowance = Math.max(0, 3 - paidDaysInMonth);
        paidDays = remainingPaidAllowance;
        lwpDays = requestedDays - remainingPaidAllowance;
    }
    
    return {
        willExceedLimit: lwpDays > 0,
        paidDays: paidDays,
        lwpDays: lwpDays,
        totalPaidInMonth: totalPaidDays
    };
}

// Check if user has sufficient balance
function hasSufficientBalance(user, leaveType, days) {
    if (leaveType === 'LWP') return true; // LWP always allowed
    
    const available = getAvailableBalance(user, leaveType);
    return available >= days;
}

// Check if dates are already applied for
function areDatesAlreadyApplied(userEmail, fromDate, toDate) {
    const leaveApps = getLeaveApplications();
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    // Check for overlapping dates
    const overlapping = leaveApps.filter(leave => {
        if (leave.applicantEmail !== userEmail) return false;
        if (leave.status === 'rejected') return false;
        
        const leaveFrom = new Date(leave.fromDate);
        const leaveTo = new Date(leave.toDate);
        
        // Check if dates overlap
        return (from <= leaveTo && to >= leaveFrom);
    });
    
    return overlapping.length > 0;
}

// Get academic year leave history with detailed breakdown
function getAcademicYearLeaveHistory(userEmail, role, department) {
    const leaveApps = getLeaveApplications();
    const currentAY = getCurrentAcademicYear();
    const [startYear, endYear] = currentAY.split('-').map(y => parseInt(y));
    
    // Academic year: July startYear to June endYear
    const ayStart = new Date(startYear, 6, 1); // July 1
    const ayEnd = new Date(endYear, 5, 30); // June 30
    
    let filteredLeaves = [];
    
    // Filter based on role
    if (role === 'Individual') {
        filteredLeaves = leaveApps.filter(l => l.applicantEmail === userEmail);
    } else if (role === 'HOD') {
        filteredLeaves = leaveApps.filter(l => 
            l.applicantDepartment === department || l.applicantEmail === userEmail
        );
    } else if (role === 'Principal' || role === 'Admin') {
        filteredLeaves = leaveApps; // All leaves
    }
    
    // Filter by academic year
    filteredLeaves = filteredLeaves.filter(leave => {
        const leaveDate = new Date(leave.fromDate);
        return leaveDate >= ayStart && leaveDate <= ayEnd;
    });
    
    // Calculate summary by leave type
    const summary = {
        CL: { applied: 0, approved: 0, pending: 0, rejected: 0 },
        SL: { applied: 0, approved: 0, pending: 0, rejected: 0 },
        OD: { applied: 0, approved: 0, pending: 0, rejected: 0 },
        CO: { applied: 0, approved: 0, pending: 0, rejected: 0 },
        LWP: { applied: 0, approved: 0, pending: 0, rejected: 0 }
    };
    
    filteredLeaves.forEach(leave => {
        if (summary[leave.leaveType]) {
            summary[leave.leaveType].applied += leave.days;
            if (leave.status === 'approved') {
                summary[leave.leaveType].approved += leave.days;
            } else if (leave.status === 'pending') {
                summary[leave.leaveType].pending += leave.days;
            } else if (leave.status === 'rejected') {
                summary[leave.leaveType].rejected += leave.days;
            }
        }
    });
    
    return {
        academicYear: currentAY,
        leaves: filteredLeaves,
        summary: summary
    };
}

// Update leave balance after approval
function updateLeaveBalanceAfterApproval(user, leaveType, days) {
    if (!user.leaveBalance) user = initializeLeaveBalance(user);
    
    // Move from pending to used
    user.leavePending[leaveType] = Math.max(0, (user.leavePending[leaveType] || 0) - days);
    user.leaveUsed[leaveType] = (user.leaveUsed[leaveType] || 0) + days;
    
    return user;
}

// Update leave balance after rejection
function updateLeaveBalanceAfterRejection(user, leaveType, days) {
    if (!user.leaveBalance) user = initializeLeaveBalance(user);
    
    // Remove from pending
    user.leavePending[leaveType] = Math.max(0, (user.leavePending[leaveType] || 0) - days);
    
    return user;
}

// Reserve leave balance when application is submitted
function reserveLeaveBalance(user, leaveType, days) {
    if (!user.leaveBalance) user = initializeLeaveBalance(user);
    
    // Add to pending
    user.leavePending[leaveType] = (user.leavePending[leaveType] || 0) + days;
    
    return user;
}
