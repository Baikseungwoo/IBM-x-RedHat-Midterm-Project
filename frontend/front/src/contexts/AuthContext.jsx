import React, { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //닉네임 중복확인
  const checkNickname = async (nickname) =>{
    try{
      const response = await api.get(`/api/auth/check-nickname?nickname=${nickname}`);
      return response.data.duplicated;
    } catch (error) {
      console.error("닉네임 중복 확인 에러 : ", error);
      throw error;
    }
  }

  //이메일 중복확인
  const checkEmail = async (email) =>{
    try{
      const response = await api.get(`/api/auth/check-email?email=${email}`);
      return response.data.duplicated;
    } catch (error) {
      console.error("이메일 중복 확인 에러 : ", error);
      throw error;
    }
  }

  //회원가입
  const signup = async (signupData) =>{
    try{
      const response = await api.post("/api/auth/signup", signupData);
      if(response.data.success !== true){
        throw new Error("회원가입 실패");
      }
      return response.data;
    } catch (error) {
      console.error("회원가입 에러 : ", error);
      throw error;
    }
  }

  //로그인
  const login = async (email, password) =>{
    try{
      const response = await api.post('/api/auth/login', {email, password})

      if(response.data.success === true){
        setUser(response.data.user);
        return true;
      } else {
        throw new Error("로그인 정보 불일치");
      } 
    } catch (error) {
        console.error("로그인 에러 : ", error);
        throw error;
    }

  }
  //로그아웃
  const logout = () => {
    setUser(null);
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout, checkNickname, checkEmail, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);