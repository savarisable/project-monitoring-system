import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  CalendarCheck,
  FileCheck,
  Presentation,
  BookOpen,
  Volume2,
  FileBarChart,
  Shield,
  KeyRound
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const getNavLinks = () => {
    if (!user) return [];
    const role = user.role;

    if (role === 'ROLE_PROJECT_HEAD') {
      return [
        { path: '/head', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/head/projects', label: 'Projects', icon: FolderKanban },
        { path: '/head/groups', label: 'Groups', icon: Users },
        { path: '/head/allocation', label: 'Allocations', icon: UserCheck },
        { path: '/head/milestones', label: 'Milestones', icon: CalendarCheck },
        { path: '/head/presentations', label: 'Presentations', icon: Presentation },
        { path: '/head/notices', label: 'Notices', icon: Volume2 },
        { path: '/head/users', label: 'Users', icon: Shield },
        { path: '/head/reports', label: 'Reports', icon: FileBarChart },
      ];
    } else if (role === 'ROLE_GUIDE') {
      return [
        { path: '/guide', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/guide/submissions', label: 'Reviews', icon: FileCheck },
        { path: '/guide/meetings', label: 'Meetings', icon: CalendarCheck },
        { path: '/guide/diary', label: 'Diary Log', icon: BookOpen },
      ];
    } else if (role === 'ROLE_STUDENT') {
      return [
        { path: '/student', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/student/submissions', label: 'Submissions', icon: FileCheck },
        { path: '/student/meetings', label: 'Meetings', icon: CalendarCheck },
        { path: '/student/diary', label: 'Project Diary', icon: BookOpen },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role) => {
    if (role === 'ROLE_PROJECT_HEAD') return 'Project Head';
    if (role === 'ROLE_GUIDE') return 'Faculty Guide';
    return 'Student';
  };

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link to="/" className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                PMS Portal
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                2026-27
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Actions (Theme, Bell, Profile Avatar) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setNotificationOpen(true)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
              title="Notifications"
            >
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-sm flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[130px]">
                  {user?.name || 'User'}
                </span>
                <span className="text-[10px] text-cyan-400 font-medium leading-none mt-0.5">
                  {getRoleBadge(user?.role)}
                </span>
              </div>

              {/* Desktop Logout Button */}
              <button
                onClick={logout}
                className="hidden md:flex p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition ml-1"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-3 space-y-2 backdrop-blur-md">
          {/* User Info Card inside Drawer */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-sm text-white shadow-sm flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-cyan-400 font-medium">{getRoleBadge(user?.role)} &bull; 2026-27</p>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Password & Logout */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
            <Link
              to="/change-password"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
            >
              <KeyRound size={14} />
              <span>Change Password</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/40"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </nav>
  );
};

export default Navbar;
