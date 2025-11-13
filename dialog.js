// Dialog system for modal popups
const Dialog = {
    show(title, message, type = 'info') {
        this.close();
        
        const overlay = document.createElement('div');
        overlay.id = 'dialog-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s;';

        const dialog = document.createElement('div');
        dialog.style.cssText = 'background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';

        const iconMap = { success: { emoji: '✓', color: '#4CAF50' }, info: { emoji: 'ℹ', color: '#2196F3' } };
        const icon = iconMap[type] || iconMap.info;

        dialog.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: ${icon.color}; color: white; font-size: 32px; line-height: 60px; margin: 0 auto 15px;">${icon.emoji}</div>
                <h2 style="margin: 0 0 15px 0; color: #333;">${title}</h2>
                <p style="color: #666; line-height: 1.6;">${message}</p>
                <button onclick="document.getElementById('dialog-overlay').remove()" style="margin-top: 20px; padding: 12px 30px; border: none; border-radius: 6px; background: ${icon.color}; color: white; font-size: 16px; cursor: pointer;">OK</button>
            </div>
        `;

        if (!document.getElementById('dialog-styles')) {
            const style = document.createElement('style');
            style.id = 'dialog-styles';
            style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
            document.head.appendChild(style);
        }

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        overlay.onclick = (e) => { if (e.target === overlay) this.close(); };
    },

    close() {
        const overlay = document.getElementById('dialog-overlay');
        if (overlay) overlay.remove();
    },

    showComingSoon() {
        this.show(STRINGS.LANDING_PAGE.COMING_SOON, STRINGS.LANDING_PAGE.COMING_SOON_MESSAGE, 'info');
    }
};
