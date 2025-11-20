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

    
	// Initialize leave balances for all employees
	const users = JSON.parse(localStorage.getItem('lbs-users')) || [];
	users.forEach(user => {
		if (!user.leaveBalance) {
			user.leaveBalance = { CL: 12, SL: 8, OD: 4, CO: 2, LWP: 0 };
			user.leaveUsed = { CL: 0, SL: 0, OD: 0, CO: 0, LWP: 0 };
			user.leavePending = { CL: 0, SL: 0, OD: 0, CO: 0, LWP: 0 };
		}
	});
	localStorage.setItem('lbs-users', JSON.stringify(users));

	// Initialize sample leave applications
	const existingLeaves = localStorage.getItem('lbs-leave-applications');
	if (!existingLeaves || JSON.parse(existingLeaves).length === 0) {
		const sampleLeaves = [
			{ applicantEmail: 'admin@system.com', applicantName: 'System Administrator', applicantDepartment: 'Admin', leaveType: 'CL', fromDate: '2025-11-25', toDate: '2025-11-26', days: 2, reason: 'Personal work', status: 'approved', appliedOn: '2025-11-10', approvedOn: '2025-11-11' },
			{ applicantEmail: 'principal@system.com', applicantName: 'College Principal', applicantDepartment: 'Management', leaveType: 'SL', fromDate: '2025-12-05', toDate: '2025-12-05', days: 1, reason: 'Medical check-up', status: 'pending', appliedOn: '2025-11-15', approvedOn: null },
			{ applicantEmail: 'comp_hod@system.com', applicantName: 'HOD Computer Science', applicantDepartment: 'Computer', leaveType: 'CL', fromDate: '2025-12-10', toDate: '2025-12-12', days: 3, reason: 'Family visit', status: 'approved', appliedOn: '2025-11-08', approvedOn: '2025-11-09' },
			{ applicantEmail: 'acc_hod@system.com', applicantName: 'HOD Accounts', applicantDepartment: 'Accounts', leaveType: 'OD', fromDate: '2025-12-15', toDate: '2025-12-15', days: 1, reason: 'College event', status: 'approved', appliedOn: '2025-11-10', approvedOn: '2025-11-10' },
			{ applicantEmail: 'emp_comp@system.com', applicantName: 'Employee Computer Department', applicantDepartment: 'Computer', leaveType: 'CL', fromDate: '2025-11-28', toDate: '2025-11-30', days: 3, reason: 'Vacation', status: 'pending', appliedOn: '2025-11-14', approvedOn: null },
			{ applicantEmail: 'tpo@system.com', applicantName: 'Training & Placement Officer', applicantDepartment: 'Training & Placement', leaveType: 'SL', fromDate: '2025-12-01', toDate: '2025-12-03', days: 3, reason: 'Not well', status: 'approved', appliedOn: '2025-11-12', approvedOn: '2025-11-13' }
		];
		localStorage.setItem('lbs-leave-applications', JSON.stringify(sampleLeaves));
		console.log('Sample leave applications created!');
	}
})();
