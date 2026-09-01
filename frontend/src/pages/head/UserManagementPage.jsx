import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { UserPlus, KeyRound, Shield, CheckCircle, XCircle, GraduationCap, UserCheck, Briefcase, Trash2 } from 'lucide-react';

export const UserManagementPage = () => {
  const { selectedYearId } = useAuth();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Sync roleFilter with URL path
  useEffect(() => {
    if (location.pathname.includes('/head/guides')) {
      setRoleFilter('ROLE_GUIDE');
    } else if (location.pathname.includes('/head/students')) {
      setRoleFilter('ROLE_STUDENT');
    } else {
      setRoleFilter('');
    }
  }, [location.pathname]);

  // Form State for creating new user
  const [formData, setFormData] = useState({
    username: '',
    initialPassword: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'ROLE_GUIDE',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    specialization: '',
    maxGroupsCapacity: 5,
    rollNumber: '',
    semester: 7,
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.head.getUsers(roleFilter);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.head.createUser({
        ...formData,
        academicYearId: selectedYearId,
      });
      setIsAddModalOpen(false);
      setMessage(`User account '${formData.username}' created successfully.`);
      setFormData({
        username: '',
        initialPassword: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'ROLE_GUIDE',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        specialization: '',
        maxGroupsCapacity: 5,
        rollNumber: '',
        semester: 7,
      });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.head.toggleUserStatus(userId);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      await api.head.resetPassword(selectedUser.id, newPassword);
      setIsResetModalOpen(false);
      setNewPassword('');
      setMessage(`Password for ${selectedUser.username} has been reset.`);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete account "${user.fullName}" (@${user.username})? This will remove their assignments.`)) {
      return;
    }
    try {
      await api.head.deleteUser(user.id);
      setMessage(`User account ${user.username} deleted successfully.`);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user account.');
    }
  };

  const columns = [
    {
      header: 'User / Full Name',
      accessor: 'fullName',
      render: (u) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.fullName}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{u.username}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (u) => {
        const isHead = u.role === 'ROLE_PROJECT_HEAD';
        const isGuide = u.role === 'ROLE_GUIDE';
        return (
          <span className={`badge ${isHead ? 'badge-info' : isGuide ? 'badge-neutral' : 'badge-warning'}`}>
            {u.role.replace('ROLE_', '')}
          </span>
        );
      },
    },
    {
      header: 'Academic Details',
      render: (u) => {
        if (u.role === 'ROLE_GUIDE' && u.profileDetails) {
          return (
            <div style={{ fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.profileDetails.designation || 'Faculty Guide'}</div>
              <div style={{ color: '#64748b' }}>
                Capacity: <strong>{u.profileDetails.allocatedGroupsCount || 0}</strong> / {u.profileDetails.maxGroupsCapacity || 8} groups
              </div>
            </div>
          );
        }
        if (u.role === 'ROLE_STUDENT' && u.profileDetails) {
          return (
            <div style={{ fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 600, color: '#1e293b' }}>Roll: {u.profileDetails.rollNumber} (Sem {u.profileDetails.semester})</div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '2px' }}>
                <span className="badge badge-neutral">
                  {u.profileDetails.groupNumber ? `Group ${u.profileDetails.groupNumber}` : 'Unassigned'}
                </span>
                {u.profileDetails.leader && <span className="badge badge-success">Group Leader</span>}
              </div>
            </div>
          );
        }
        return <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Institutional Staff</span>;
      },
    },
    {
      header: 'Email / Phone',
      accessor: 'email',
      render: (u) => (
        <div style={{ fontSize: '0.8125rem' }}>
          <div>{u.email || '-'}</div>
          <div style={{ color: '#94a3b8' }}>{u.phone || '-'}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (u) => (
        <span className={`badge ${u.active ? 'badge-success' : 'badge-danger'}`}>
          {u.active ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (u) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {u.role !== 'ROLE_PROJECT_HEAD' && (
            <>
              <button
                className="btn btn-secondary btn-sm"
                title="Toggle Active/Disable"
                onClick={() => handleToggleStatus(u.id)}
              >
                {u.active ? <XCircle size={14} color="#ef4444" /> : <CheckCircle size={14} color="#10b981" />}
                {u.active ? 'Disable' : 'Enable'}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                title="Reset Password"
                onClick={() => {
                  setSelectedUser(u);
                  setError('');
                  setIsResetModalOpen(true);
                }}
              >
                <KeyRound size={14} /> Reset
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444' }}
                title="Delete Account"
                onClick={() => handleDeleteUser(u)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const getPageTitle = () => {
    if (roleFilter === 'ROLE_GUIDE') return 'Faculty Guides';
    if (roleFilter === 'ROLE_STUDENT') return 'Student Accounts';
    if (roleFilter === 'ROLE_PROJECT_HEAD') return 'Project Heads';
    return 'All User Accounts';
  };

  const getPageSubtitle = () => {
    if (roleFilter === 'ROLE_GUIDE') return 'Manage faculty guide credentials, designation, and project group capacity.';
    if (roleFilter === 'ROLE_STUDENT') return 'Manage student accounts, roll numbers, group assignments, and leaders.';
    return 'Provision and manage institutional faculty guide and student accounts.';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{getPageTitle()}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{getPageSubtitle()}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <UserPlus size={18} /> Add New Account
        </button>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Role Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { key: '', label: 'All Accounts' },
          { key: 'ROLE_GUIDE', label: 'Guides' },
          { key: 'ROLE_STUDENT', label: 'Students' },
          { key: 'ROLE_PROJECT_HEAD', label: 'Project Heads' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`btn btn-sm ${roleFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRoleFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search users by name, username or email..."
        />
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New User Account"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateUser}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. guide_sharma or std_101"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Initial account password"
                value={formData.initialPassword}
                onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. Rajesh Sharma or Rahul Deshmukh"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Account Role *</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="ROLE_GUIDE">Faculty Guide</option>
              <option value="ROLE_STUDENT">Student</option>
            </select>
          </div>

          {/* Conditional Fields based on Role */}
          {formData.role === 'ROLE_GUIDE' && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Guide Academic Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Associate Professor"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Groups Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-control"
                    value={formData.maxGroupsCapacity}
                    onChange={(e) => setFormData({ ...formData, maxGroupsCapacity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label className="form-label">Specialization / Domain</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. AI/ML, Cloud Computing, Cyber Security"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            </div>
          )}

          {formData.role === 'ROLE_STUDENT' && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Student Academic Details
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. CS202601"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="form-control"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title={`Reset Password for ${selectedUser?.fullName} (@${selectedUser?.username})`}
        maxWidth="450px"
      >
        <form onSubmit={handleResetPassword}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
            Enter a new password for this user. The user will need to use this password on next login.
          </p>
          <div className="form-group">
            <label className="form-label">New Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Set New Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
