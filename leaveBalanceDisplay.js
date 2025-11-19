// LEAVE BALANCE DISPLAY MODULE
// Shows comprehensive leave balance breakdown with used, pending, and available counts

// Display Leave Balance Card
function displayLeaveBalanceCard(user) {
    if (!user.leaveBalance) user = initializeLeaveBalance(user);
    
    const leaveTypes = ['CL', 'SL', 'OD', 'CO', 'LWP'];
    const leaveNames = {
        CL: 'Casual Leave',
        SL: 'Sick Leave',
        OD: 'On Duty',
        CO: 'Compensatory Off',
        LWP: 'Leave Without Pay'
    };
    
    let html = '<div class="leave-balance-container" style="margin: 20px 0;">';
    html += '<h3 style="margin-bottom: 20px; color: #1e40af;">📊 Your Leave Balance</h3>';
    
    // Academic Year Info
    const academicYear = getCurrentAcademicYear();
    html += `<div style="background: #dbeafe; padding: 10px; border-radius: 8px; margin-bottom: 20px;">`;
    html += `<p style="margin: 0; font-size: 14px; color: #1e40af;">📅 <strong>Academic Year:</strong> ${academicYear} (July - June)</p>`;
    html += '</div>';
    
    // Leave Balance Grid
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">';
    
    leaveTypes.forEach(type => {
        const total = user.leaveBalance[type] || 0;
        const used = user.leaveUsed[type] || 0;
        const pending = user.leavePending[type] || 0;
        const available = total - used - pending;
        
        // Color coding
        let cardColor = '#f0f9ff';
        let borderColor = '#3b82f6';
        let iconColor = '#3b82f6';
        
        if (type === 'LWP') {
            cardColor = '#fef2f2';
            borderColor = '#dc2626';
            iconColor = '#dc2626';
        } else if (available === 0) {
            cardColor = '#fef3c7';
            borderColor = '#f59e0b';
            iconColor = '#f59e0b';
        } else if (available < 3 && type === 'CL') {
            cardColor = '#fef3c7';
            borderColor = '#f59e0b';
            iconColor = '#f59e0b';
        }
        
        html += `<div class="leave-card" style="
            background: ${cardColor};
            border: 2px solid ${borderColor};
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">`;
        
        html += `<div style="display: flex; align-items: center; margin-bottom: 10px;">`;
        html += `<span style="font-size: 24px; margin-right: 10px;">📝</span>`;
        html += `<div>`;
        html += `<h4 style="margin: 0; color: ${iconColor}; font-size: 16px;">${type}</h4>`;
        html += `<p style="margin: 0; font-size: 12px; color: #64748b;">${leaveNames[type]}</p>`;
        html += `</div>`;
        html += '</div>';
        
        html += '<div style="margin-top: 12px;">';
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">`;
        html += `<span style="font-size: 13px; color: #475569;">Total:</span>`;
        html += `<span style="font-weight: bold; color: #1e293b;">${total}</span>`;
        html += '</div>';
        
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">`;
        html += `<span style="font-size: 13px; color: #475569;">✔ Used:</span>`;
        html += `<span style="color: #64748b;">${used}</span>`;
        html += '</div>';
        
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">`;
        html += `<span style="font-size: 13px; color: #475569;">⏳ Pending:</span>`;
        html += `<span style="color: #f59e0b;">${pending}</span>`;
        html += '</div>';
        
        html += '<div style="border-top: 2px solid ' + borderColor + '; padding-top: 8px; margin-top: 8px;">';
        html += `<div style="display: flex; justify-content: space-between;">`;
        html += `<span style="font-size: 14px; font-weight: bold; color: ${iconColor};">✨ Available:</span>`;
        html += `<span style="font-size: 18px; font-weight: bold; color: ${iconColor};">${available}</span>`;
        html += '</div>';
        html += '</div>';
        
        html += '</div>'; // End inner div
        html += '</div>'; // End leave-card
    });
    
    html += '</div>'; // End grid
    html += '</div>'; // End container
    
    return html;
}

// Display Compact Leave Balance (for forms and quick view)
function displayCompactLeaveBalance(user) {
    if (!user.leaveBalance) user = initializeLeaveBalance(user);
    
    let html = '<div style="background: #f1f5f9; padding: 12px; border-radius: 8px; margin: 15px 0;">';
    html += '<p style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px; color: #334155;">📊 Your Leave Balance:</p>';
    html += '<div style="display: flex; flex-wrap: wrap; gap: 12px;">';
    
    ['CL', 'SL', 'OD', 'CO'].forEach(type => {
        const total = user.leaveBalance[type] || 0;
        const used = user.leaveUsed[type] || 0;
        const pending = user.leavePending[type] || 0;
        const available = total - used - pending;
        
        html += `<div style="background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">`;
        html += `<span style="font-weight: bold; color: #3b82f6;">${type}:</span> `;
        html += `<span style="color: #64748b;">T:${total}</span> | `;
        html += `<span style="color: #dc2626;">U:${used}</span> | `;
        html += `<span style="color: #f59e0b;">P:${pending}</span> | `;
        html += `<span style="font-weight: bold; color: #059669;">A:${available}</span>`;
        html += '</div>';
    });
    
    html += '</div>';
    html += '<p style="margin: 8px 0 0 0; font-size: 11px; color: #64748b;">T=Total, U=Used, P=Pending, A=Available</p>';
    html += '</div>';
    
    return html;
}

// Show Leave Balance in Dashboard
function showLeaveBalance() {
    const currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    if (!currentUser) { alert('Please login first!'); return; }
    
    const approvalSection = document.getElementById('approval-section');
    const balanceHTML = displayLeaveBalanceCard(currentUser);
    
    approvalSection.innerHTML = balanceHTML;
}
