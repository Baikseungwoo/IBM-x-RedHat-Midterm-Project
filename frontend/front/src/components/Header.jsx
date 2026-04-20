import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('search bar');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery !== 'search bar') {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* [변경 포인트] 
          1. max-w-7xl (약 1280px)을 설정하여 너무 양 끝으로 벌어지지 않게 막음 
          2. mx-auto로 중앙 정렬
      */}
      <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center justify-between">
        
        {/* --- [왼쪽 그룹] 로고 + 검색창 + 메뉴 --- */}
        <div className="flex items-center space-x-12">
          
          {/* 1. 로고 (GIUT) */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-3xl font-bold text-gray-900 tracking-tight text-[32px]">GIUT</span>
          </Link>

          {/* 2. 검색창 */}
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <div className="flex items-center">
              <input
                type="text"
                className="w-80 bg-[#E9E9E9] border border-gray-300 rounded-l px-4 py-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery === 'search bar' && setSearchQuery('')}
              />
              
              {searchQuery && searchQuery !== 'search bar' && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <button type="submit" className="bg-[#E9E9E9] border border-l-0 border-gray-300 rounded-r px-3 py-[9px] hover:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 3. 메뉴 (검색창 옆 배치) */}
          <nav className="hidden md:flex items-center space-x-10 text-base font-medium text-gray-800">
            <Link to="/recommend" className="hover:text-blue-600 transition-colors whitespace-nowrap">여행 코스 AI 추천</Link>
            <Link to="/events" className="hover:text-blue-600 transition-colors whitespace-nowrap">행사 목록</Link>
          </nav>
        </div>

        {/* --- [오른쪽 그룹] 로그인 + 알림 + 프로필 --- */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          <Link to="/login" className="text-base font-medium text-gray-800 hover:text-blue-600 mr-2">
            로그인
          </Link>

          <button className="relative w-12 h-10 bg-[#E9E9E9] rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <Link to="/mypage" className="hover:opacity-80 transition-opacity text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;