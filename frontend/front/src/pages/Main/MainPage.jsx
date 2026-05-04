import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { KOREA_MAP_DATA } from '../../constants/mapData';
import EventCard from '../../components/EventCard';
import { useNavigate, Link } from 'react-router-dom';
import BookmarkToast from '../../components/BookmarkToast';
import { useAuth } from '../../contexts/AuthContext';
import LoginRequiredModal from '../../components/LoginRequiredModal';

const MainPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [topEvents, setTopEvents] = useState([]);
  const [regionEvents, setRegionEvents] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [clickedRegion, setClickedRegion] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [bookmarkToastOpen, setBookmarkToastOpen] = useState(false);
  const [bookmarkToastState, setBookmarkToastState] = useState(false);

  const fetchTopTen = async () => {
    try {
      const res = await api.get('/api/events/top');
      if (res.data.success) {
        setTopEvents(res.data.events);
      }
    } catch (err) {
      console.error('전국 TOP 10 로드 에러:', err);
    }
  };

  const fetchRegionTopThree = async (regionName) => {
    try {
      const res = await api.get(`/api/events/regions/${regionName}/top`);
      if (res.data.success) {
        setRegionEvents(res.data.events);
      }
    } catch (err) {
      console.error(`${regionName} TOP 3 로드 에러:`, err);
      setRegionEvents([]);
    }
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };

  const handleLike = async (e, contentId) => {
    e.stopPropagation();

    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${contentId}/likes/toggle`);
      if (res.data.success) {
        setTopEvents((prev) =>
          prev.map((ev) =>
            ev.content_id === contentId
              ? { ...ev, like_count: res.data.like_count, is_liked: res.data.liked }
              : ev
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (e, contentId) => {
    e.stopPropagation();

    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${contentId}/bookmarks/toggle`);
      if (res.data.success) {
        setTopEvents((prev) =>
          prev.map((ev) =>
            ev.content_id === contentId
              ? {
                  ...ev,
                  bookmark_count: res.data.bookmark_count,
                  is_bookmarked: res.data.bookmarked,
                }
              : ev
          )
        );

        setBookmarkToastState(res.data.bookmarked);
        setBookmarkToastOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopTen();
    fetchRegionTopThree('서울');
  }, []);

  const nextSlide = useCallback(() => {
    setSlideIndex((prev) => (prev === 0 ? 1 : 0));
  }, []);

  const prevSlide = () => {
    setSlideIndex((prev) => (prev === 1 ? 0 : 1));
  };

  useEffect(() => {
    if (topEvents.length > 5) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [nextSlide, topEvents]);

  const handleRegionClick = (name) => {
    setSelectedRegion(name);
    setClickedRegion(name);
    fetchRegionTopThree(name);

    setTimeout(() => {
      setClickedRegion(null);
    }, 450);
  };

  return (
    <>
      <div className="relative w-full min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#FFF7D6_0%,#DFF7FF_42%,#B7E8FF_72%,#A7D8FF_100%)] p-4 md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[6%] top-16 h-48 w-48 rounded-full bg-yellow-200/45 blur-3xl" />
          <div className="absolute right-[8%] top-40 h-64 w-64 rounded-full bg-pink-200/35 blur-3xl" />
          <div className="absolute bottom-24 left-[36%] h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        </div>

        <div className="relative z-10">
          <section className="max-w-[1440px] mx-auto mb-16 relative">
            <div className="flex justify-between items-end mb-8 px-4">
              <div>
                <p className="mb-2 text-[15px] font-black uppercase tracking-[0.24em] text-sky-600">
                  🔥 Festival Hot Picks
                </p>
                <h2 className="text-2xl font-black text-[#0369A1] md:text-3xl">
                지금 가장 뜨거운 축제 TOP 10
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex gap-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      slideIndex === 0 ? 'w-8 bg-[#0369A1]' : 'w-2 bg-white/50'
                    }`}
                  />
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      slideIndex === 1 ? 'w-8 bg-[#0369A1]' : 'w-2 bg-white/50'
                    }`}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-[#0369A1] shadow-lg transition-all active:scale-90"
                    aria-label="이전"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-[#0369A1] shadow-lg transition-all active:scale-90"
                    aria-label="다음"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden px-2">
              <div
                className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              >
                {topEvents.length > 0 ? (
                  topEvents.map((event) => (
                    <div key={event.content_id} className="min-w-full p-3 sm:min-w-[50%] md:min-w-[33.333%] xl:min-w-[20%]">
                      <EventCard
                        event={event}
                        onClick={() => navigate(`/events/${event.content_id}`)}
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                      />
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="min-w-full p-3 sm:min-w-[50%] md:min-w-[33.333%] xl:min-w-[20%]"
                    >
                      <div className="h-80 rounded-[24px] bg-white/30 animate-pulse" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] items-start gap-10 xl:gap-14 px-4">
            <div className="w-full xl:sticky xl:top-10">
              <div className="mb-8 md:mb-10 pl-0 sm:pl-4">
                

                <h2 className="text-3xl md:text-4xl font-black text-[#0369A1] leading-tight mb-5 tracking-tight">
                  이번 주말,<br />
                  어디 축제 갈까요?
                </h2>

                <p className="text-lg md:text-xl text-gray-600 font-semibold leading-relaxed opacity-80">
                  지도를 눌러 지역별 인기 행사를<br />
                  한눈에 둘러보세요.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[36px] md:rounded-[48px] border border-white/70 bg-white/65 p-6 shadow-2xl shadow-sky-200/50 backdrop-blur-3xl sm:p-8 xl:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-200/45 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-[2px] bg-blue-400" />
                    <p className="text-blue-500 font-black text-sm tracking-[0.2em]">LOCAL BEST</p>
                  </div>

                  <div className="flex justify-between items-center gap-4 mb-8 xl:mb-10">
                    <h3 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#0369A1] tracking-tight">
                      {selectedRegion}
                      <span className="block sm:inline text-2xl sm:text-3xl font-light opacity-60 sm:ml-2">
                        TOP 3
                      </span>
                    </h3>

                    <Link
                      to={`/events?region=${encodeURIComponent(selectedRegion)}`}
                      className="text-gray-400 hover:text-[#0369A1] transition-colors text-base font-bold flex items-center gap-1 group"
                    >
                      더보기
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>

                  <div className="space-y-5 xl:space-y-6">
                    {regionEvents.length > 0 ? (
                      regionEvents.map((event, idx) => (
                        <div
                          key={event.content_id}
                          className="group relative flex cursor-pointer gap-4 overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-lg shadow-sky-100/60 transition-all hover:-translate-y-1.5 hover:bg-white hover:shadow-2xl hover:shadow-sky-200/70 xl:gap-5 xl:p-5"
                          onClick={() => navigate(`/events/${event.content_id}`)}
                        >
                          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-pink-300 via-yellow-200 to-emerald-300" />

                          <div className="relative w-24 h-24 xl:w-28 xl:h-28 rounded-[24px] xl:rounded-[28px] overflow-hidden flex-shrink-0 shadow-md">
                            <img
                              src={event.first_image || 'https://via.placeholder.com/200x200?text=No+Image'}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              alt={event.title}
                            />
                          </div>

                          <div className="min-w-0 flex flex-col justify-center">
                            <span className="text-blue-500 font-black italic text-sm mb-1">
                              RANK 0{idx + 1}
                            </span>
                            <h5 className="text-[#0369A1] font-bold text-lg leading-tight line-clamp-1">
                              {event.title}
                            </h5>
                            <p className="text-xs text-gray-400 mt-3 font-medium">
                              기간 {event.start_date} ~ {event.end_date}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex min-h-[240px] items-center justify-center rounded-[28px] border border-dashed border-white/80 bg-white/45 text-gray-400 font-bold">
                        진행 중인 행사가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full min-w-0 flex justify-center items-start xl:items-center py-4 xl:py-10">
              <div className="relative w-full max-w-[min(920px,92vw)] xl:max-w-[min(920px,100%)] aspect-[1488/1760]">
                <div className="pointer-events-none absolute left-1/2 top-[46%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />
                <div className="pointer-events-none absolute right-[8%] top-[12%] h-28 w-28 rounded-full bg-yellow-200/60 blur-2xl" />

                
                <img
                  src="/map.png"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                  alt="대한민국 지도"
                />

                <svg viewBox="0 0 1488 1760" className="absolute inset-0 w-full h-full z-20 overflow-visible">
                  {KOREA_MAP_DATA.map((region) => (
                    <path
                      key={region.id}
                      d={region.d}
                      onClick={() => handleRegionClick(region.name)}
                      className={`map-region ${
                        selectedRegion === region.name ? 'map-region-selected' : ''
                      } ${clickedRegion === region.name ? 'map-region-clicked' : ''}`}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </section>
        </div>
      </div>

      <BookmarkToast
        open={bookmarkToastOpen}
        bookmarked={bookmarkToastState}
        onClose={() => setBookmarkToastOpen(false)}
      />

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

export default MainPage;
