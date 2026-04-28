import React, { useEffect, useState } from "react";
import api from "../../api"; 
import EventCard from "../../components/EventCard";
import { useNavigate, useSearchParams } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 필터 상태
  const [region, setRegion] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); 
  const pageSize = 8; 

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 북마크 SVG 컴포넌트 (기본/활성)
  const BookmarkIcon = ({ active }) => (
    <svg 
      className={`w-6 h-6 transition-colors ${active ? "text-yellow-400" : "text-gray-300"}`} 
      fill={active ? "currentColor" : "none"} 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );

  const statusMap = {
    latest: "",
    likes: "likes",
    ongoing: "진행중",
    ended: "종료",
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/events/filter", {
        params: {
          region: region === "전체" ? undefined : region,
          keyword: keyword || undefined,
          status: statusMap[sort] || undefined,
          start_date_param: startDate || undefined,
          end_date_param: endDate || undefined,
          page: page,
          size: pageSize,
        },
      });

      if (res.data) {
        const fetchedEvents = res.data.events || [];
        // 백엔드에서 total_count를 안 보내줄 경우를 대비한 안전장치
        setTotalCount(res.data.total_count || (fetchedEvents.length < pageSize ? fetchedEvents.length : 40));
        setEvents(fetchedEvents);
      }
    } catch (err) {
      console.error("이벤트 로드 실패:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEvents();
    }, 300);
    return () => clearTimeout(delay);
  }, [region, keyword, sort, startDate, endDate, page]);

  // 🔴 하트(좋아요) 토글 함수
  const handleLike = async (e, contentId) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    try {
      const res = await api.post(`/api/events/${contentId}/like`);
      if (res.data.success) {
        setEvents(prev => prev.map(ev => 
          ev.content_id === contentId ? { ...ev, like_count: res.data.like_count } : ev
        ));
      }
    } catch (err) {
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 🔴 북마크 토글 함수
  const handleBookmark = async (e, contentId) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/api/events/${contentId}/bookmark`);
      if (res.data.success) {
        // 북마크 상태를 UI에 즉시 반영 (is_bookmarked 필드가 있다고 가정)
        setEvents(prev => prev.map(ev => 
          ev.content_id === contentId ? { ...ev, is_bookmarked: !ev.is_bookmarked } : ev
        ));
        alert(res.data.is_bookmarked ? "북마크에 추가되었습니다." : "북마크가 해제되었습니다.");
      }
    } catch (err) {
      alert("북마크 처리에 실패했습니다.");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-[1440px] mx-auto p-10 min-h-screen bg-white">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">전국 행사 목록</h1>
        <p className="text-gray-400 mt-2 font-medium">취향에 맞는 축제를 북마크하고 좋아요를 눌러보세요!</p>
      </div>

      {/* 필터 바 */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-gray-50 p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <select 
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="text-2xl font-bold bg-transparent outline-none cursor-pointer"
          >
            {["전체", "서울", "경기", "강원", "충남", "충북", "전남", "전북", "경북", "경남", "제주"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <div className="flex items-center bg-white rounded-full px-6 py-4 w-full lg:w-[400px] shadow-sm border border-transparent focus-within:border-blue-400 transition-all">
            <input
              type="text"
              placeholder="행사를 검색하세요"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent outline-none text-sm font-bold"
            />
            <span className="text-gray-400">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="bg-white px-6 py-4 rounded-full shadow-sm text-sm font-black text-blue-600 outline-none border border-gray-100"
          >
            <option value="latest">최신순</option>
            <option value="likes">인기순</option>
            <option value="ongoing">진행중</option>
            <option value="ended">종료됨</option>
          </select>
        </div>
      </div>

      {/* 리스트 영역 */}
      {loading ? (
        <div className="py-40 text-center text-gray-400 font-bold animate-pulse">데이터 로드 중...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.content_id} className="relative group">
                <EventCard
                  event={event}
                  onClick={() => navigate(`/events/${event.content_id}`)}
                />
                {/* 하트 & 북마크 오버레이 버튼 */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button 
                    onClick={(e) => handleBookmark(e, event.content_id)}
                    className="p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <BookmarkIcon active={event.is_bookmarked} />
                  </button>
                  <button 
                    onClick={(e) => handleLike(e, event.content_id)}
                    className="p-2 bg-white/80 backdrop-blur rounded-full shadow-md hover:scale-110 transition-transform flex items-center gap-1"
                  >
                    <span className={event.like_count > 0 ? "text-red-500" : "text-gray-300"}>❤️</span>
                    <span className="text-[10px] font-bold text-gray-600">{event.like_count}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-40 text-center text-gray-300 text-xl font-bold">결과가 없습니다.</div>
          )}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-20 flex justify-center items-center gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-12 h-12 rounded-2xl font-black text-sm transition-all shadow-sm
                ${page === i + 1 ? "bg-blue-600 text-white shadow-xl scale-110" : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"}`}
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