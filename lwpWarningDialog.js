// LWP WARNING DIALOG MODULE
// Shows modal warning when leave application will result in Leave Without Pay

// Show LWP Warning Dialog
function showLWPWarningDialog(lwpInfo, callback) {
    const { paidDaysInMonth, requestedDays, paidDays, lwpDays, totalPaidInMonth } = lwpInfo;
    
    const dialog = {
        title: '⚠️ Leave Without Pay (LWP) Warning',
        message: `
            <div style="text-align: left; padding: 20px;">
                <p style="font-size: 16px; font-weight: bold; color: #dc2626; margin-bottom: 15px;">
                    ⚠️ You have exceeded the 3-day paid leave limit for this month!
                </p>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 5px 0;">📊 <strong>Paid leaves already taken this month:</strong> ${paidDaysInMonth} days</p>
                    <p style="margin: 5px 0;">📝 <strong>You are requesting:</strong> ${requestedDays} days</p>
                    <p style="margin: 5px 0;">✅ <strong>Will be marked as paid:</strong> ${paidDays} days</p>
                    <p style="margin: 5px 0; color: #dc2626; font-weight: bold;">❌ <strong>Will be LWP (unpaid):</strong> ${lwpDays} days</p>
                </div>
                
                <p style="font-size: 14px; color: #64748b; margin-top: 15px;">
                    💡 <strong>Note:</strong> LWP (Leave Without Pay) means you will not receive salary for ${lwpDays} day(s).
                </p>
                
                <p style="font-size: 14px; font-weight: bold; margin-top: 15px;">
                    Do you want to continue with this application?
                </p>
            </div>
        `,
        buttons: [
            { text: 'Cancel', value: false, class: 'btn-secondary' },
            { text: 'Continue with LWP', value: true, class: 'btn-danger' }
        ]
    };
    
    // Use the Dialog system from dialog.js
    Dialog.show({
        title: dialog.title,
        message: dialog.message,
        buttons: [
            {
                text: dialog.buttons[0].text,
                className: 'secondary',
                onClick: () => {
                    Dialog.hide();
                    if (callback) callback(false);
                }
            },
            {
                text: dialog.buttons[1].text,
                className: 'danger',
                onClick: () => {
                    Dialog.hide();
                    if (callback) callback(true);
                }
            }
        ]
    });
}

// Show Zero Balance Warning Dialog
function showZeroBalanceDialog(leaveType, callback) {
    Dialog.show({
        title: '⚠️ No Leave Balance Available',
        message: `
            <div style="text-align: left; padding: 20px;">
                <p style="font-size: 16px; font-weight: bold; color: #dc2626; margin-bottom: 15px;">
                    ❌ You don't have any ${leaveType} balance!
                </p>
                
                <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin: 5px 0;">📊 <strong>Your ${leaveType} balance:</strong> 0 days</p>
                    <p style="margin: 5px 0; color: #dc2626;">💰 <strong>This leave will be marked as LWP (Leave Without Pay)</strong></p>
                </div>
                
                <p style="font-size: 14px; color: #64748b; margin-top: 15px;">
                    💡 <strong>Note:</strong> LWP means you will not receive salary for the requested leave days.
                </p>
                
                <p style="font-size: 14px; font-weight: bold; margin-top: 15px;">
                    Do you want to continue and apply for LWP?
                </p>
            </div>
        `,
        buttons: [
            {
                text: 'Cancel',
                className: 'secondary',
                onClick: () => {
                    Dialog.hide();
                    if (callback) callback(false);
                }
            },
            {
                text: 'Apply as LWP',
                className: 'danger',
                onClick: () => {
                    Dialog.hide();
                    if (callback) callback(true);
                }
            }
        ]
    });
}

// Show Date Already Applied Warning
function showDateOverlapDialog(overlappingLeaves) {
    const leaveDetails = overlappingLeaves.map(l => 
        `<li>${l.leaveType}: ${l.fromDate} to ${l.toDate} (${l.status})</li>`
    ).join('');
    
    Dialog.show({
        title: '❌ Date Already Applied',
        message: `
            <div style="text-align: left; padding: 20px;">
                <p style="font-size: 16px; font-weight: bold; color: #dc2626; margin-bottom: 15px;">
                    ⚠️ You have already applied for leave on these dates!
                </p>
                
                <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="margin-bottom: 10px;"><strong>Existing leave applications:</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${leaveDetails}
                    </ul>
                </div>
                
                <p style="font-size: 14px; color: #64748b; margin-top: 15px;">
                    💡 <strong>Note:</strong> You cannot apply for multiple leaves on the same date, even if the previous application is pending or not yet approved.
                </p>
            </div>
        `,
        buttons: [
            {
                text: 'OK',
                className: 'primary',
                onClick: () => Dialog.hide()
            }
        ]
    });
}
