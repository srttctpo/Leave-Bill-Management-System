// INIT.JS - Initialize Default Test Accounts
// This script creates the default test accounts shown on the login page
// Must be loaded before login.js

(function() {
    'use strict';
    
    // Check if users already exist
    const existingUsers = localStorage.getItem('lbs-users');
    
    // Only initialize if no users exist
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
        console.log('Initializing default test accounts...');
        
        const defaultUsers = [
            {
                email: 'admin@system.com',
                pass: 'Admin@123',
                role: 'Admin',
                department: 'Admin',
                name: 'System Administrator',
                joinDate: '2024-01-01',
                status: 'approved'
            },
            {
                email: 'principal@system.com',
                pass: 'Principal@123',
                role: 'Principal',
                department: 'Management',
                name: 'College Principal',
                joinDate: '2024-01-01',
                status: 'approved'
            },
            {
                email: 'comp_hod@system.com',
                pass: 'HOD@123',
                role: 'HOD',
                department: 'Computer',
                name: 'HOD Computer Science',
                joinDate: '2024-01-01',
                status: 'approved'
            },
            {
                email: 'acc_hod@system.com',
                pass: 'HOD@123',
                role: 'HOD',
                department: 'Accounts',
                name: 'HOD Accounts',
                joinDate: '2024-01-01',
                status: 'approved'
            },
            {
                email: 'emp_comp@system.com',
                pass: 'Emp@123',
                role: 'Employee',
                department: 'Computer',
                name: 'Employee Computer Department',
                joinDate: '2024-01-01',
                status: 'approved'
            },
            {
                email: 'tpo@system.com',
                pass: 'TPO@123',
                role: 'TPO',
                department: 'Training & Placement',
                name: 'Training & Placement Officer',
                joinDate: '2024-01-01',
                status: 'approved'
            }
        ];
        
        // Save to localStorage
        localStorage.setItem('lbs-users', JSON.stringify(defaultUsers));
        console.log('✓ Default test accounts created successfully!');
        console.log('✓ Total accounts:', defaultUsers.length);
    } else {
        console.log('Test accounts already exist. Skipping initialization.');
    }
})();
