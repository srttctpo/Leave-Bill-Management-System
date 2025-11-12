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
    
    users.push({ email, pass, role, department, name, joinDate:join, status:'pending' });
    localStorage.setItem('lbs-users', JSON.stringify(users));
    succElem.textContent = 'Registered successfully! Awaiting approval.';
    setTimeout(() => succElem.textContent = '', 4000);
    document.getElementById('registerForm').reset();
};

// Show Dashboard
function showDashboard(user) {
    document.getElementById('login-form').style.display = 'none';    let dash = document.getElementById('dashboard-container');
        document.getElementById('register-form').style.display = 'none';
        document.querySelector('.tab-nav').style.display = 'none';
        document.querySelector('.header').style.display = 'none';
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
        html += '<button class="action-btn" onclick="alert(\'Feature: Pending Approvals\\nComing Soon!\');">⏳ Pending Approvals</button>';
    }
    html += '</div>';
    
    html += '<h3>System Features</h3>';
    html += '<ul style="padding-left:20px; color:#475569;">';
    html += '<li>✅ User Registration with Approval Workflow</li>';
    html += '<li>✅ Role-based Authentication (Admin, Principal, HOD, Individual)</li>';
    html += '<li>✅ 6 Default Test Accounts</li>';
    html += '<li>📋 Bill Management (Raise, Approve, Reject, Return) - Coming Soon</li>';
    html += '<li>🏖️ Leave Management (5 types: CL, OD, CO, SL, LWP) - Coming Soon</li>';
    html += '<li>📊 Reports and Analytics - Coming Soon</li>';
    html += '</ul>';
    
    dash.innerHTML = html;
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
