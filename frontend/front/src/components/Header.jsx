import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import LoginRequiredModal from './LoginRequiredModal';


const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]); 
  const [isSuggestOpen, setIsSuggestOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); // 프로필 모달 상태
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);





  // 🔍 실시간 자동완성 로직
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await api.get(`/api/events/autocomplete`, {
            params: { keyword: searchQuery }
          });
          
          if (res.data.success && res.data.events.length > 0) {
            setSuggestions(res.data.events);
            setIsSuggestOpen(true);
          } else {
            setSuggestions([]);
            setIsSuggestOpen(false);
          }
        } catch (err) {
          console.error("자동완성 에러:", err);
          setSuggestions([]);
          setIsSuggestOpen(false);
        }
      } else {
        setSuggestions([]);
        setIsSuggestOpen(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 엔터 시 목록 페이지 이동
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSuggestOpen(false);
    }
  };

  // 추천 항목 클릭 시 상세 페이지 이동
  const handleItemClick = (contentId) => {
    navigate(`/events/${contentId}`);
    setSearchQuery('');
    setIsSuggestOpen(false);
  };

  // 프로필 클릭 핸들러 (복구)
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    setIsModalOpen(!isModalOpen);
  };


  const handleLogout = async () => {
    await logout();
    setIsModalOpen(false);
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-[1000]">
        <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex-shrink-0">
              <span className="text-3xl font-bold text-gray-900 tracking-tight text-[32px]">
                GIUT
              </span>
            </Link>

            <div className="relative block">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="가고 싶은 행사를 검색해 보세요"
                  className="w-80 bg-white border border-gray-200 rounded-l-xl px-5 py-2.5 text-sm text-gray-700 outline-none shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all duration-300 focus:border-2 focus:border-blue-500 focus:shadow-xl focus:w-[340px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && suggestions.length > 0 && setIsSuggestOpen(true)}
                />

                <button
                  type="submit"
                  className="bg-white border border-gray-200 border-l-0 rounded-r-xl px-4 py-[11px] shadow-[4px_2px_10px_rgba(0,0,0,0.05)]"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>

              {isSuggestOpen && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-b-2xl shadow-2xl z-[9999] mt-1 overflow-hidden">
                  <ul className="max-h-80 overflow-y-auto py-2">
                    {suggestions.map((item) => (
                      <li
                        key={item.content_id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleItemClick(item.content_id);
                        }}
                        className="px-5 py-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex justify-between items-center group"
                      >
                        <span className="font-bold truncate group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-300 whitespace-nowrap ml-2">
                          상세보기
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <nav className="hidden md:flex items-center space-x-10 text-base font-medium text-gray-800">
              <Link to="/recommend" className="hover:text-blue-600 transition-colors whitespace-nowrap">
                여행 코스 AI 추천
              </Link>
              <Link to="/events" className="hover:text-blue-600 transition-colors whitespace-nowrap">
                행사 목록
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6 flex-shrink-0">
            {!isLoggedIn && (
              <Link to="/login" className="text-base font-medium text-gray-800 hover:text-blue-600 mr-2">
                로그인
              </Link>
            )}

            <button className="relative w-12 h-10 bg-[#E9E9E9] rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={handleProfileClick}
                className="hover:opacity-80 transition-opacity text-gray-800 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 ${isLoggedIn ? 'text-blue-600' : 'text-gray-800'}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isLoggedIn && isModalOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-[1001] py-2">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-400 font-medium">
                      {user?.nickname || '사용자'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigate('/mypage');
                      setIsModalOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    마이페이지
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isSuggestOpen && (
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsSuggestOpen(false)}
          />
        )}
      </header>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={() => {
          setLoginModalOpen(false);
          navigate('/login');
        }}
      />
    </>
  );

};

export default Header;