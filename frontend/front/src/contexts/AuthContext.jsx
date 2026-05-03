import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get('/api/users/me');

        if (response.data.success === true) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchMe();
  }, []);

  const checkNickname = async (nickname) => {
    try {
      const response = await api.get(`/api/auth/check-nickname?nickname=${nickname}`);
      return response.data.duplicated;
    } catch (error) {
      console.error('닉네임 중복 확인 에러:', error);
      throw error;
    }
  };

  const checkEmail = async (email) => {
    try {
      const response = await api.get(`/api/auth/check-email?email=${email}`);
      return response.data.duplicated;
    } catch (error) {
      console.error('이메일 중복 확인 에러:', error);
      throw error;
    }
  };

  const signup = async (signupData) => {
    try {
      const response = await api.post('/api/auth/signup', signupData);

      if (response.data.success !== true) {
        throw new Error('회원가입 실패');
      }

      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('회원가입 에러:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (response.data.success === true) {
        setUser(response.data.user);
        return true;
      }

      throw new Error('로그인 실패');
    } catch (error) {
      console.error('로그인 에러:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        authLoading,
        login,
        logout,
        checkNickname,
        checkEmail,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
