/**
 * Authentication Guard Module
 * Provides centralized route protection for the Leave & Bill Management System
 * 
 * Usage: Add this to the <head> or top of <body> in any protected page
 * <script src="auth.js"></script>
 * 
 * The guard will automatically:
 * 1. Check if user is authenticated (lbs-current-user in localStorage)
 * 2. Redirect to login page if not authenticated
 * 3. Allow normal page execution if authenticated
 */

(function() {
  'use strict';

  // List of protected pages that require authentication
  const PROTECTED_PAGES = [
    'landing.html',
    'dashboard.html',
    'bill-dashboard.html'
  ];

  // List of public pages that don't require authentication
  const PUBLIC_PAGES = [
    'index.html'
  ];

  /**
   * Check if current page is protected
   * @returns {boolean} true if current page requires authentication
   */
  function isProtectedPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    return PROTECTED_PAGES.some(page => currentPage.includes(page)) || 
           currentPage === '' || 
           currentPage === '/';
  }

  /**
   * Check if user is currently authenticated
   * @returns {Object|null} user object if authenticated, null otherwise
   */
  function getAuthenticatedUser() {
    try {
      const userJson = localStorage.getItem('lbs-current-user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  /**
   * Redirect to login page
   */
  function redirectToLogin() {
    // Prevent infinite redirect loops
    if (!window.location.pathname.includes('index.html')) {
      window.location.href = 'index.html';
    }
  }

  /**
   * Redirect to landing page if user is already logged in and on login page
   */
  function redirectToLanding() {
    const currentPage = window.location.pathname.split('/').pop() || '';
    if (currentPage.includes('index.html') || currentPage === '') {
      window.location.href = 'landing.html';
    }
  }

  /**
   * Initialize authentication guard
   * This function runs immediately when auth.js is loaded
   */
  function initAuthGuard() {
    const currentUser = getAuthenticatedUser();
    const isOnProtectedPage = isProtectedPage();
    const isOnLoginPage = window.location.pathname.includes('index.html');

    if (isOnProtectedPage && !currentUser) {
      // User is on protected page but not authenticated
      redirectToLogin();
    } else if (isOnLoginPage && currentUser) {
      // User is on login page but already authenticated
      redirectToLanding();
    }
  }

  // Run the guard when DOM is ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGuard);
  } else {
    // If this script is loaded at the end of body, DOM is already ready
    initAuthGuard();
  }

  // Expose utility functions globally for other scripts
  window.Auth = {
    isAuthenticated: function() {
      return getAuthenticatedUser() !== null;
    },
    getUser: getAuthenticatedUser,
    logout: function() {
      localStorage.removeItem('lbs-current-user');
      window.location.href = 'index.html';
    }
  };

})();
