// Error handling and popup dialog functionality
// All errors will be displayed in a modal popup instead of inline messages

// Error Handler Class
class ErrorHandler {
    constructor() {
        this.createErrorModal();
    }

    // Create modal HTML structure
    createErrorModal() {
        // Check if modal already exists
        if (document.getElementById('error-modal')) return;

        const modalHTML = `
            <div id="error-modal" class="error-modal">
                <div class="error-modal-content">
                    <div class="error-modal-header">
                        <span class="error-icon">⚠️</span>
                        <h3 id="error-modal-title">Error</h3>
                        <button class="error-modal-close" onclick="ErrorHandler.close()">&times;</button>
                    </div>
                    <div class="error-modal-body">
                        <p id="error-modal-message"></p>
                    </div>
                    <div class="error-modal-footer">
                        <button class="error-btn-ok" onclick="ErrorHandler.close()">OK</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addModalStyles();
    }

    // Add CSS styles for modal
    addModalStyles() {
        if (document.getElementById('error-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'error-modal-styles';
        style.textContent = `
            .error-modal {
                display: none;
                position: fixed;
                z-index: 9999;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                animation: fadeIn 0.3s;
            }

            .error-modal.active {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .error-modal-content {
                background-color: white;
                border-radius: 12px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideDown 0.3s;
            }

            .error-modal-header {
                display: flex;
                align-items: center;
                padding: 20px;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                border-radius: 12px 12px 0 0;
            }

            .error-icon {
                font-size: 24px;
                margin-right: 10px;
            }

            .error-modal-header h3 {
                margin: 0;
                flex: 1;
                font-size: 1.3em;
            }

            .error-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 30px;
                height: 30px;
            }

            .error-modal-close:hover {
                opacity: 0.8;
            }

            .error-modal-body {
                padding: 30px 20px;
            }

            .error-modal-body p {
                margin: 0;
                color: #1e293b;
                font-size: 16px;
                line-height: 1.5;
            }

            .error-modal-footer {
                padding: 15px 20px;
                text-align: right;
                border-top: 1px solid #e2e8f0;
            }

            .error-btn-ok {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 10px 30px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s;
            }

            .error-btn-ok:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideDown {
                from { 
                    transform: translateY(-50px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Show error modal
    static show(message, title = 'Error') {
        const modal = document.getElementById('error-modal');
        const messageEl = document.getElementById('error-modal-message');
        const titleEl = document.getElementById('error-modal-title');

        if (modal && messageEl && titleEl) {
            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.add('active');
        }
    }

    // Close error modal
    static close() {
        const modal = document.getElementById('error-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Show success message (can be used for success notifications)
    static showSuccess(message, title = 'Success') {
        const modal = document.getElementById('error-modal');
        const messageEl = document.getElementById('error-modal-message');
        const titleEl = document.getElementById('error-modal-title');
        const header = modal.querySelector('.error-modal-header');

        if (modal && messageEl && titleEl) {
            // Change styling for success
            header.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.add('active');

            // Reset styling after closing
            setTimeout(() => {
                header.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            }, 300);
        }
    }
}

// Initialize error handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new ErrorHandler();
});

// Make ErrorHandler globally available
window.ErrorHandler = ErrorHandler;
