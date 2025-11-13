// ASSETS.JS - Centralized asset management for SRTTC Leave & Bill Management System
// All images, logos, icons, and static resources are defined here

const ASSETS = {
    // College Information
    COLLEGE: {
        NAME: 'SRTTC',
        FULL_NAME: 'Sundar Ramasamy Tulasiani Technical Campus',
        LOCATION: 'Khamshet',
        TAGLINE: 'Faculty of Engineering'
    },

    // Logo and Branding
    LOGO: {
        PRIMARY: 'assets/images/srttc-logo.png',
        FAVICON: 'assets/images/favicon.ico',
        ALT_TEXT: 'SRTTC Khamshet Logo',
        SIZE: {
            HEADER: '60px',
            LANDING: '120px',
            FAVICON: '32px'
        }
    },

    // Icons for different systems
    ICONS: {
        LMS: '📋', // Clipboard emoji for Leave Management
        BMS: '💰', // Money bag emoji for Bill Management
        DASHBOARD: '📈', // Chart emoji
        USERS: '👥', // Users emoji
        APPROVALS: '✅', // Check mark emoji
        LOGOUT: '🚪' // Door emoji
    },

    // Color Scheme
    COLORS: {
        PRIMARY: '#e63946',      // SRTTC Red
        SECONDARY: '#f1faee',    // Light cream
        ACCENT: '#a8dadc',       // Light blue
        SUCCESS: '#06d6a0',      // Green
        WARNING: '#ffd60a',      // Yellow
        DANGER: '#e63946',       // Red
        TEXT_DARK: '#1d3557',    // Dark blue
        TEXT_LIGHT: '#f1faee'    // Light cream
    },

    // Gradient Backgrounds
    GRADIENTS: {
        PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        LANDING: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        HEADER: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
    },

    // Image placeholders (to be added when actual images are uploaded)
    IMAGES: {
        DEFAULT_AVATAR: 'assets/images/default-avatar.png',
        PLACEHOLDER: 'assets/images/placeholder.png'
    },

    // Document templates
    DOCUMENTS: {
        LEAVE_FORM: 'assets/templates/leave-form.pdf',
        BILL_FORM: 'assets/templates/bill-form.pdf'
    }
};

// Helper functions to get assets
const AssetHelper = {
    // Get logo path
    getLogo: (size = 'PRIMARY') => {
        return ASSETS.LOGO[size] || ASSETS.LOGO.PRIMARY;
    },

    // Get college name with location
    getCollegeName: (includeLocation = true) => {
        if (includeLocation) {
            return `${ASSETS.COLLEGE.NAME}, ${ASSETS.COLLEGE.LOCATION}`;
        }
        return ASSETS.COLLEGE.NAME;
    },

    // Get full college title
    getFullTitle: () => {
        return `${ASSETS.COLLEGE.FULL_NAME} - ${ASSETS.COLLEGE.TAGLINE}`;
    },

    // Get icon by name
    getIcon: (iconName) => {
        return ASSETS.ICONS[iconName.toUpperCase()] || '';
    },

    // Get color by name
    getColor: (colorName) => {
        return ASSETS.COLORS[colorName.toUpperCase()] || ASSETS.COLORS.PRIMARY;
    },

    // Get gradient by name
    getGradient: (gradientName) => {
        return ASSETS.GRADIENTS[gradientName.toUpperCase()] || ASSETS.GRADIENTS.PRIMARY;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASSETS, AssetHelper };
}
