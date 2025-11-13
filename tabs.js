// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login tab click handler
    document.getElementById('login-tab').onclick = function() {
        document.getElementById('login-tab').classList.add('active');
        document.getElementById('register-tab').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
    };

    // Register tab click handler
    document.getElementById('register-tab').onclick = function() {
        document.getElementById('register-tab').classList.add('active');
        document.getElementById('login-tab').classList.remove('active');
        document.getElementById('register-form').classList.add('active');
        document.getElementById('login-form').classList.remove('active');
    };
});
