// Notification system for displaying success/error messages
const Notifications = {
    show(title, message, type = 'success', duration = 5000) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 400px;';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        const icon = type === 'success' ? '✓' : '⚠';
        const bgColor = type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)';
        
        notification.style.cssText = `background: ${bgColor}; color: white; padding: 20px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease-out;`;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start;">
                <div style="font-size: 24px; margin-right: 15px;">${icon}</div>
                <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 5px; font-size: 16px;">${title}</div>
                    <div style="font-size: 14px; line-height: 1.5;">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
        `;

        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
            document.head.appendChild(style);
        }

        container.appendChild(notification);
        if (duration > 0) setTimeout(() => notification.remove(), duration);
    },

    registrationSuccess(userName, role, department) {
        let approverInfo = '';
        if (role === 'Individual') approverInfo = STRINGS.NOTIFICATIONS.REGISTRATION_PENDING_INDIVIDUAL.replace('{department}', department);
        else if (role === 'HOD') approverInfo = STRINGS.NOTIFICATIONS.REGISTRATION_PENDING_HOD;
        else if (role === 'Principal') approverInfo = STRINGS.NOTIFICATIONS.REGISTRATION_PENDING_PRINCIPAL;

        const message = `<p>Dear <strong>${userName}</strong>,</p><p>${approverInfo}</p><p><em>${STRINGS.NOTIFICATIONS.WAIT_FOR_APPROVAL}</em></p>`;
        this.show(STRINGS.NOTIFICATIONS.REGISTRATION_SUCCESS_TITLE, message, 'success', 8000);
    }
};
