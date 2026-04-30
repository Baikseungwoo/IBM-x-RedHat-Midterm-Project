import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api'; 
import { KOREA_MAP_DATA } from '../../constants/mapData';
import EventCard from '../../components/EventCard'; 
import { useNavigate, Link } from 'react-router-dom';

const MainPage = () => {
  const [topEvents, setTopEvents] = useState([]); 
  const [regionEvents, setRegionEvents] = useState([]); 
  const [selectedRegion, setSelectedRegion] = useState("서울"); 
  const [slideIndex, setSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. [API 호출] 전국 인기 행사 TOP 10 ---
  const fetchTopTen = async () => {
    try {
      const res = await api.get('/api/events/top');
      if (res.data.success) {
        setTopEvents(res.data.events); 
      }
    } catch (err) {
      console.error("전국 TOP 10 로드 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. [API 호출] 특정 지역 인기 행사 TOP 3 ---
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

  // 좋아요/북마크 처리 핸들러
  const handleLike = async (e, contentId) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/api/events/${contentId}/likes/toggle`);
      if (res.data.success) {
        setTopEvents(prev => prev.map(ev => 
          ev.content_id === contentId ? { ...ev, like_count: res.data.like_count, is_liked: res.data.liked } : ev
        ));
      }
    } catch (err) { console.error(err); }
  };

  const handleBookmark = async (e, contentId) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/api/events/${contentId}/bookmarks/toggle`);
      if (res.data.success) {
        setTopEvents(prev => prev.map(ev => 
          ev.content_id === contentId ? { ...ev, is_bookmarked: res.data.bookmarked } : ev
        ));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchTopTen();
    fetchRegionTopThree("서울");
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
    fetchRegionTopThree(name);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] p-4 md:p-10 overflow-x-hidden">
      
      {/* --- 상단: 자동 슬라이드 인기 행사 (전체 TOP 10) --- */}
      <section className="max-w-[1440px] mx-auto mb-16 relative">
        <div className="flex justify-between items-end mb-8 px-4">
          <h2 className="text-[#0369A1] font-bold text-2xl flex items-center gap-2 font-noto">
            <span className="text-3xl">🔥</span> 실시간 인기 축제 TOP 10
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${slideIndex === 0 ? 'bg-[#0369A1] w-8' : 'bg-white/40'}`} />
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${slideIndex === 1 ? 'bg-[#0369A1] w-8' : 'bg-white/40'}`} />
            </div>
            <div className="flex gap-3">
              <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/60 flex items-center justify-center text-[#0369A1] shadow-lg transition-all active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/60 flex items-center justify-center text-[#0369A1] shadow-lg transition-all active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
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
                <div key={event.content_id} className="min-w-[20%] p-3">
                  <EventCard 
                    event={event} 
                    onClick={() => navigate(`/events/${event.content_id}`)}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                  />
                </div>
              ))
            ) : (
              [1,2,3,4,5].map(i => <div key={i} className="min-w-[20%] p-3 h-80 bg-white/20 animate-pulse rounded-[24px]"></div>)
            )}
          </div>
        </div>
      </section>

      {/* --- 메인 콘텐츠: 리스트 & 지도 --- */}
      <section className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-16 px-4">
        <div className="w-full lg:w-[42%] lg:sticky lg:top-10">
          {/* 폰트 사이즈 대폭 키움 (text-4xl, text-xl) */}
          <div className="mb-12 pl-4">
            <h2 className="text-4xl font-black text-[#0369A1] leading-tight mb-5 tracking-tight">
              어디로 가야 할지 고민될 때,<br />
              GIUT을 켜보세요
            </h2>
            <p className="text-xl text-gray-600 font-semibold leading-relaxed opacity-80">
              지도를 눌러 지역별 행사를<br />
              한눈에 찾아보세요!
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-3xl rounded-[56px] p-12 shadow-2xl border border-white/50 min-h-[600px] flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-[2px] bg-blue-400"></span>
              <p className="text-blue-500 font-black text-sm tracking-[0.2em]">LOCAL BEST</p>
            </div>
            
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-5xl font-black text-[#0369A1] tracking-tight">
                {selectedRegion} <span className="text-3xl font-light opacity-60 ml-2">TOP 3</span>
              </h3>
              
              {/* 🔴 더보기 클릭 시 해당 지역 파라미터를 들고 이동함 */}
              <Link 
                to={`/events?region=${encodeURIComponent(selectedRegion)}`}
                className="text-gray-400 hover:text-[#0369A1] transition-colors text-base font-bold flex items-center gap-1 group"
              >
                더보기 <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            
            <div className="space-y-8 flex-1">
              {regionEvents.length > 0 ? (
                regionEvents.map((event, idx) => (
                  <div key={event.content_id} className="flex gap-6 bg-white/90 p-6 rounded-[36px] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all border border-blue-50 group cursor-pointer" onClick={() => navigate(`/events/${event.content_id}`)}>
                    <div className="relative w-28 h-28 rounded-[28px] overflow-hidden flex-shrink-0 shadow-md">
                      <img src={event.first_image || "https://via.placeholder.com/200x200?text=No+Image"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-blue-500 font-black italic text-sm mb-1">RANK 0{idx + 1}</span>
                      <h5 className="text-[#0369A1] font-bold text-lg leading-tight line-clamp-1">{event.title}</h5>
                      <p className="text-xs text-gray-400 mt-3 font-medium flex items-center gap-1">
                        🗓️ {event.start_date} ~ {event.end_date}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 font-bold">진행 중인 행사가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[60%] flex justify-center items-center py-10">
          <div className="relative w-full max-w-[1000px] aspect-[1488/1760]">
            <img src="/map.png" className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl" alt="" />
            <svg viewBox="0 0 1488 1760" className="absolute inset-0 w-full h-full z-20 overflow-visible">
              {KOREA_MAP_DATA.map((region) => (
                <path 
                  key={region.id}
                  d={region.d} 
                  onClick={() => handleRegionClick(region.name)}
                  className={`cursor-pointer transition-all duration-500 outline-none hover:fill-white/30 hover:stroke-white hover:stroke-[4px] ${selectedRegion === region.name ? 'fill-white/25 stroke-white stroke-[5px] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'fill-transparent stroke-transparent'}`}
                />
              ))}
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;