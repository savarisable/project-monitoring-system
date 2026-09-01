// REST API Client for Project Monitoring System

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type for multipart FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      removeToken();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    let data = {};
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Backend server unreachable (HTTP ${response.status}). Please ensure the Spring Boot backend is running on port 8080.`);
    }

    if (!response.ok || !data.success) {
      const errorMsg = data.message || data.error || (response.status === 500 ? 'Backend service unavailable or error. Please check that Spring Boot is running on port 8080.' : `Request failed with status ${response.status}`);
      throw new Error(errorMsg);
    }

    return data.data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error);
    throw error;
  }
};

export const api = {
  // --------------------------------------------------------------------------
  // AUTH
  // --------------------------------------------------------------------------
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  changePassword: (data) => request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMe: () => request('/auth/me'),

  // --------------------------------------------------------------------------
  // PROJECT HEAD
  // --------------------------------------------------------------------------
  head: {
    getStats: (academicYearId) => request(`/head/dashboard-stats${academicYearId ? `?academicYearId=${academicYearId}` : ''}`),
    
    getUsers: (role, search) => {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (search) params.append('search', search);
      return request(`/head/users?${params.toString()}`);
    },
    createUser: (data) => request('/head/users', { method: 'POST', body: JSON.stringify(data) }),
    toggleUserStatus: (id) => request(`/head/users/${id}/toggle-status`, { method: 'PATCH' }),
    resetPassword: (id, newPassword) => request(`/head/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    }),

    getGuides: () => request('/head/guides'),
    getStudents: (academicYearId) => request(`/head/students${academicYearId ? `?academicYearId=${academicYearId}` : ''}`),

    getGroups: (academicYearId) => request(`/head/groups${academicYearId ? `?academicYearId=${academicYearId}` : ''}`),
    createGroup: (data) => request('/head/groups', { method: 'POST', body: JSON.stringify(data) }),
    allocateGuide: (data) => request('/head/allocate-guide', { method: 'POST', body: JSON.stringify(data) }),

    getProjects: (academicYearId) => request(`/head/projects${academicYearId ? `?academicYearId=${academicYearId}` : ''}`),
    createProject: (data) => request('/head/projects', { method: 'POST', body: JSON.stringify(data) }),

    getMilestones: (academicYearId) => request(`/head/milestones${academicYearId ? `?academicYearId=${academicYearId}` : ''}`),
    saveMilestone: (data) => request('/head/milestones', { method: 'POST', body: JSON.stringify(data) }),
    configurePresentations: (data) => request('/head/configure-presentations', { method: 'POST', body: JSON.stringify(data) }),

    getNotices: () => request('/head/notices'),
    createNotice: (data) => request('/head/notices', { method: 'POST', body: JSON.stringify(data) }),

    getReports: (type, academicYearId, guideId, status) => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (academicYearId) params.append('academicYearId', academicYearId);
      if (guideId) params.append('guideId', guideId);
      if (status) params.append('status', status);
      return request(`/head/reports?${params.toString()}`);
    },

    deleteUser: (id) => request(`/head/users/${id}`, { method: 'DELETE' }),
    deleteGroup: (id) => request(`/head/groups/${id}`, { method: 'DELETE' }),
    removeStudentFromGroup: (groupId, studentId) => request(`/head/groups/${groupId}/members/${studentId}`, { method: 'DELETE' }),
    addStudentToGroup: (groupId, studentId, isLeader) => request(`/head/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ studentId, isLeader }),
    }),

    getAuditLogs: () => request('/head/audit-logs'),
  },

  // --------------------------------------------------------------------------
  // GUIDE
  // --------------------------------------------------------------------------
  guide: {
    getStats: () => request('/guide/dashboard-stats'),
    getMyGroups: () => request('/guide/my-groups'),
    getProjectDetails: (id) => request(`/guide/projects/${id}`),

    getSubmissions: () => request('/guide/submissions'),
    getAllDepartmentSubmissions: () => request('/guide/all-submissions'),
    markOffline: (data) => request('/guide/submissions/mark-offline', { method: 'POST', body: JSON.stringify(data) }),
    reviewSubmission: (data) => request('/guide/submissions/review', { method: 'POST', body: JSON.stringify(data) }),

    getPresentations: () => request('/guide/presentations'),
    evaluatePresentation: (id, data) => request(`/guide/presentations/${id}/evaluate`, { method: 'POST', body: JSON.stringify(data) }),

    getMeetings: () => request('/guide/meetings'),
    createMeeting: (data) => request('/guide/meetings', { method: 'POST', body: JSON.stringify(data) }),

    getDiary: (groupId) => request(`/guide/diary${groupId ? `?groupId=${groupId}` : ''}`),
    createDiary: (data) => request('/guide/diary', { method: 'POST', body: JSON.stringify(data) }),
    deleteDiary: (id) => request(`/guide/diary/${id}`, { method: 'DELETE' }),

    getStudentWorkLogs: (groupId) => request(`/guide/groups/${groupId}/student-work-logs`),
    verifyStudentWorkLog: (logId, guideRemark) => request(`/guide/student-work-logs/${logId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ guideRemark }),
    }),

    createNotice: (data) => request('/guide/notices', { method: 'POST', body: JSON.stringify(data) }),

    getStudentRequests: () => request('/guide/student-requests'),
    respondStudentRequest: (id, response) => request(`/guide/student-requests/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }),
  },

  // --------------------------------------------------------------------------
  // STUDENT
  // --------------------------------------------------------------------------
  student: {
    getStats: () => request('/student/dashboard-stats'),
    getMyGroup: () => request('/student/my-group'),
    getMyProject: () => request('/student/my-project'),

    getSubmissions: () => request('/student/submissions'),
    uploadSubmission: (projectMilestoneId, studentNotes, file) => {
      const formData = new FormData();
      formData.append('projectMilestoneId', projectMilestoneId);
      if (studentNotes) formData.append('studentNotes', studentNotes);
      formData.append('file', file);

      return request('/student/submissions/upload', {
        method: 'POST',
        body: formData,
      });
    },

    getDiary: () => request('/student/diary'),
    getWorkLogs: () => request('/student/diary/work-logs'),
    createWorkLog: (data) => request('/student/diary/work-logs', { method: 'POST', body: JSON.stringify(data) }),
    deleteWorkLog: (id) => request(`/student/diary/work-logs/${id}`, { method: 'DELETE' }),

    getPresentations: () => request('/student/presentations'),
    getMeetings: () => request('/student/meetings'),
    getNotices: () => request('/student/notices'),

    getMyRequests: () => request('/student/my-requests'),
    sendRequest: (data) => request('/student/send-request', { method: 'POST', body: JSON.stringify(data) }),
  },

  // --------------------------------------------------------------------------
  // COMMON
  // --------------------------------------------------------------------------
  common: {
    getFeedbackTemplates: () => request('/common/feedback-templates'),
    getAcademicYears: () => request('/common/academic-years'),
    getNotifications: () => request('/common/notifications'),
    getUnreadCount: () => request('/common/notifications/unread-count'),
    markNotifRead: (id) => request(`/common/notifications/${id}/read`, { method: 'PATCH' }),
    markAllNotifsRead: () => request('/common/notifications/mark-all-read', { method: 'PATCH' }),
    getFileDownloadUrl: (versionId) => `/api/files/download/${versionId}`,
  }
};
