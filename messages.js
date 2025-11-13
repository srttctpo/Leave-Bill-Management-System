// Centralized messages and text content for the application
// All text strings used across login and register pages

const MESSAGES = {
    // Common labels and buttons
    LABELS: {
        EMAIL: 'Email:',
        PASSWORD: 'Password:',
        CONFIRM_PASSWORD: 'Confirm Password:',
        FULL_NAME: 'Full Name:',
        DEPARTMENT: 'Department:',
        JOINING_DATE: 'Joining Date:',
        ROLE: 'Role:',
        PHOTO: 'Photo:'
    },
    
    // Buttons
    BUTTONS: {
        LOGIN: 'Login',
        REGISTER: 'Register',
        LOGOUT: 'Logout'
    },
    
    // College and Application Info
    APP_INFO: {
        COLLEGE_NAME: 'SRTTC',
        COLLEGE_FULL_NAME: 'Sundar Ramasamy Tulasiani Technical Campus',
        LOCATION: 'Khamshet',
        TAGLINE: 'Faculty of Engineering',
        APP_TITLE: 'Leave & Bill Management System',
        FULL_TITLE: 'SRTTC, Khamshet - Leave & Bill Management System'
    },

    // Headings
    HEADINGS: {
        LOGIN: 'Login',
        REGISTER: 'Register',
        TEST_ACCOUNTS: 'Test Accounts:'
    },
    
    // Placeholders
    PLACEHOLDERS: {
        EMAIL: 'admin@system.com',
        SELECT_DEPARTMENT: '--Select Department--',
        SELECT_ROLE: '--Select Role--',
        DATE_FORMAT: 'dd-mm-yyyy'
    },
    
    // Dropdown options
    OPTIONS: {
        DEPARTMENTS: [
            'Accounts',
            'Administration',
            'AIDS',
            'Computer',
            'CSEDS',
            'TPO'
        ],
        ROLES: [
            'Individual',
            'HOD',
            'Principal',
            'Admin'
        ]
    },
    
    // Test account information
    TEST_ACCOUNTS: [
        'Admin: admin@system.com / Admin@123',
        'Principal: principal@system.com / Principal@123',
        'HOD (Computer): comp_hod@system.com / HOD@123',
        'HOD (Accounts): acc_hod@system.com / HOD@123',
        'Employee (Computer): emp_comp@system.com / Emp@123',
        'TPO: tpo@system.com / TPO@123'
    ],
    
    // Success messages
    SUCCESS: {
        REGISTRATION_SUCCESS: 'Registered successfully! Awaiting approval.'
    },
    
    // Error messages (will be moved to errors.js but keeping references)
    ERRORS: {
        INVALID_CREDENTIALS: 'Invalid credentials or account not approved!',
        ALL_FIELDS_REQUIRED: 'All fields are required.',
        PASSWORD_MISMATCH: 'Passwords do not match!',
        EMAIL_ALREADY_REGISTERED: 'Email already registered!',
        DEPARTMENT_HAS_HOD: 'This department already has a HOD: {name}. Each department can have only one HOD.',
        PENDING_HOD_APPROVAL: 'A HOD registration for this department is already pending approval.'
    }

        // Landing page text
        LANDING_PAGE: {
            TITLE: 'Choose Your System',
                        LMS_LABEL: 'Leave Management System (LMS)',
                        LMS_DESCRIPTION: 'Manage leave requests, approvals, and balances',
                        BMS_LABEL: 'Bill Management System (BMS)',
                        BMS_DESCRIPTION: 'Track and manage bills and expenses',
                        COMING_SOON: 'Coming Soon',
                        COMING_SOON_MESSAGE: 'The Bill Management System is currently under development. Stay tuned for updates!'
        }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MESSAGES;
}
