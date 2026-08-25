import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout, ProtectedRoute } from './components/Layout';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Project Head Pages
import { HeadDashboard } from './pages/head/HeadDashboard';
import { UserManagementPage } from './pages/head/UserManagementPage';
import { GroupManagementPage } from './pages/head/GroupManagementPage';
import { GuideAllocationPage } from './pages/head/GuideAllocationPage';
import { ProjectManagementPage } from './pages/head/ProjectManagementPage';
import { MilestoneConfigPage } from './pages/head/MilestoneConfigPage';
import { PresentationConfigPage, SubmissionsMonitoringPage } from './pages/head/PresentationConfigPage';
import { NoticesPage, ReportsPage, AuditLogsPage } from './pages/head/NoticesPage';

// Guide Pages
import { GuideDashboard, GuideGroupsPage } from './pages/guide/GuideDashboard';
import { GuideSubmissionsPage, GuidePresentationsPage } from './pages/guide/GuideSubmissionsPage';
import { GuideMeetingsPage, GuideNoticesPage, GuideStudentRequestsPage } from './pages/guide/GuideMeetingsPage';

// Student Pages
import { StudentDashboard, StudentGroupPage, StudentProjectPage } from './pages/student/StudentDashboard';
import { StudentSubmissionsPage, StudentPresentationsPage } from './pages/student/StudentSubmissionsPage';
import { StudentMeetingsPage, StudentNoticesPage, StudentRequestsPage } from './pages/student/StudentMeetingsPage';

const RootRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading application...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'ROLE_PROJECT_HEAD') return <Navigate to="/head/dashboard" replace />;
  if (user?.role === 'ROLE_GUIDE') return <Navigate to="/guide/dashboard" replace />;
  if (user?.role === 'ROLE_STUDENT') return <Navigate to="/student/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authenticated Layout Wrapped Routes */}
          <Route element={<Layout />}>
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* PROJECT HEAD ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_PROJECT_HEAD']} />}>
              <Route path="/head/dashboard" element={<HeadDashboard />} />
              <Route path="/head/users" element={<UserManagementPage />} />
              <Route path="/head/guides" element={<UserManagementPage />} />
              <Route path="/head/students" element={<UserManagementPage />} />
              <Route path="/head/groups" element={<GroupManagementPage />} />
              <Route path="/head/allocations" element={<GuideAllocationPage />} />
              <Route path="/head/projects" element={<ProjectManagementPage />} />
              <Route path="/head/milestones" element={<MilestoneConfigPage />} />
              <Route path="/head/presentations-config" element={<PresentationConfigPage />} />
              <Route path="/head/submissions" element={<SubmissionsMonitoringPage />} />
              <Route path="/head/notices" element={<NoticesPage />} />
              <Route path="/head/reports" element={<ReportsPage />} />
              <Route path="/head/audit-logs" element={<AuditLogsPage />} />
            </Route>

            {/* GUIDE ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_GUIDE']} />}>
              <Route path="/guide/dashboard" element={<GuideDashboard />} />
              <Route path="/guide/my-groups" element={<GuideGroupsPage />} />
              <Route path="/guide/submissions" element={<GuideSubmissionsPage />} />
              <Route path="/guide/presentations" element={<GuidePresentationsPage />} />
              <Route path="/guide/meetings" element={<GuideMeetingsPage />} />
              <Route path="/guide/notices" element={<GuideNoticesPage />} />
              <Route path="/guide/student-requests" element={<GuideStudentRequestsPage />} />
            </Route>

            {/* STUDENT ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/my-group" element={<StudentGroupPage />} />
              <Route path="/student/my-project" element={<StudentProjectPage />} />
              <Route path="/student/submissions" element={<StudentSubmissionsPage />} />
              <Route path="/student/presentations" element={<StudentPresentationsPage />} />
              <Route path="/student/meetings" element={<StudentMeetingsPage />} />
              <Route path="/student/notices" element={<StudentNoticesPage />} />
              <Route path="/student/requests" element={<StudentRequestsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
