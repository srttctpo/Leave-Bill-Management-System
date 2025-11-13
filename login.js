// LOGIN.JS - Authentication and Registration Module
// Handles login, registration, and tab switching functionality

// Wait for DOM to be fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', function() {
    
    // Tab switching functionality
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerFormContainer = document.getElementById('register-form');
    
    if (loginTab) {
        loginTab.onclick = function() {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerFormContainer.classList.remove('active');
        };
    }
    
    if (registerTab) {
        registerTab.onclick = function() {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerFormContainer.classList.add('active');
            loginForm.classList.remove('active');
        };
    }
    
    // Login form submission
    const loginFormElement = document.getElementById('loginForm');
    if (loginFormElement) {
        loginFormElement.onsubmit = function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const pass = document.getElementById('login-password').value.trim();
            const users = JSON.parse(localStorage.getItem('lbs-users')) || [];
            const user = users.find(u => u.email === email && u.pass === pass && u.status === 'approved');
            
            if (!user) {
                Dialog.show(STRINGS.NOTIFICATIONS.LOGIN_ERROR_TITLE, STRINGS.ERRORS.INVALID_CREDENTIALS, 'error');
                return;
            }
            
            localStorage.setItem('lbs-current-user', JSON.stringify(user));
            
            // Redirect to landing page
            window.location.href = 'landing.html';
        };
    }
    
    // Register form submission
    const registerFormElement = document.getElementById('registerForm');
    if (registerFormElement) {
        registerFormElement.onsubmit = function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const department = document.getElementById('reg-dept').value;
            const join = document.getElementById('reg-join').value;
            const role = document.getElementById('reg-role').value;
            const pass = document.getElementById('reg-pass').value.trim();
            const cpass = document.getElementById('reg-cpass').value.trim();
            const errElem = document.getElementById('register-error');
            const succElem = document.getElementById('register-success');
            
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
            
            const users = JSON.parse(localStorage.getItem('lbs-users')) || [];
            
            if (users.some(u => u.email === email)) {
                errElem.textContent = 'Email already registered!';
                return;
            }
            
            // Check if department already has a HOD
            if (role === 'HOD') {
                const existingHOD = users.find(u => u.role === 'HOD' && u.department === department && u.status === 'approved');
                if (existingHOD) {
                    errElem.textContent = 'This department already has a HOD: ' + existingHOD.name + '. Each department can have only one HOD.';
                    return;
                }
                
                const pendingHOD = users.find(u => u.role === 'HOD' && u.department === department && u.status === 'pending');
                if (pendingHOD) {
                    errElem.textContent = 'A HOD registration for this department is already pending approval.';
                    return;
                }
            }
            
            users.push({
                email,
                pass,
                role,
                department,
                name,
                joinDate: join,
                status: 'pending'
            });
            
            localStorage.setItem('lbs-users', JSON.stringify(users));
            succElem.textContent = 'Registered successfully! Awaiting approval.';
            setTimeout(() => succElem.textContent = '', 4000);
            registerFormElement.reset();
        };
    }
    
    // Auto-login if session exists
    const currentUser = localStorage.getItem('lbs-current-user');
    if (currentUser && typeof showDashboard === 'function') {
        showDashboard(JSON.parse(currentUser));
    }
});    
