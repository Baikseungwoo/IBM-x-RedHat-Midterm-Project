import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './pages/Main/MainPage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import MyPage from './pages/MyPage/MyPage';
import EventList from './pages/EventList/EventList';
import EventDetail from './pages/EventDetail/EventDetail';
import RecommendPage from './pages/RecommedPage/RecommedPage'; 
import './App.css';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { AuthProvider } from './contexts/AuthContext'; 
import MainLayout from './components/MainLayout';
import HeaderLayout from './components/HeaderLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<HeaderLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/recommend" element={<RecommendPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;