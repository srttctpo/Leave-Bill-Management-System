// Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    // Register form submission handler
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
        
        // Validation
        if (!name || !email || !department || !join || !role || !pass || !cpass) {
            errElem.textContent = 'All fields are required.';
            return;
        }
        
        if (pass !== cpass) {
            errElem.textContent = 'Passwords do not match!';
            return;
        }
        
        // Get existing users from localStorage
        let users = JSON.parse(localStorage.getItem('lbs-users')) || [];
        
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
        
        // Add new user
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
        
        document.getElementById('registerForm').reset();
    };
});
