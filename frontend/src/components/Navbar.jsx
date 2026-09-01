import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  BookOpen,
  Palette,
  Moon,
  Sun,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { CollegeBanner } from '../assets/branding.jsx';

export const Navbar = ({ onToggleMobileNav }) => {
  const { user, logout, unreadNotifsCount, academicYears, selectedYearId, setSelectedYearId, refreshUnreadCount } = useAuth();
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const themeDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* College Institutional Top Header Banner */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '3px solid #1e3a8a',
          padding: '0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          width: '100%',
        }}
      >
        <CollegeBanner />
      </div>

      <header className="header">
        <div className="header-title-area" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile Hamburger Toggle Button */}
          <button
            className="btn btn-secondary btn-sm mobile-menu-toggle"
            onClick={onToggleMobileNav}
            style={{
              padding: '0.4rem',
              marginRight: '0.75rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>

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
          {/* Futuristic Theme Switcher Dropdown */}
          <div style={{ position: 'relative' }} ref={themeDropdownRef}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Change Theme"
            >
              <span>{currentTheme.icon}</span>
              <span>{currentTheme.name}</span>
              <Palette size={14} style={{ color: 'var(--primary-500)', marginLeft: '2px' }} />
            </button>

            {isThemeOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '180px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
                  padding: '0.5rem',
                  zIndex: 50,
                  animation: 'modalScale 0.15s ease-out',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-subtle)', padding: '0.25rem 0.5rem', textTransform: 'uppercase' }}>
                  Select Theme
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsThemeOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.625rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      backgroundColor: theme === t.id ? 'var(--primary-100)' : 'transparent',
                      color: theme === t.id ? 'var(--primary-500)' : 'var(--text-main)',
                      fontWeight: theme === t.id ? 700 : 500,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      marginBottom: '2px',
                    }}
                  >
                    <span>{t.icon}</span>
                    <span style={{ flex: 1 }}>{t.name}</span>
                    {theme === t.id && <Sparkles size={12} style={{ color: 'var(--primary-500)' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* In-App Notifications Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleOpenNotifications}
            style={{
              position: 'relative',
              padding: '0.45rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
            title="Notifications & Alerts"
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                  border: '2px solid var(--bg-surface)',
                }}
              >
                {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user?.fullName}
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--primary-500)', fontWeight: 600 }}>
                {getRoleBadge(user?.role)}
              </span>
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-500)',
                color: '#ffffff',
                fontWeight: 800,
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

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.35)',
              flexShrink: 0,
            }}
          >
            <FolderGit2 size={20} />
          </div>
          <div>
            <div className="sidebar-title" style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.01em', textTransform: 'uppercase' }}>
              PROJECT MONITORING SYSTEM
            </div>
            <div className="sidebar-subtitle" style={{ fontSize: '0.6875rem' }}>
              Academic ERP Portal
            </div>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="mobile-close-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'none',
          }}
          title="Close Menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* PROJECT HEAD NAVIGATION */}
        {user?.role === 'ROLE_PROJECT_HEAD' && (
          <>
            <NavLink to="/head/dashboard" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/head/users" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Users Management
            </NavLink>
            <NavLink to="/head/guides" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserCheck size={18} /> Guides
            </NavLink>
            <NavLink to="/head/students" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} /> Students
            </NavLink>
            <NavLink to="/head/groups" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={18} /> Groups
            </NavLink>
            <NavLink to="/head/allocations" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <UserPlus size={18} /> Guide Allocation
            </NavLink>
            <NavLink to="/head/projects" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} /> Projects
            </NavLink>
            <NavLink to="/head/milestones" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Milestones Workflow
            </NavLink>
            <NavLink to="/head/presentations-config" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Presentations
            </NavLink>
            <NavLink to="/head/submissions" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Submissions Monitoring
            </NavLink>
            <NavLink to="/head/notices" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notices Board
            </NavLink>
            <NavLink to="/head/reports" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileSpreadsheet size={18} /> Reports & Analytics
            </NavLink>
            <NavLink to="/head/audit-logs" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={18} /> Audit Logs
            </NavLink>
          </>
        )}

        {/* GUIDE NAVIGATION */}
        {user?.role === 'ROLE_GUIDE' && (
          <>
            <NavLink to="/guide/dashboard" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/guide/my-groups" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={18} /> My Groups & Projects
            </NavLink>
            <NavLink to="/guide/submissions" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Submissions & Reviews
            </NavLink>
            <NavLink to="/guide/diary" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} /> Project Diary & Attendance
            </NavLink>
            <NavLink to="/guide/presentations" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Presentations & Marks
            </NavLink>
            <NavLink to="/guide/meetings" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Schedule Meetings
            </NavLink>
            <NavLink to="/guide/notices" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Group Notices
            </NavLink>
            <NavLink to="/guide/student-requests" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <MessageSquareQuote size={18} /> Student Inquiries
            </NavLink>
          </>
        )}

        {/* STUDENT NAVIGATION */}
        {user?.role === 'ROLE_STUDENT' && (
          <>
            <NavLink to="/student/dashboard" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/student/my-group" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> My Group & Guide
            </NavLink>
            <NavLink to="/student/my-project" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Layers size={18} /> My Project Details
            </NavLink>
            <NavLink to="/student/submissions" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FileCheck2 size={18} /> Document Submissions
            </NavLink>
            <NavLink to="/student/diary" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <BookOpen size={18} /> Project Diary & Work Log
            </NavLink>
            <NavLink to="/student/presentations" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} /> Presentations & Marks
            </NavLink>
            <NavLink to="/student/meetings" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Calendar size={18} /> Guide Meetings
            </NavLink>
            <NavLink to="/student/notices" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Bell size={18} /> Notices & Circulars
            </NavLink>
            <NavLink to="/student/requests" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <HelpCircle size={18} /> Ask Guide / Inquiries
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/change-password" onClick={handleNavClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
