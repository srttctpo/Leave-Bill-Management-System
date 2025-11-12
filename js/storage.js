// storage.js - LocalStorage utility functions

// Initialize default users
const DEFAULT_USERS = [
  {email:'admin@system.com',pass:'Admin@123',role:'Admin',department:'Administration',name:'System Administrator',status:'approved',joinDate:'2024-01-01', leaveBalance: {CL:0,OD:0,CO:0,SL:0,LWP:0}},
  {email:'principal@system.com',pass:'Principal@123',role:'Principal',department:'Administration',name:'Dr. Principal',status:'approved',joinDate:'2024-01-01', leaveBalance: {CL:12,OD:15,CO:10,SL:7,LWP:0}},
  {email:'comp_hod@system.com',pass:'HOD@123',role:'HOD',department:'Computer',name:'Prof. Computer HOD',status:'approved',joinDate:'2024-01-01', leaveBalance: {CL:12,OD:15,CO:10,SL:7,LWP:0}},
  {email:'acc_hod@system.com',pass:'HOD@123',role:'HOD',department:'Accounts',name:'Prof. Accounts HOD',status:'approved',joinDate:'2024-01-01', leaveBalance: {CL:12,OD:15,CO:10,SL:7,LWP:0}},
  {email:'emp_comp@system.com',pass:'Emp@123',role:'Individual',department:'Computer',name:'John Employee',status:'approved',joinDate:'2024-01-01', leaveBalance: {CL:12,OD:15,CO:10,SL:7,LWP:0}},
  {email:'tpo@system.com',pass:'TPO@123',role:'Individual',department:'TPO',name:'TPO Officer',status:'approved',joinDate:'2024-01-01', leaveBalance: {CL:12,OD:15,CO:10,SL:7,LWP:0}}
];

const Storage = {
  // Users
  getUsers: function() {
    let users = JSON.parse(localStorage.getItem('lbs-users'));
    if (!users || users.length === 0) {
      users = DEFAULT_USERS;
      this.setUsers(users);
    }
    return users;
  },
  
  setUsers: function(users) {
    localStorage.setItem('lbs-users', JSON.stringify(users));
  },
  
  getUserByEmail: function(email) {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  },
  
  updateUser: function(email, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.setUsers(users);
      return true;
    }
    return false;
  },
  
  // Current User Session
  getCurrentUser: function() {
    const user = localStorage.getItem('lbs-current-user');
    return user ? JSON.parse(user) : null;
  },
  
  setCurrentUser: function(user) {
    localStorage.setItem('lbs-current-user', JSON.stringify(user));
  },
  
  clearCurrentUser: function() {
    localStorage.removeItem('lbs-current-user');
  },
  
  // Leave Applications
  getLeaveApplications: function() {
    const leaves = localStorage.getItem('lbs-leaves');
    return leaves ? JSON.parse(leaves) : [];
  },
  
  setLeaveApplications: function(leaves) {
    localStorage.setItem('lbs-leaves', JSON.stringify(leaves));
  },
  
  addLeaveApplication: function(leaveApp) {
    const leaves = this.getLeaveApplications();
    leaveApp.id = 'LEAVE-' + Date.now();
    leaveApp.appliedDate = new Date().toISOString();
    leaves.push(leaveApp);
    this.setLeaveApplications(leaves);
    return leaveApp;
  },
  
  updateLeaveApplication: function(id, updates) {
    const leaves = this.getLeaveApplications();
    const index = leaves.findIndex(l => l.id === id);
    if (index !== -1) {
      leaves[index] = { ...leaves[index], ...updates };
      this.setLeaveApplications(leaves);
      return true;
    }
    return false;
  }
};

// Initialize users on first load
Storage.getUsers();
