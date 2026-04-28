import React, { useEffect, useState } from "react";
// import axios from "axios"; // FastAPI 연동 시 활성화
import EventCard from "../../components/EventCard";
import { useNavigate, useSearchParams } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [region, setRegion] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // 페이지네이션 관련
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8; // 한 페이지에 8개씩 (2줄)

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const regionParam = searchParams.get("region");

  useEffect(() => {
    if (regionParam) setRegion(regionParam);
  }, [regionParam]);

  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "인기순", value: "likes" },
    { label: "진행중", value: "ongoing" },
    { label: "종료됨", value: "ended" },
  ];

  const selectedSortLabel = sortOptions.find((opt) => opt.value === sort)?.label || "정렬";

  // --- [테스트용] 데이터 페칭 함수 (더미 데이터 주입) ---
  const fetchEvents = async () => {
    try {
      console.log("데이터 패칭 시도 중... 조건:", { region, keyword, page });
      
      // 로딩 감도를 위한 0.3초 대기
      await new Promise(resolve => setTimeout(resolve, 300));

      // 명세서 규격에 맞춘 8개의 더미 데이터 생성
      const mockEvents = Array.from({ length: pageSize }).map((_, i) => ({
        content_id: (page - 1) * pageSize + i + 1,
        title: `[${region}] ${keyword || "추천"} 행사 ${ (page - 1) * pageSize + i + 1 }`,
        region: region === "전체" ? "서울" : region,
        first_image: `https://picsum.photos/seed/${(page - 1) * pageSize + i + 100}/400/300`,
        start_date: startDate || "2026-05-01",
        end_date: endDate || "2026-05-20",
        like_count: Math.floor(Math.random() * 2000),
      }));

      setEvents(mockEvents);
      setTotalCount(40); // 총 40개 데이터가 있다고 가정 (5페이지 분량)
      console.log("더미 데이터 주입 완료!");
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setEvents([]);
    }
  };

  // 필터나 페이지가 바뀔 때마다 자동 실행
  useEffect(() => {
    fetchEvents();
  }, [region, keyword, sort, startDate, endDate, page]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const regionData = [
    { id: "전체", name: "전체 지역" },
    { id: "서울", name: "서울" },
    { id: "경기도", name: "경기도" },
    { id: "강원도", name: "강원도" },
    { id: "제주도", name: "제주도" },
    { id: "부산", name: "부산" }
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-10 min-h-screen bg-white">
      {/* 타이틀 섹션 */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">전국 행사 목록</h1>
        <p className="text-gray-400 mt-2 font-medium italic">실시간으로 업데이트되는 전국의 다양한 축제를 만나보세요.</p>
      </div>

      {/* 필터 바 영역 */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* 지역 선택 */}
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="p-4 px-6 rounded-2xl border-none outline-none font-bold bg-white shadow-sm text-gray-700 min-w-[150px]"
          >
            {regionData.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          {/* 검색창 */}
          <div className="flex items-center bg-white rounded-2xl px-6 py-4 w-full lg:w-[400px] shadow-sm border border-transparent focus-within:border-blue-400 transition-all">
            <input
              type="text"
              placeholder="찾으시는 행사가 있나요?"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300"
            />
            {keyword && <button onClick={() => setKeyword("")} className="text-gray-300 hover:text-gray-500">✕</button>}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
          {/* 기간 선택 */}
          <div className="flex items-center gap-2 bg-white p-2 px-4 rounded-2xl shadow-sm border border-transparent">
            <input 
                type="date" 
                value={startDate} 
                onChange={(e) => {setStartDate(e.target.value); setPage(1);}}
                className="outline-none text-xs font-bold text-gray-500 bg-transparent"
            />
            <span className="text-gray-200">~</span>
            <input 
                type="date" 
                value={endDate} 
                onChange={(e) => {setEndDate(e.target.value); setPage(1);}}
                className="outline-none text-xs font-bold text-gray-500 bg-transparent"
            />
          </div>

          {/* 정렬 드롭다운 */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsSortOpen(!isSortOpen); }}
              className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#0369A1] flex items-center gap-3 shadow-sm hover:bg-blue-50 transition-all"
            >
              {selectedSortLabel} <span className="text-[10px]">▼</span>
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-50 rounded-2xl shadow-2xl z-50 p-2 animate-fadeIn">
                {sortOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setIsSortOpen(false); setPage(1); }}
                    className={`px-4 py-3 text-sm rounded-xl cursor-pointer transition-all ${sort === opt.value ? "bg-blue-600 text-white font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.content_id}
              event={event}
              onClick={() => navigate(`/events/${event.content_id}`)}
            />
          ))
        ) : (
          <div className="col-span-full py-40 text-center flex flex-col items-center">
            <p className="text-gray-300 text-xl font-bold">검색 결과가 없습니다.</p>
            <p className="text-gray-200 text-sm mt-2">다른 지역이나 키워드로 다시 검색해 보세요!</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-12 h-12 rounded-2xl font-black text-sm transition-all shadow-sm
                ${page === i + 1 ? "bg-[#0369A1] text-white shadow-blue-200 shadow-xl scale-110" : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;