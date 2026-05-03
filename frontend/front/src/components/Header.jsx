import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import LoginRequiredModal from './LoginRequiredModal';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await api.get('/api/events/autocomplete', {
            params: { keyword: searchQuery },
          });

          if (res.data.success && res.data.events.length > 0) {
            setSuggestions(res.data.events);
            setIsSuggestOpen(true);
          } else {
            setSuggestions([]);
            setIsSuggestOpen(false);
          }
        } catch (err) {
          console.error('자동완성 에러:', err);
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

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/events?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSuggestOpen(false);
    }
  };

  const handleItemClick = (contentId) => {
    navigate(`/events/${contentId}`);
    setSearchQuery('');
    setIsSuggestOpen(false);
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    setIsModalOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    setIsModalOpen(false);
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-[1000] w-full border-b border-white/50 bg-white/75 shadow-lg shadow-sky-100/40 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />

        <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
          {/* 로고 */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="group flex shrink-0 items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 shadow-lg shadow-sky-300/40 transition group-hover:-translate-y-0.5 group-hover:rotate-3">
                <div className="absolute inset-1 rounded-[14px] bg-white/35" />
                <span className="relative text-xl font-black text-white drop-shadow-sm">
                  G
                </span>
              </div>

              <div className="leading-none">
                <span className="block text-[28px] font-black tracking-tight text-[#0369A1]">
                  GIUT
                </span>
                <span className="hidden text-[10px] font-black uppercase tracking-[0.22em] text-sky-500 sm:block">
                  Festival Guide
                </span>
              </div>
            </Link>
          </div>

          {/* 검색 먼저, nav 나중 */}
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 md:flex">
            <div className="relative w-full max-w-[560px]">
              <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                  <svg
                    className="h-5 w-5 text-sky-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="가고 싶은 축제나 지역을 검색해보세요"
                  className="h-12 w-full rounded-full border border-white/80 bg-white/75 pl-12 pr-24 text-sm font-semibold text-gray-700 shadow-lg shadow-sky-100/60 outline-none backdrop-blur transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && suggestions.length > 0 && setIsSuggestOpen(true)}
                />

                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-black text-white shadow-md transition hover:bg-[#0369A1] active:scale-95"
                >
                  검색
                </button>
              </form>

              {isSuggestOpen && (
                <div className="absolute left-1/2 top-[58px] z-[9999] w-full max-w-[560px] -translate-x-1/2 overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl shadow-sky-200/40 backdrop-blur-xl">
                  <div className="border-b border-gray-100 px-5 py-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-500">
                      Search Result
                    </p>
                  </div>

                  <ul className="max-h-80 overflow-y-auto p-2">
                    {suggestions.map((item) => (
                      <li
                        key={item.content_id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleItemClick(item.content_id);
                        }}
                        className="group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-sky-50"
                      >
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="h-full w-full object-cover transition group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-sky-100 to-cyan-100" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-gray-800 transition group-hover:text-[#0369A1]">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs font-bold text-gray-400">
                            {item.region || '지역 정보 없음'}
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-sky-500 shadow-sm">
                          보기
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <nav className="hidden shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/45 p-1 shadow-sm backdrop-blur lg:flex">
              <Link
                to="/events"
                className="rounded-full px-5 py-2.5 text-sm font-black text-gray-600 transition hover:bg-white hover:text-[#0369A1] hover:shadow-sm"
              >
                행사 목록
              </Link>

              <Link
                to="/recommend"
                className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-sky-300/35 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                AI 여행 코스
              </Link>
            </nav>
          </div>

          

          <div className="flex shrink-0 items-center gap-3">
            {!isLoggedIn && (
              <Link
                to="/login"
                className="hidden rounded-full border border-white/70 bg-white/55 px-5 py-2.5 text-sm font-black text-gray-700 shadow-sm transition hover:bg-white hover:text-[#0369A1] sm:block"
              >
                로그인
              </Link>
            )}

            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/55 text-gray-600 shadow-sm transition hover:bg-white hover:text-[#0369A1] active:scale-95"
              aria-label="알림"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex h-11 items-center gap-2 rounded-full border border-white/70 bg-white/55 p-1.5 pr-3 text-gray-700 shadow-sm transition hover:bg-white active:scale-95"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 text-sm font-black text-white">
                  {isLoggedIn && user?.image_data ? (
                    <img
                      src={
                        user.image_data.startsWith('data:')
                          ? user.image_data
                          : `data:image/png;base64,${user.image_data}`
                      }
                      alt={user?.nickname || '프로필'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{isLoggedIn ? (user?.nickname || 'U').slice(0, 1) : 'U'}</span>
                  )}
                </div>

                <span className="hidden max-w-[90px] truncate text-sm font-black md:block">
                  {isLoggedIn ? user?.nickname || '사용자' : 'Guest'}
                </span>

                <svg className="hidden h-4 w-4 text-gray-400 md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLoggedIn && isModalOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-[24px] border border-white/80 bg-white/95 shadow-2xl shadow-sky-200/40 backdrop-blur-xl">
                  <div className="bg-gradient-to-r from-sky-50 to-cyan-50 px-5 py-4">
                    <p className="text-sm font-black text-gray-900">
                      {user?.nickname || '사용자'}
                    </p>
                    <p className="mt-1 text-xs font-bold text-sky-500">
                      나의 축제 여행
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/mypage');
                        setIsModalOpen(false);
                      }}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-gray-700 transition hover:bg-sky-50 hover:text-[#0369A1]"
                    >
                      마이페이지
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-rose-500 transition hover:bg-rose-50"
                    >
                      로그아웃
                    </button>
                  </div>
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
