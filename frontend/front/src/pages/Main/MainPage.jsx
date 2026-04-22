import React, { useState, useEffect } from 'react';
import api from '../../api'; 

const MainPage = () => {
  const [topEvents, setTopEvents] = useState([]); 
  const [regionEvents, setRegionEvents] = useState([]); 
  const [selectedRegion, setSelectedRegion] = useState("서울"); 
  const [loading, setLoading] = useState(true);

  // 1. 페이지 로드 시 전체 TOP 10 가져오기
  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const response = await api.get('/api/events/top');
        if (response.data.success) {
          setTopEvents(response.data.events);
        }
      } catch (error) {
        console.error("전체 인기 행사 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopEvents();
  }, []);

  // 2. 지역이 변경될 때마다 해당 지역 TOP 3 가져오기
  useEffect(() => {
    const fetchRegionEvents = async () => {
      try {
        const response = await api.get(`/api/events/regions/${selectedRegion}/top`);
        if (response.data.success) {
          setRegionEvents(response.data.events);
        }
      } catch (error) {
        console.error(`${selectedRegion} 인기 행사 로딩 실패:`, error);
      }
    };
    fetchRegionEvents();
  }, [selectedRegion]);

  // 지도의 특정 지역을 클릭했을 때 실행될 함수 (이미지 맵이나 SVG 연동 시 사용)
  const handleMapClick = (regionName) => {
    setSelectedRegion(regionName);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC] overflow-x-hidden">
      
      {/* 상단 섹션: 전체 지역 인기 행사 TOP 10 */}
      <section className="w-full pt-10 pb-6 px-10">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-sm font-bold text-[#0369A1] mb-4 ml-2 opacity-80 text-center md:text-left">현재 인기 행사들 (좋아요 순)</h2>
          <div className="flex justify-start items-center gap-6 overflow-x-auto pb-4 no-scrollbar">
            {topEvents.length > 0 ? (
              topEvents.map((event) => (
                <div key={event.content_id} className="min-w-[220px] bg-white/40 backdrop-blur-sm rounded-2xl p-2 border border-white/30 shadow-lg group cursor-pointer hover:bg-white/60 transition-all">
                  <div className="aspect-[16/9] bg-white/80 rounded-xl mb-2 shadow-inner overflow-hidden">
                    <img 
                      src={event.first_image || "https://via.placeholder.com/300x200?text=No+Image"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="px-1">
                    <p className="text-[#0369A1] font-bold text-sm truncate">{event.title}</p>
                    <p className="text-[#0369A1]/60 text-xs">{event.region} · ❤️ {event.like_count}</p>
                  </div>
                </div>
              ))
            ) : (
              /* 로딩 중이거나 데이터 없을 때 스켈레톤 */
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[200px] h-32 bg-white/20 animate-pulse rounded-2xl"></div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start justify-between relative px-10 py-10">
        
        {/* 왼쪽 섹션: 지역별 TOP 3 */}
        <div className="w-full lg:w-[35%] z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-[36px] font-extrabold text-[#0369A1] leading-[1.2] tracking-tight">
              어디로 가야 할지<br />
              고민될 때, GIUT
            </h1>
            <p className="text-[#075985] text-lg font-medium opacity-80">
              지도의 지역을 클릭하여<br />
              {selectedRegion} 축제 리스트를 확인하세요!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-lg rounded-[40px] p-10 w-full shadow-2xl border border-white/60">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-[24px] text-[#0369A1]">{selectedRegion} 인기 TOP 3</h3>
              <button className="text-sm text-blue-500 hover:text-blue-700 font-bold border-b-2 border-blue-200">더보기 &gt;</button>
            </div>
            
            <div className="space-y-6">
              {regionEvents.map((event, index) => (
                <div key={event.content_id} className="flex h-40 bg-white rounded-[24px] overflow-hidden shadow-md hover:scale-[1.04] transition-all border border-blue-50 group cursor-pointer">
                  <div className="w-2/5 overflow-hidden">
                    <img 
                      src={event.first_image || "https://via.placeholder.com/200x200?text=No+Image"} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="w-3/5 p-4 flex flex-col justify-center">
                    <span className="text-blue-400 font-black italic text-sm mb-1">RANK {index + 1}</span>
                    <h4 className="text-[#0369A1] font-bold text-base line-clamp-2">{event.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{event.start_date} ~ {event.end_date}</p>
                  </div>
                </div>
              ))}
              {regionEvents.length === 0 && <p className="text-center py-10 text-gray-400">진행 중인 행사가 없습니다.</p>}
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 지도 (클릭 이벤트 연동) */}
        <div className="w-full lg:w-[60%] flex items-center justify-center lg:justify-end pt-10">
          <div className="relative w-full max-w-[900px] flex justify-center items-center">
            {/* 실제 팀 프로젝트라면 여기에 <svg> 지도를 넣고 클릭 시 handleMapClick('인천') 등을 호출하면 최고입니다 */}
            <img 
              src="/map.png" 
              alt="Korea Map" 
              className="w-full h-auto object-contain drop-shadow-[0_25px_25px_rgba(3,105,161,0.2)]"
              onClick={() => handleMapClick('인천')} // 테스트용: 클릭하면 인천으로 변경
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;