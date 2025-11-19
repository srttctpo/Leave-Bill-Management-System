// LEAVE HISTORY ACADEMIC YEAR MODULE
// Displays comprehensive leave history for academic year (July-June) with role-based filtering

// Show Academic Year Leave History
function showAcademicYearLeaveHistory() {
    const currentUser = JSON.parse(localStorage.getItem('lbs-current-user'));
    if (!currentUser) { alert('Please login first!'); return; }
    
    const historyData = getAcademicYearLeaveHistory(
        currentUser.email,
        currentUser.role,
        currentUser.department
    );
    
    const approvalSection = document.getElementById('approval-section');
    let html = '<div class="academic-history-container" style="margin: 20px 0;">';
    
    // Header
    html += '<h3 style="color: #1e40af; margin-bottom: 20px;">📊 Academic Year Leave History</h3>';
    html += `<div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">`;
    html += `<p style="margin: 0; font-size: 16px; font-weight: bold; color: #1e40af;">`;
    html += `📅 Academic Year: ${historyData.academicYear}`;
    html += ` (July ${historyData.academicYear.split('-')[0]} - June ${historyData.academicYear.split('-')[1]})`;
    html += `</p>`;
    
    // Role-based view message
    if (currentUser.role === 'Individual') {
        html += '<p style="margin: 5px 0 0 0; font-size: 13px; color: #64748b;">Showing your leaves only</p>';
    } else if (currentUser.role === 'HOD') {
        html += `<p style="margin: 5px 0 0 0; font-size: 13px; color: #64748b;">Showing all leaves for ${currentUser.department} department</p>`;
    } else if (currentUser.role === 'Principal' || currentUser.role === 'Admin') {
        html += '<p style="margin: 5px 0 0 0; font-size: 13px; color: #64748b;">Showing all leaves for entire college</p>';
    }
    html += '</div>';
    
    // Summary Cards
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 25px;">';
    
    const leaveTypes = ['CL', 'SL', 'OD', 'CO', 'LWP'];
    leaveTypes.forEach(type => {
        const summary = historyData.summary[type];
        let color = '#3b82f6';
        if (type === 'LWP') color = '#dc2626';
        
        html += `<div style="background: white; border: 2px solid ${color}; border-radius: 10px; padding: 12px; text-align: center;">`;
        html += `<h4 style="margin: 0 0 8px 0; color: ${color}; font-size: 15px;">${type}</h4>`;
        html += `<div style="font-size: 12px; color: #64748b; line-height: 1.6;">`;
        html += `<div>Applied: <strong>${summary.applied}</strong></div>`;
        html += `<div>Approved: <strong style="color: #059669;">${summary.approved}</strong></div>`;
        html += `<div>Pending: <strong style="color: #f59e0b;">${summary.pending}</strong></div>`;
        html += `<div>Rejected: <strong style="color: #dc2626;">${summary.rejected}</strong></div>`;
        html += '</div></div>';
    });
    
    html += '</div>';
    
    // Detailed Leave Table
    html += '<div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
    html += '<h4 style="margin: 0 0 15px 0; color: #334155;">📋 Detailed Leave Records</h4>';
    
    if (historyData.leaves.length === 0) {
        html += '<p style="text-align: center; color: #94a3b8; padding: 40px;">No leave applications found for this academic year.</p>';
    } else {
        // Table
        html += '<div style="overflow-x: auto;">';
        html += '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">';
        html += '<thead><tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">';
        html += '<th style="padding: 12px 8px; text-align: left;">Date Applied</th>';
        
        if (currentUser.role !== 'Individual') {
            html += '<th style="padding: 12px 8px; text-align: left;">Employee</th>';
            html += '<th style="padding: 12px 8px; text-align: left;">Dept</th>';
        }
        
        html += '<th style="padding: 12px 8px; text-align: center;">Type</th>';
        html += '<th style="padding: 12px 8px; text-align: left;">From</th>';
        html += '<th style="padding: 12px 8px; text-align: left;">To</th>';
        html += '<th style="padding: 12px 8px; text-align: center;">Days</th>';
        html += '<th style="padding: 12px 8px; text-align: left;">Reason</th>';
        html += '<th style="padding: 12px 8px; text-align: center;">Status</th>';
        html += '</tr></thead><tbody>';
        
        // Sort by most recent first
        const sortedLeaves = historyData.leaves.sort((a, b) => 
            new Date(b.appliedOn) - new Date(a.appliedOn)
        );
        
        sortedLeaves.forEach((leave, index) => {
            const bgColor = index % 2 === 0 ? '#ffffff' : '#f9fafb';
            let statusColor = '#6b7280';
            let statusBg = '#f3f4f6';
            
            if (leave.status === 'approved') {
                statusColor = '#059669';
                statusBg = '#d1fae5';
            } else if (leave.status === 'rejected') {
                statusColor = '#dc2626';
                statusBg = '#fee2e2';
            } else if (leave.status === 'pending') {
                statusColor = '#f59e0b';
                statusBg = '#fef3c7';
            }
            
            html += `<tr style="background: ${bgColor}; border-bottom: 1px solid #e2e8f0;">`;
            html += `<td style="padding: 10px 8px;">${new Date(leave.appliedOn).toLocaleDateString('en-IN')}</td>`;
            
            if (currentUser.role !== 'Individual') {
                html += `<td style="padding: 10px 8px;">${leave.applicantName}</td>`;
                html += `<td style="padding: 10px 8px;">${leave.applicantDepartment}</td>`;
            }
            
            html += `<td style="padding: 10px 8px; text-align: center;"><span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${leave.leaveType}</span></td>`;
            html += `<td style="padding: 10px 8px;">${leave.fromDate}</td>`;
            html += `<td style="padding: 10px 8px;">${leave.toDate}</td>`;
            html += `<td style="padding: 10px 8px; text-align: center; font-weight: bold;">${leave.days}</td>`;
            html += `<td style="padding: 10px 8px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${leave.reason}">${leave.reason}</td>`;
            html += `<td style="padding: 10px 8px; text-align: center;"><span style="background: ${statusBg}; color: ${statusColor}; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; text-transform: uppercase;">${leave.status}</span></td>`;
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
    }
    
    html += '</div>'; // End table container
    html += '</div>'; // End main container
    
    approvalSection.innerHTML = html;
}
