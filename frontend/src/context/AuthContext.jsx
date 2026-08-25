import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser({
            id: profile.id,
            username: profile.username,
            fullName: profile.fullName,
            role: profile.role,
            email: profile.email,
            phone: profile.phone,
            profileDetails: profile.profileDetails,
          });

          // Fetch academic years
          const years = await api.common.getAcademicYears();
          setAcademicYears(years);
          const currentYear = years.find((y) => y.current) || years[0];
          if (currentYear) setSelectedYearId(currentYear.id);

          // Fetch unread notifications
          const count = await api.common.getUnreadCount();
          setUnreadNotifsCount(count);
        } catch (error) {
          console.error('Session initialization failed:', error);
          removeToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const response = await api.login({ username, password });
    setToken(response.accessToken);
    setTokenState(response.accessToken);

    const userObj = {
      id: response.userId,
      username: response.username,
      fullName: response.fullName,
      role: response.role,
      email: response.email,
      phone: response.phone,
      referenceId: response.referenceId,
      groupId: response.groupId,
    };
    setUser(userObj);

    // Fetch initial notifications count
    try {
      const count = await api.common.getUnreadCount();
      setUnreadNotifsCount(count);
      const years = await api.common.getAcademicYears();
      setAcademicYears(years);
      const currentYear = years.find((y) => y.current) || years[0];
      if (currentYear) setSelectedYearId(currentYear.id);
    } catch (e) {
      console.warn('Post-login sync note:', e);
    }

    return userObj;
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    await api.changePassword({ currentPassword, newPassword, confirmNewPassword });
  };

  const refreshUnreadCount = async () => {
    if (token) {
      try {
        const count = await api.common.getUnreadCount();
        setUnreadNotifsCount(count);
      } catch (e) {}
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    unreadNotifsCount,
    academicYears,
    selectedYearId,
    setSelectedYearId,
    login,
    logout,
    changePassword,
    refreshUnreadCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
