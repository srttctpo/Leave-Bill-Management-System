// LEAVE MANAGEMENT SYSTEM
// Complete leave application, approval, rejection, and history tracking

// Initialize leave applications storage
function initLeaveStorage() {
    if (!localStorage.getItem('lbs-leave-applications')) {
        localStorage.setItem('lbs-leave-applications', JSON.stringify([]));
    }
}

// Get all leave applications
function getLeaveApplications() {
    return JSON.parse(localStorage.getItem('lbs-leave-applications')) || [];
}

// Save leave applications
function saveLeaveApplications(apps) {
    localStorage.setItem('lbs-leave-applications', JSON.stringify(apps));
}

// LEAVE APPLICATION FORM
function applyLeave() {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    if (!currentUser) { alert('Please login first!'); return; }
    
    let approvalSection = document.getElementById('approval-section');
    let html = '<div class="approval-container"><h3>📝 Apply for Leave</h3>';
    html += '<form id="leaveApplicationForm" style="max-width: 600px; margin: 20px auto;">';
    html += '<div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">Leave Type:</label>';
    html += '<select id="leaveType" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">';
    html += '<option value="">Select Leave Type</option><option value="CL">Casual Leave (CL)</option>';
    html += '<option value="OD">On Duty (OD)</option><option value="CO">Compensatory Off (CO)</option>';
    html += '<option value="SL">Sick Leave (SL)</option><option value="LWP">Leave Without Pay (LWP)</option></select></div>';
    html += '<div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">From Date:</label>';
    html += '<input type="date" id="leaveFromDate" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;"></div>';
    html += '<div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">To Date:</label>';
    html += '<input type="date" id="leaveToDate" required style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;"></div>';
    html += '<div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: bold;">Reason:</label>';
    html += '<textarea id="leaveReason" required rows="4" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px;"></textarea></div>';
    html += '<div style="color: #64748b; font-size: 14px; margin-bottom: 15px; padding: 10px; background: #f1f5f9; border-radius: 8px;">';
    html += '<strong>Your Leave Balance:</strong><br>';
    if (!currentUser.leaveBalance) currentUser.leaveBalance = {CL:0,OD:0,CO:0,SL:0,LWP:0};
    html += 'CL: ' + currentUser.leaveBalance.CL + ' | OD: ' + currentUser.leaveBalance.OD + ' | ';
    html += 'CO: ' + currentUser.leaveBalance.CO + ' | SL: ' + currentUser.leaveBalance.SL + ' | LWP: ' + currentUser.leaveBalance.LWP + '</div>';
    html += '<div style="display: flex; gap: 10px;"><button type="submit" class="approve-btn" style="flex: 1;">✅ Submit Application</button>';
    html += '<button type="button" class="reject-btn" style="flex: 1;" onclick="showDashboard(JSON.parse(localStorage.getItem(\'lbs-current-user\')))"❌ Cancel</button></div></form></div>';
    approvalSection.innerHTML = html;
    document.getElementById('leaveApplicationForm').onsubmit = function(e) { e.preventDefault(); submitLeaveApplication(); };
}

// SUBMIT LEAVE APPLICATION
function submitLeaveApplication() {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    let leaveType = document.getElementById('leaveType').value;
    let fromDate = document.getElementById('leaveFromDate').value;
    let toDate = document.getElementById('leaveToDate').value;
    let reason = document.getElementById('leaveReason').value;
    if (!leaveType || !fromDate || !toDate || !reason) { alert('Please fill all fields!'); return; }
    let from = new Date(fromDate);
    let to = new Date(toDate);
    let days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    if (days <= 0) { alert('To Date must be after From Date!'); return; }
    if (!currentUser.leaveBalance) currentUser.leaveBalance = {CL:0,OD:0,CO:0,SL:0,LWP:0};
    let leaveApps = getLeaveApplications();
    let pendingDays = leaveApps.filter(l => l.applicantEmail === currentUser.email && l.status === 'pending' && l.leaveType === leaveType).reduce((sum, l) => sum + l.days, 0);
    let availableBalance = currentUser.leaveBalance[leaveType] - pendingDays;
    if (leaveType !== 'LWP' && availableBalance < days) {
        alert('Insufficient ' + leaveType + ' balance! Available: ' + availableBalance + ' days (after pending applications).');
        return;
    }
    let month = from.getMonth();
    let year = from.getFullYear();
    let monthLeaves = leaveApps.filter(l => {
        let lDate = new Date(l.fromDate);
        return l.applicantEmail === currentUser.email && l.status !== 'rejected' && lDate.getMonth() === month && lDate.getFullYear() === year;
    });
    let totalDaysInMonth = monthLeaves.reduce((sum, l) => sum + l.days, 0);
    let finalLeaveType = leaveType;
    if (totalDaysInMonth + days > 3 && leaveType !== 'LWP' && leaveType !== 'OD' && leaveType !== 'CO') {
        if (!confirm('You are applying for more than 3 days in this month. Excess days will be marked as LWP. Continue?')) return;
        finalLeaveType = 'LWP';
    }
    let approver = '';
    let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
    if (currentUser.role === 'Individual') {
        let hod = allUsers.find(u => u.role === 'HOD' && u.department === currentUser.department && u.status === 'approved');
        if (hod) approver = hod.email; else { alert('No HOD found for your department.'); return; }
    } else if (currentUser.role === 'HOD') {
        let principal = allUsers.find(u => u.role === 'Principal' && u.status === 'approved');
        if (principal) approver = principal.email; else { alert('No Principal found.'); return; }
    } else if (currentUser.role === 'Principal') {
        let admin = allUsers.find(u => u.role === 'Admin' && u.status === 'approved');
        if (admin) approver = admin.email; else { alert('No Admin found.'); return; }
    }
    let leaveApp = {
        id: 'LV' + Date.now(),
        applicantEmail: currentUser.email,
        applicantName: currentUser.name,
        applicantRole: currentUser.role,
        applicantDepartment: currentUser.department,
        leaveType: finalLeaveType,
        fromDate: fromDate,
        toDate: toDate,
        days: days,
        reason: reason,
        status: 'pending',
        approver: approver,
        approverName: '',
        appliedOn: new Date().toISOString(),
        comments: [],
        approvedBy: []
    };
    leaveApps.push(leaveApp);
    saveLeaveApplications(leaveApps);
    alert('Leave application submitted! ID: ' + leaveApp.id);
    showDashboard(currentUser);
}

// APPROVE LEAVE
function approveLeave(leaveId) {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    let leaveApps = getLeaveApplications();
    let leaveIndex = leaveApps.findIndex(l => l.id === leaveId);
    if (leaveIndex === -1) { alert('Leave application not found!'); return; }
    let leave = leaveApps[leaveIndex];
    if (leave.approver !== currentUser.email) { alert('You are not authorized to approve this!'); return; }
    leave.status = 'approved';
    leave.approverName = currentUser.name;
    leave.approvedBy.push({name: currentUser.name, role: currentUser.role, date: new Date().toISOString()});
    let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
    let applicantIndex = allUsers.findIndex(u => u.email === leave.applicantEmail);
    if (applicantIndex !== -1) {
        if (!allUsers[applicantIndex].leaveBalance) allUsers[applicantIndex].leaveBalance = {CL:0,OD:0,CO:0,SL:0,LWP:0};
        allUsers[applicantIndex].leaveBalance[leave.leaveType] -= leave.days;
        localStorage.setItem('lbs-users', JSON.stringify(allUsers));
        users = allUsers;
        if (leave.applicantEmail === currentUser.email) {
            let cu = allUsers[applicantIndex];
            localStorage.setItem('lbs-current-user', JSON.stringify(cu));
        }
    }
    saveLeaveApplications(leaveApps);
    alert('Leave approved! Balance deducted.');
    showLeaveApprovals();
}

// REJECT LEAVE
function rejectLeave(leaveId) {
    if (!confirm('Are you sure you want to reject this leave application?')) return;
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    let comment = prompt('Enter reason for rejection:');
    if (!comment) return;
    let leaveApps = getLeaveApplications();
    let leaveIndex = leaveApps.findIndex(l => l.id === leaveId);
    if (leaveIndex === -1) { alert('Leave application not found!'); return; }
    let leave = leaveApps[leaveIndex];
    if (leave.approver !== currentUser.email) { alert('You are not authorized to reject this!'); return; }
    leave.status = 'rejected';
    leave.comments.push({by: currentUser.name, text: comment, date: new Date().toISOString(), type: 'rejection'});
    saveLeaveApplications(leaveApps);
    alert('Leave application rejected.');
    showLeaveApprovals();
}

// RETURN LEAVE FOR CORRECTION
function returnLeave(leaveId) {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    let comment = prompt('Enter comments for correction:');
    if (!comment) return;
    let leaveApps = getLeaveApplications();
    let leaveIndex = leaveApps.findIndex(l => l.id === leaveId);
    if (leaveIndex === -1) { alert('Leave application not found!'); return; }
    let leave = leaveApps[leaveIndex];
    if (leave.approver !== currentUser.email) { alert('You are not authorized!'); return; }
    leave.status = 'returned';
    leave.comments.push({by: currentUser.name, text: comment, date: new Date().toISOString(), type: 'return'});
    saveLeaveApplications(leaveApps);
    alert('Leave returned for correction.');
    showLeaveApprovals();
}

// SHOW LEAVE APPROVALS
function showLeaveApprovals() {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    let leaveApps = getLeaveApplications();
    let pendingLeaves = leaveApps.filter(l => l.status === 'pending' && l.approver === currentUser.email);
    let approvalSection = document.getElementById('approval-section');
    if (pendingLeaves.length === 0) {
        approvalSection.innerHTML = '<div class="approval-container"><h3>⏳ Pending Leave Approvals</h3><p>No pending leave approvals.</p></div>';
        return;
    }
    let html = '<div class="approval-container"><h3>⏳ Pending Leave Approvals (' + pendingLeaves.length + ')</h3>';
    html += '<div class="approval-list">';
    pendingLeaves.forEach(leave => {
        html += '<div class="approval-card"><div class="approval-info">';
        html += '<h4>' + leave.applicantName + ' <span style="background:#3b82f6;color:white;padding:2px 8px;border-radius:4px;font-size:0.8em;">' + leave.leaveType + '</span></h4>';
        html += '<p><strong>ID:</strong> ' + leave.id + '</p>';
        html += '<p><strong>Department:</strong> ' + leave.applicantDepartment + ' | <strong>Role:</strong> ' + leave.applicantRole + '</p>';
        html += '<p><strong>Duration:</strong> ' + leave.fromDate + ' to ' + leave.toDate + ' (' + leave.days + ' days)</p>';
        html += '<p><strong>Reason:</strong> ' + leave.reason + '</p>';
        html += '<p><strong>Applied On:</strong> ' + new Date(leave.appliedOn).toLocaleString() + '</p>';
        html += '</div><div class="approval-actions" style="flex-direction:column;gap:8px;">';
        html += '<button class="approve-btn" onclick="approveLeave(\'' + leave.id + '\')" style="padding:8px 16px;">✅ Approve</button>';
        html += '<button class="reject-btn" onclick="rejectLeave(\'' + leave.id + '\')" style="padding:8px 16px;">❌ Reject</button>';
        html += '<button class="action-btn" onclick="returnLeave(\'' + leave.id + '\')" style="background:#f59e0b;padding:8px 16px;">↩ Return for Correction</button>';
        html += '</div></div>';
    });
    html += '</div></div>';
    approvalSection.innerHTML = html;
}

// SHOW LEAVE HISTORY
function showLeaveHistory() {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    let leaveApps = getLeaveApplications();
    let myLeaves = [];
    if (currentUser.role === 'Individual') {
        myLeaves = leaveApps.filter(l => l.applicantEmail === currentUser.email);
    } else if (currentUser.role === 'HOD') {
        myLeaves = leaveApps.filter(l => l.applicantDepartment === currentUser.department || l.applicantEmail === currentUser.email);
    } else if (currentUser.role === 'Principal' || currentUser.role === 'Admin') {
        myLeaves = leaveApps;
    }
    let approvalSection = document.getElementById('approval-section');
    if (myLeaves.length === 0) {
        approvalSection.innerHTML = '<div class="approval-container"><h3>📊 Leave History</h3><p>No leave records found.</p></div>';
        return;
    }
    let html = '<div class="approval-container"><h3>📊 Leave History (' + myLeaves.length + ' records)</h3>';
    html += '<div class="approval-list">';
    myLeaves.sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)).forEach(leave => {
        let statusColor = leave.status === 'approved' ? '#10b981' : leave.status === 'rejected' ? '#ef4444' : leave.status === 'returned' ? '#f59e0b' : '#6b7280';
        html += '<div class="approval-card"><div class="approval-info">';
        html += '<h4>' + leave.applicantName + ' <span style="background:' + statusColor + ';color:white;padding:2px 8px;border-radius:4px;font-size:0.8em;">' + leave.status.toUpperCase() + '</span></h4>';
        html += '<p><strong>ID:</strong> ' + leave.id + ' | <strong>Type:</strong> ' + leave.leaveType + '</p>';
        html += '<p><strong>Department:</strong> ' + leave.applicantDepartment + ' | <strong>Role:</strong> ' + leave.applicantRole + '</p>';
        html += '<p><strong>Duration:</strong> ' + leave.fromDate + ' to ' + leave.toDate + ' (' + leave.days + ' days)</p>';
        html += '<p><strong>Reason:</strong> ' + leave.reason + '</p>';
        html += '<p><strong>Applied On:</strong> ' + new Date(leave.appliedOn).toLocaleString() + '</p>';
        if (leave.approverName) html += '<p><strong>Approver:</strong> ' + leave.approverName + '</p>';
        if (leave.comments.length > 0) {
            html += '<div style="margin-top:10px;padding:10px;background:#f1f5f9;border-radius:4px;"><strong>Comments:</strong>';
            leave.comments.forEach(c => {
                html += '<p style="margin:5px 0;font-size:13px;"><strong>' + c.by + ':</strong> ' + c.text + ' <em>(' + new Date(c.date).toLocaleString() + ')</em></p>';
            });
            html += '</div>';
        }
        html += '</div>';
        if (currentUser.role === 'Admin' && leave.status === 'approved') {
            html += '<div class="approval-actions"><button class="action-btn" onclick="editLeaveAdmin(\'' + leave.id + '\')" style="background:#3b82f6;padding:8px;">✏ Admin Edit</button></div>';
        }
        html += '</div>';
    });
    html += '</div></div>';
    approvalSection.innerHTML = html;
}

// ADMIN EDIT LEAVE
function editLeaveAdmin(leaveId) {
    let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    if (currentUser.role !== 'Admin') { alert('Only Admin can edit approved leaves!'); return; }
    let leaveApps = getLeaveApplications();
    let leaveIndex = leaveApps.findIndex(l => l.id === leaveId);
    if (leaveIndex === -1) { alert('Leave not found!'); return; }
    let leave = leaveApps[leaveIndex];
    let newFromDate = prompt('Edit From Date (current: ' + leave.fromDate + '):', leave.fromDate);
    if (!newFromDate) return;
    let newToDate = prompt('Edit To Date (current: ' + leave.toDate + '):', leave.toDate);
    if (!newToDate) return;
    let from = new Date(newFromDate);
    let to = new Date(newToDate);
    let newDays = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    if (newDays <= 0) { alert('Invalid dates!'); return; }
    let oldDays = leave.days;
    let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
    let userIndex = allUsers.findIndex(u => u.email === leave.applicantEmail);
    if (userIndex !== -1) {
        if (!allUsers[userIndex].leaveBalance) allUsers[userIndex].leaveBalance = {CL:0,OD:0,CO:0,SL:0,LWP:0};
        allUsers[userIndex].leaveBalance[leave.leaveType] += oldDays;
        allUsers[userIndex].leaveBalance[leave.leaveType] -= newDays;
        localStorage.setItem('lbs-users', JSON.stringify(allUsers));
        users = allUsers;
    }
    leave.fromDate = newFromDate;
    leave.toDate = newToDate;
    leave.days = newDays;
    leave.comments.push({by: currentUser.name, text: 'Admin edited leave dates', date: new Date().toISOString(), type: 'admin_edit'});
    saveLeaveApplications(leaveApps);
    alert('Leave updated by Admin!');
    showLeaveHistory();
}

// Initialize on load
initLeaveStorage();
