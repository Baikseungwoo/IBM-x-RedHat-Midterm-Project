import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <div className="logo">
        <Link to="/">GIUT</Link>
      </div>
      <nav>
        <Link to="/recommend">행사 추천 코스</Link>
        <Link to="/events">행사 목록</Link>
        <Link to="/login">로그인</Link>
      </nav>
    </header>
  );
};

export default Header;