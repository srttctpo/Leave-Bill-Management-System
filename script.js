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

// Tab switching
document.getElementById('login-tab').onclick = function() {
  document.getElementById('login-tab').classList.add('active');
  document.getElementById('register-tab').classList.remove('active');
  document.getElementById('login-form').classList.add('active');
  document.getElementById('register-form').classList.remove('active');
};

document.getElementById('register-tab').onclick = function() {
  document.getElementById('register-tab').classList.add('active');
  document.getElementById('login-tab').classList.remove('active');
  document.getElementById('register-form').classList.add('active');
  document.getElementById('login-form').classList.remove('active');
};

// Login
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  let email = document.getElementById('login-email').value.trim();
  let pass = document.getElementById('login-password').value.trim();
  let user = users.find(u => u.email === email && u.pass === pass && u.status === 'approved');
  let errElem = document.getElementById('login-error');
  
  if (!user) {
    errElem.textContent = 'Invalid credentials or account not approved!';
    return;
  }
  
  localStorage.setItem('lbs-current-user', JSON.stringify(user));
  errElem.textContent = '';
  showDashboard(user);
};

// Register
document.getElementById('registerForm').onsubmit = function(e) {
  e.preventDefault();
  let name = document.getElementById('reg-name').value.trim();
  let email = document.getElementById('reg-email').value.trim();
  let department = document.getElementById('reg-dept').value;
  let join = document.getElementById('reg-join').value;
  let role = document.getElementById('reg-role').value;
  let pass = document.getElementById('reg-pass').value.trim();
  let cpass = document.getElementById('reg-cpass').value.trim();
  let errElem = document.getElementById('register-error');
  let succElem = document.getElementById('register-success');
  
  errElem.textContent = '';
  succElem.textContent = '';
  
  if (!name || !email || !department || !join || !role || !pass || !cpass) {
    errElem.textContent = 'All fields are required.';
    return;
  }
  if (pass !== cpass) {
    errElem.textContent = 'Passwords do not match!';
    return;
  }
  if (users.some(u => u.email === email)) {
    errElem.textContent = 'Email already registered!';
    return;
  }
    
  // Check if department already has a HOD
  if (role === 'HOD') {
    let existingHOD = users.find(u => u.role === 'HOD' && u.department === department && u.status === 'approved');
    if (existingHOD) {
      errElem.textContent = 'This department already has a HOD: ' + existingHOD.name + '. Each department can have only one HOD.';
      return;
    }
    // Also check pending HOD registrations
    let pendingHOD = users.find(u => u.role === 'HOD' && u.department === department && u.status === 'pending');
    if (pendingHOD) {
      errElem.textContent = 'A HOD registration for this department is already pending approval.';
      return;
    }
  }
  
  users.push({ email, pass, role, department, name, joinDate:join, status:'pending' });
  localStorage.setItem('lbs-users', JSON.stringify(users));
  succElem.textContent = 'Registered successfully! Awaiting approval.';
  setTimeout(() => succElem.textContent = '', 4000);
  document.getElementById('registerForm').reset();
};

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
    html += '<button class="action-btn" onclick="alert(\'Feature: Apply for Leave\\nComing Soon!\');">🏖️ Apply Leave</button>';
  }
  html += '<button class="action-btn" onclick="alert(\'Feature: View History\\nComing Soon!\');">📊 View History</button>';
  if (user.role === 'Admin' || user.role === 'Principal' || user.role === 'HOD') {
    html += '<button class="action-btn" onclick="showApprovals()">⏳ Pending Approvals</button>';
      if (user.role === 'Admin') {
    html += '<button class="action-btn" onclick="manageUsers()">👥 Manage All Users</button>';
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
  
  let approvalSection = document.getElementById('approval-section');
  
  if (pendingUsers.length === 0) {
    approvalSection.innerHTML = '<div class="approval-container"><h3>⏳ Pending Approvals</h3><p>No pending approvals at this time.</p></div>';
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
function logout() {
  localStorage.removeItem('lbs-current-user');
  window.location.reload();
}

// Auto-login if session exists
window.onload = function() {
  let u = localStorage.getItem('lbs-current-user');
  if (u) showDashboard(JSON.parse(u));
};
