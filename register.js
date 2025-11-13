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
        
        
        // Validation
        if (!name || !email || !department || !join || !role || !pass || !cpass) {
            Dialog.show(STRINGS.NOTIFICATIONS.REGISTRATION_ERROR_TITLE, STRINGS.ERRORS.ALL_FIELDS_REQUIRED, 'error');
            return;
        }
        
        if (pass !== cpass) {
            Dialog.show(STRINGS.NOTIFICATIONS.REGISTRATION_ERROR_TITLE, STRINGS.ERRORS.PASSWORD_MISMATCH, 'error');
            return;
        }
        
        // Get existing users from localStorage
        let users = JSON.parse(localStorage.getItem('lbs-users')) || [];
        
        if (users.some(u => u.email === email)) {
            Dialog.show(STRINGS.NOTIFICATIONS.REGISTRATION_ERROR_TITLE, STRINGS.ERRORS.EMAIL_ALREADY_REGISTERED, 'error');
            return;
        }
        
        // Check if department already has a HOD
        if (role === 'HOD') {
            let existingHOD = users.find(u => u.role === 'HOD' && u.department === department && u.status === 'approved');
            if (existingHOD) {
                Dialog.show(STRINGS.NOTIFICATIONS.REGISTRATION_ERROR_TITLE, STRINGS.ERRORS.DEPARTMENT_HAS_HOD.replace('{name}', existingHOD.name), 'error');
                return;
            }
            
            // Also check pending HOD registrations
            let pendingHOD = users.find(u => u.role === 'HOD' && u.department === department && u.status === 'pending');
            if (pendingHOD) {
            Dialog.show(STRINGS.NOTIFICATIONS.REGISTRATION_ERROR_TITLE, STRINGS.ERRORS.PENDING_HOD_APPROVAL, 'error');                return;
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
        
        // Show success notification with approval workflow
        Notifications.registrationSuccess(name, role, department);        
        document.getElementById('registerForm').reset();
    };
});
