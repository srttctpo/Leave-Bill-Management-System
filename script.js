// Initialize default users
let users = JSON.parse(localStorage.getItem('lbs-users')) || [
  {email:'admin@system.com',pass:'Admin@123',role:'Admin',department:'Administration',name:'System Administrator',status:'approved',joinDate:'2024-01-01'},
  {email:'principal@system.com',pass:'Principal@123',role:'Principal',department:'Administration',name:'Dr. Principal',status:'approved',joinDate:'2024-01-01'},
  {email:'comp_hod@system.com',pass:'HOD@123',role:'HOD',department:'Computer',name:'Prof. Computer HOD',status:'approved',joinDate:'2024-01-01'},
  {email:'acc_hod@system.com',pass:'HOD@123',role:'HOD',department:'Accounts',name:'Prof. Accounts HOD',status:'approved',joinDate:'2024-01-01'},
  {email:'emp_comp@system.com',pass:'Emp@123',role:'Individual',department:'Computer',name:'John Employee',status:'approved',joinDate:'2024-01-01'},
  {email:'tpo@system.com',pass:'TPO@123',role:'Individual',department:'TPO',name:'TPO Officer',status:'approved',joinDate:'2024-01-01'}
];
localStorage.setItem('lbs-users', JSON.stringify(users));

// NOTE: Login and Registration logic has been moved to login.js
// This file contains only dashboard and management functions


// Show Dashboard
function showDashboard(user) {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'none';
  document.querySelector('.tab-nav').style.display = 'none';
  document.querySelector('.header').style.display = 'none';
  
  let dash = document.getElementById('dashboard-container');
  dash.style.display = 'block';
  
  let html = '<div class="dashboard-header">';
  html += '<div><h2>Welcome, ' + (user.name || user.email) + '</h2>';
  html += '<p>Role: <strong>' + user.role + '</strong> | Department: <strong>' + (user.department || 'N/A') + '</strong></p></div>';
  html += '<button class="logout-btn" onclick="logout()">Logout</button>';
  html += '</div>';
  
  html += '<div class="dashboard-grid">';
  html += '<div class="dashboard-card"><h3>📋 Role</h3><p>' + user.role + '</p></div>';
  html += '<div class="dashboard-card"><h3>🏢 Department</h3><p>' + (user.department || 'N/A') + '</p></div>';
  html += '<div class="dashboard-card"><h3>✅ Status</h3><p>' + user.status.toUpperCase() + '</p></div>';
  html += '</div>';
  
  html += '<div class="action-buttons">';
  if (user.role !== 'Admin') {
    html += '<button class="action-btn" onclick="alert(\'Feature: Raise a Bill\\nComing Soon!\');">📄 Raise Bill</button>';
            html += '<button class="action-btn" onclick="applyLeave()">🏝️ Apply Leave</button>';
        html += '<button class="action-btn" onclick="showLeaveHistory()">📊 Leave History</button>';
  }
  html += '<button class="action-btn" onclick="alert(\'Feature: View History\\nComing Soon!\');">📊 View History</button>';
  if (user.role === 'Admin' || user.role === 'Principal' || user.role === 'HOD') {
    html += '<button class="action-btn" onclick="showApprovals()">⏳ Pending Approvals</button>';
      if (user.role === 'Admin') {
    html += '<button class="action-btn" onclick="manageUsers()">👥 Manage All Users</button>';
            html += '<button class="action-btn" onclick="manageLeaveBalances()">📊 Manage Leave Balances</button>';
  }
  }
  html += '</div>';
  
  html += '<div id="approval-section"></div>';
  
  html += '<h3>System Features</h3>';
  html += '<ul style="padding-left:20px; color:#475569;">';
  html += '<li>✅ User Registration with Approval Workflow</li>';
  html += '<li>✅ Role-based Authentication (Admin, Principal, HOD, Individual)</li>';
  html += '<li>✅ Hierarchical Approval System (Individual→HOD, HOD→Principal, Principal→Admin)</li>';
  html += '<li>✅ 6 Default Test Accounts</li>';
  html += '<li>📋 Bill Management (Raise, Approve, Reject, Return) - Coming Soon</li>';
  html += '<li>🏖️ Leave Management (5 types: CL, OD, CO, SL, LWP) - Coming Soon</li>';
  html += '<li>📊 Reports and Analytics - Coming Soon</li>';
  html += '</ul>';
  
  dash.innerHTML = html;
}

function showApprovals() {
  let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let pendingUsers = [];
  
  // Filter users based on approval hierarchy
  if (currentUser.role === 'Admin') {
    // Admin approves Principals
    pendingUsers = allUsers.filter(u => u.status === 'pending' && u.role === 'Principal');
  } else if (currentUser.role === 'Principal') {
    // Principal approves HODs
    pendingUsers = allUsers.filter(u => u.status === 'pending' && u.role === 'HOD');
  } else if (currentUser.role === 'HOD') {
    // HOD approves Individuals in their department
    pendingUsers = allUsers.filter(u => u.status === 'pending' && u.role === 'Individual' && u.department === currentUser.department);
  }

      // Get pending leave approvals
    let leaveApps = getLeaveApplications();
    let pendingLeaves = leaveApps.filter(l => l.status === 'pending' && l.approver === currentUser.email);
  
  let approvalSection = document.getElementById('approval-section');
  
    if (pendingUsers.length === 0 && pendingLeaves.length === 0) {            approvalSection.innerHTML = '<div class="approval-container"><h3>⏳ Pending Approvals</h3><p>No pending user or leave approvals.</p></div>';
    return;
  }
  
  let html = '<div class="approval-container"><h3>⏳ Pending Approvals (' + pendingUsers.length + ')</h3>';
  html += '<div class="approval-list">';
  
  pendingUsers.forEach(user => {
    html += '<div class="approval-card">';
    html += '<div class="approval-info">';
    html += '<h4>' + user.name + '</h4>';
    html += '<p><strong>Email:</strong> ' + user.email + '</p>';
    html += '<p><strong>Department:</strong> ' + user.department + '</p>';
    html += '<p><strong>Role:</strong> ' + user.role + '</p>';
    html += '<p><strong>Join Date:</strong> ' + user.joinDate + '</p>';
    html += '</div>';
    html += '<div class="approval-actions">';
    html += '<button class="approve-btn" onclick="approveUser(\'' + user.email + '\')">✅ Approve</button>';
    html += '<button class="reject-btn" onclick="rejectUser(\'' + user.email + '\')">❌ Reject</button>';
    html += '</div>';
    html += '</div>';
  });

    
    pendingLeaves.forEach(leave => {
        html += '<div class="approval-card"><div class="approval-info">';
        html += '<h4>' + leave.applicantName + ' <span style="background:#f59e0b;color:white;padding:2px 8px;border-radius:4px;font-size:0.8em;">LEAVE: ' + leave.leaveType + '</span></h4>';
        html += '<p><strong>ID:</strong> ' + leave.id + '</p>';
        html += '<p><strong>Department:</strong> ' + leave.applicantDepartment + ' | <strong>Role:</strong> ' + leave.applicantRole + '</p>';
        html += '<p><strong>Duration:</strong> ' + leave.fromDate + ' to ' + leave.toDate + ' (' + leave.days + ' days)</p>';
        html += '<p><strong>Reason:</strong> ' + leave.reason + '</p>';
        html += '</div><div class="approval-actions" style="flex-direction:column;gap:8px;">';
        html += '<button class="approve-btn" onclick="approveLeave(\'' + leave.id + '\')" style="padding:8px;">✅ Approve</button>';
        html += '<button class="reject-btn" onclick="rejectLeave(\'' + leave.id + '\')" style="padding:8px;">❌ Reject</button>';
        html += '<button class="action-btn" onclick="returnLeave(\'' + leave.id + '\')" style="background:#f59e0b;padding:8px;">↩ Return</button>';
        html += '</div></div>';
    });
  
  html += '</div></div>';
  approvalSection.innerHTML = html;
}

function approveUser(email) {
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let userIndex = allUsers.findIndex(u => u.email === email);
  
  if (userIndex !== -1) {
    allUsers[userIndex].status = 'approved';
    localStorage.setItem('lbs-users', JSON.stringify(allUsers));
    users = allUsers; // Update global users array
    alert('User ' + allUsers[userIndex].name + ' has been approved!');
    showApprovals(); // Refresh the approval list
  }
}

function rejectUser(email) {
  if (!confirm('Are you sure you want to reject this user registration?')) return;
  
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let userIndex = allUsers.findIndex(u => u.email === email);
  
  if (userIndex !== -1) {
    let userName = allUsers[userIndex].name;
    allUsers.splice(userIndex, 1); // Remove the user
    localStorage.setItem('lbs-users', JSON.stringify(allUsers));
    users = allUsers; // Update global users array
    alert('User ' + userName + ' registration has been rejected and removed.');
    showApprovals(); // Refresh the approval list
  }
}



// Admin: Manage all users
function manageUsers() {
  let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
  if (currentUser.role !== 'Admin') {
    alert('Only administrators can access user management.');
    return;
  }
  
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let managementSection = document.getElementById('approval-section');
  
  let html = '<div class="approval-container"><h3>👥 User Management (Admin Only)</h3>';
  html += '<p style="color: #64748b; margin-bottom: 20px;">As an administrator, you can view, edit, and delete any user account.</p>';
  html += '<div class="approval-list">';
  
  allUsers.forEach(u => {
    if (u.email === currentUser.email) return; // Don't show current admin
    
    html += '<div class="approval-card">';
    html += '<div class="approval-info">';
    html += '<h4>' + u.name + ' <span style="font-size:0.8em; color:' + (u.status === 'approved' ? '#10b981' : '#f59e0b') + ';">(' + u.status + ')</span></h4>';
    html += '<p><strong>Email:</strong> ' + u.email + '</p>';
    html += '<p><strong>Role:</strong> ' + u.role + '</p>';
    html += '<p><strong>Department:</strong> ' + u.department + '</p>';
    html += '<p><strong>Join Date:</strong> ' + u.joinDate + '</p>';
    html += '</div>';
    html += '<div class="approval-actions" style="flex-direction:column; gap:8px;">';
    html += '<button class="action-btn" style="background:#3b82f6; padding:8px 16px; font-size:13px;" onclick="editUser(\\'' + u.email + '\\')">✏️ Edit</button>';
    html += '<button class="reject-btn" style="padding:8px 16px; font-size:13px;" onclick="deleteUser(\\'' + u.email + '\\')">🗑️ Delete</button>';
    html += '</div>';
    html += '</div>';
  });
  
  html += '</div></div>';
  managementSection.innerHTML = html;
}

function editUser(email) {
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let user = allUsers.find(u => u.email === email);
  if (!user) return;
  
  let newRole = prompt('Change role for ' + user.name + ' (current: ' + user.role + ')\n\nEnter new role:\n- Individual\n- HOD\n- Principal\n- Admin', user.role);
  if (!newRole) return;
  
  if (!['Individual', 'HOD', 'Principal', 'Admin'].includes(newRole)) {
    alert('Invalid role! Must be: Individual, HOD, Principal, or Admin');
    return;
  }
  
  // Check HOD uniqueness if changing to HOD
  if (newRole === 'HOD') {
    let existingHOD = allUsers.find(u => u.role === 'HOD' && u.department === user.department && u.email !== email && u.status === 'approved');
    if (existingHOD) {
      alert('Cannot change role: ' + user.department + ' department already has a HOD: ' + existingHOD.name);
      return;
    }
  }
  
  let userIndex = allUsers.findIndex(u => u.email === email);
  allUsers[userIndex].role = newRole;
  
  let newStatus = prompt('Change status for ' + user.name + ' (current: ' + user.status + ')\n\nEnter new status:\n- pending\n- approved', allUsers[userIndex].status);
  if (newStatus && ['pending', 'approved'].includes(newStatus)) {
    allUsers[userIndex].status = newStatus;
  }
  
  localStorage.setItem('lbs-users', JSON.stringify(allUsers));
  users = allUsers;
  alert('User ' + user.name + ' has been updated!');
  manageUsers();
}

function deleteUser(email) {
  if (!confirm('Are you sure you want to permanently delete this user?\n\nThis action cannot be undone!')) return;
  
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let user = allUsers.find(u => u.email === email);
  if (!user) return;
  
  allUsers = allUsers.filter(u => u.email !== email);
  localStorage.setItem('lbs-users', JSON.stringify(allUsers));
  users = allUsers;
  alert('User ' + user.name + ' has been permanently deleted.');
  manageUsers();
}

// Admin: Manage Leave Balances
function manageLeaveBalances() {
  let currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
  if (currentUser.role !== 'Admin') {
    alert('Only administrators can manage leave balances.');
    return;
  }
  
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let managementSection = document.getElementById('approval-section');
  
  let html = '<div class="approval-container"><h3>📊 Leave Balance Management (Admin Only)</h3>';
  html += '<p style="color: #64748b; margin-bottom: 20px;">Manage leave balances for all users. Leave Types: CL (Casual Leave), OD (On Duty), CO (Compensatory Off), SL (Sick Leave), LWP (Leave Without Pay)</p>';
  html += '<div style="margin-bottom:20px;"><button class="approve-btn" onclick="bulkAllocateLeaves()">🔄 Bulk Allocate Standard Leaves</button></div>';
  html += '<div class="approval-list">';
  
  allUsers.forEach(u => {
    if (!u.leaveBalance) u.leaveBalance = {CL:0,OD:0,CO:0,SL:0,LWP:0};
    
    html += '<div class="approval-card">';
    html += '<div class="approval-info">';
    html += '<h4>' + u.name + '</h4>';
    html += '<p><strong>Email:</strong> ' + u.email + '</p>';
    html += '<p><strong>Role:</strong> ' + u.role + ' | <strong>Department:</strong> ' + u.department + '</p>';
    html += '<p style="margin-top:10px;"><strong>Leave Balances:</strong></p>';
    html += '<p>CL: <span style="color:#10b981; font-weight:bold;">' + u.leaveBalance.CL + '</span> | ';
    html += 'OD: <span style="color:#10b981; font-weight:bold;">' + u.leaveBalance.OD + '</span> | ';
    html += 'CO: <span style="color:#10b981; font-weight:bold;">' + u.leaveBalance.CO + '</span> | ';
    html += 'SL: <span style="color:#10b981; font-weight:bold;">' + u.leaveBalance.SL + '</span> | ';
    html += 'LWP: <span style="color:#10b981; font-weight:bold;">' + u.leaveBalance.LWP + '</span></p>';
    html += '</div>';
    html += '<div class="approval-actions" style="flex-direction:column; gap:8px;">';
    html += '<button class="action-btn" style="background:#3b82f6; padding:8px 16px; font-size:13px;" onclick="editUserLeave(\\'' + u.email + '\\')">✏️ Edit Leave Balance</button>';
    html += '</div>';
    html += '</div>';
  });
  
  html += '</div></div>';
  managementSection.innerHTML = html;
}

function editUserLeave(email) {
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  let user = allUsers.find(u => u.email === email);
  if (!user) return;
  
  if (!user.leaveBalance) user.leaveBalance = {CL:0,OD:0,CO:0,SL:0,LWP:0};
  
  let newCL = prompt('Edit leave balance for ' + user.name + '\n\nCasual Leave (CL) - Current: ' + user.leaveBalance.CL, user.leaveBalance.CL);
  if (newCL === null) return;
  
  let newOD = prompt('On Duty (OD) - Current: ' + user.leaveBalance.OD, user.leaveBalance.OD);
  if (newOD === null) return;
  
  let newCO = prompt('Compensatory Off (CO) - Current: ' + user.leaveBalance.CO, user.leaveBalance.CO);
  if (newCO === null) return;
  
  let newSL = prompt('Sick Leave (SL) - Current: ' + user.leaveBalance.SL, user.leaveBalance.SL);
  if (newSL === null) return;
  
  let newLWP = prompt('Leave Without Pay (LWP) - Current: ' + user.leaveBalance.LWP, user.leaveBalance.LWP);
  if (newLWP === null) return;
  
  let userIndex = allUsers.findIndex(u => u.email === email);
  allUsers[userIndex].leaveBalance = {
    CL: parseInt(newCL) || 0,
    OD: parseInt(newOD) || 0,
    CO: parseInt(newCO) || 0,
    SL: parseInt(newSL) || 0,
    LWP: parseInt(newLWP) || 0
  };
  
  localStorage.setItem('lbs-users', JSON.stringify(allUsers));
  users = allUsers;
  alert('Leave balance for ' + user.name + ' has been updated!');
  manageLeaveBalances();
}

function bulkAllocateLeaves() {
  if (!confirm('Allocate standard leaves to ALL users?\n\nCL: 12\nOD: 15\nCO: 10\nSL: 7\nLWP: 0\n\nThis will overwrite existing balances!')) return;
  
  let allUsers = JSON.parse(localStorage.getItem('lbs-users')) || [];
  
  allUsers.forEach(u => {
    if (u.role !== 'Admin') {
      u.leaveBalance = {CL:12, OD:15, CO:10, SL:7, LWP:0};
    } else {
      u.leaveBalance = {CL:0, OD:0, CO:0, SL:0, LWP:0};
    }
  });
  
  localStorage.setItem('lbs-users', JSON.stringify(allUsers));
  users = allUsers;
  alert('Standard leaves allocated to all users!');
  manageLeaveBalances();
}

function logout() {
  localStorage.removeItem('lbs-current-user');
  window.location.reload();
}

// Auto-login if session exists
window.onload = function() {
  let u = localStorage.getItem('lbs-current-user');
  if (u) showDashboard(JSON.parse(u));
};
