import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header'
import Footer from './components/Footer';
import MainPage from './pages/Main/MainPage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import MyPage from './pages/MyPage/MyPage';
import EventList from './pages/EventList/EventList';
import EventDetail from './pages/EventDetail/EventDetail';
import RecommendPage from './pages/RecommedPage/RecommedPage'; 
import './App.css';
import { AuthContext } from './contexts/AuthContext';


  return (

    <Router>

      <div className="App">
      
        <Header/>

        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/recommend" element={<RecommendPage />} />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </Router>

  );


export default App;