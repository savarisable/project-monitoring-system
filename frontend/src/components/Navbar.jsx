import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  FolderKanban,
  UserPlus,
  Layers,
  CalendarCheck,
  FileCheck2,
  Bell,
  FileSpreadsheet,
  ShieldAlert,
  KeyRound,
  LogOut,
  Calendar,
  MessageSquareQuote,
  HelpCircle,
  FolderGit2,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Navbar = () => {
  const { user, logout, unreadNotifsCount, academicYears, selectedYearId, setSelectedYearId, refreshUnreadCount } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const handleOpenNotifications = async () => {
    setIsDrawerOpen(true);
    try {
      const list = await api.common.getNotifications();
      setNotifications(list);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  const handleRefreshNotifications = async () => {
    try {
      const list = await api.common.getNotifications();
      setNotifications(list);
      refreshUnreadCount();
    } catch (e) {}
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_PROJECT_HEAD': return 'Project Head';
      case 'ROLE_GUIDE': return 'Faculty Guide';
      case 'ROLE_STUDENT': return 'Student';
      default: return role;
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Academic Year:</span>
            {user?.role === 'ROLE_PROJECT_HEAD' && academicYears.length > 1 ? (
              <select
                className="form-control"
                style={{ width: '130px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                value={selectedYearId || ''}
                onChange={(e) => setSelectedYearId(Number(e.target.value))}
              >
                {academicYears.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.yearName} {y.current ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <span className="header-academic-year">
                {academicYears.find((y) => y.id === selectedYearId)?.yearName || '2026-27'}
              </span>
            )}
          </div>
        </div>

        <div className="header-actions">
          {/* In-App Notification Bell */}
          <button
            onClick={handleOpenNotifications}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotifsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile Overview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getRoleBadge(user?.role)}</div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
              }}
            >
              {user?.fullName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </header>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onRefresh={handleRefreshNotifications}
      />
    </>
  );
};

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <FolderGit2 size={20} />
        </div>
        <div>
          <div className="sidebar-title">PROJECT MONITOR</div>
          <div className="sidebar-subtitle">Academic ERP Portal</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* PROJECT HEAD NAVIGATION */}
        {user?.role === 'ROLE_PROJECT_HEAD' && (
          <>
            <NavLink to="/head/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/head/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Users Management
            </NavLink>
            <NavLink to="/head/guides" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} /> Guides
            </NavLink>
            <NavLink to="/head/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} /> Students
            </NavLink>
            <NavLink to="/head/groups" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={18} /> Groups
            </NavLink>
            <NavLink to="/head/allocations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserPlus size={18} /> Guide Allocation
            </NavLink>
            <NavLink to="/head/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} /> Projects
            </NavLink>
            <NavLink to="/head/milestones" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Milestones Workflow
            </NavLink>
            <NavLink to="/head/presentations-config" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Presentations
            </NavLink>
            <NavLink to="/head/submissions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Submissions Monitoring
            </NavLink>
            <NavLink to="/head/notices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notices Board
            </NavLink>
            <NavLink to="/head/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={18} /> Reports & Analytics
            </NavLink>
            <NavLink to="/head/audit-logs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={18} /> Audit Logs
            </NavLink>
          </>
        )}

        {/* GUIDE NAVIGATION */}
        {user?.role === 'ROLE_GUIDE' && (
          <>
            <NavLink to="/guide/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/guide/my-groups" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={18} /> My Groups & Projects
            </NavLink>
            <NavLink to="/guide/submissions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Submissions & Reviews
            </NavLink>
            <NavLink to="/guide/presentations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Presentations & Marks
            </NavLink>
            <NavLink to="/guide/meetings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Schedule Meetings
            </NavLink>
            <NavLink to="/guide/notices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Group Notices
            </NavLink>
            <NavLink to="/guide/student-requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <MessageSquareQuote size={18} /> Student Inquiries
            </NavLink>
          </>
        )}

        {/* STUDENT NAVIGATION */}
        {user?.role === 'ROLE_STUDENT' && (
          <>
            <NavLink to="/student/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/student/my-group" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> My Group & Guide
            </NavLink>
            <NavLink to="/student/my-project" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} /> My Project Details
            </NavLink>
            <NavLink to="/student/submissions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Document Submissions
            </NavLink>
            <NavLink to="/student/presentations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Presentations & Marks
            </NavLink>
            <NavLink to="/student/meetings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Guide Meetings
            </NavLink>
            <NavLink to="/student/notices" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notices & Circulars
            </NavLink>
            <NavLink to="/student/requests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <HelpCircle size={18} /> Ask Guide / Inquiries
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/change-password" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <KeyRound size={18} /> Change Password
        </NavLink>
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={18} color="#ef4444" />
          <span style={{ color: '#ef4444' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};
