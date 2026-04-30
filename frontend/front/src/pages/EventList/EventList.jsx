import React, { useEffect, useState } from "react";
import api from "../../api"; 
import EventCard from "../../components/EventCard";
import { useNavigate, useSearchParams } from "react-router-dom";

const EventList = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [region, setRegion] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusMap = {
    latest: "",
    likes: "",
    ongoing: "진행중",
    upcoming: "예정",
    ended: "종료",
  };

  useEffect(() => {
    const regionParam = searchParams.get("region");
    if (regionParam) setRegion(regionParam);
  }, [searchParams]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/events/filter", {
        params: {
          region: region === "전체" ? undefined : region,
          keyword: keyword.trim() || undefined,
          status: statusMap[sort] || undefined,
          start_date_param: startDate || undefined,
          end_date_param: endDate || undefined,
        },
      });

      if (res.data) {
        let fetchedData = res.data.events || res.data || [];
        
        fetchedData.sort((a, b) => {
          if (sort === "likes") {
            if ((b.like_count || 0) !== (a.like_count || 0)) return (b.like_count || 0) - (a.like_count || 0);
          }
          return new Date(b.start_date) - new Date(a.start_date);
        });
        setAllEvents(fetchedData);
        setPage(1);
      }
    } catch (err) {
      console.error(err);
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e, contentId) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/api/events/${contentId}/likes/toggle`);
      if (res.data.success) {
        setAllEvents(prev => prev.map(ev => 
          ev.content_id === contentId 
            ? { 
                ...ev, 
                like_count: res.data.like_count, 
                is_liked: res.data.liked // 백엔드 리턴 필드 liked
              } 
            : ev
        ));
      }
    } catch (err) {
      console.error("좋아요 처리 실패");
    }
  };

  const handleBookmark = async (e, contentId) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/api/events/${contentId}/bookmarks/toggle`);
      if (res.data.success) {
        setAllEvents(prev => prev.map(ev => 
          ev.content_id === contentId 
            ? { ...ev, is_bookmarked: res.data.bookmarked } // 백엔드 리턴 필드 bookmarked
            : ev
        ));
      }
    } catch (err) {
      console.error("북마크 처리 실패");
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchEvents, 300);
    return () => clearTimeout(delay);
  }, [region, keyword, sort, startDate, endDate]);

  useEffect(() => {
    const startIndex = (page - 1) * pageSize;
    setDisplayEvents(allEvents.slice(startIndex, startIndex + pageSize));
  }, [allEvents, page]);

  const totalPages = Math.ceil(allEvents.length / pageSize);

  return (
    <div className="max-w-[1440px] mx-auto p-10 min-h-screen bg-white">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">전국 행사 목록</h1>
        <p className="text-gray-400 mt-2 font-medium italic">총 {allEvents.length}개의 행사가 검색되었습니다.</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-gray-50 p-6 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            className="text-2xl font-bold bg-transparent outline-none cursor-pointer"
          >
            {["전체", "서울", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="flex items-center bg-white rounded-full px-6 py-3 w-[400px] shadow-sm border border-transparent focus-within:border-blue-400 transition-all">
            <input
              type="text"
              placeholder="행사명 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-bold"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-full shadow-sm text-sm font-bold text-gray-600">
            <span>📅</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent outline-none" />
            <span className="text-gray-200">~</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent outline-none" />
          </div>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="bg-white px-6 py-3 rounded-full shadow-sm text-sm font-black text-blue-600 outline-none cursor-pointer"
          >
            <option value="latest">최신순</option>
            <option value="likes">인기순</option>
            <option value="upcoming">진행 예정</option>
            <option value="ongoing">진행중</option>
            <option value="ended">종료됨</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-40 text-center text-gray-400 font-bold animate-pulse">로딩 중...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayEvents.map((event) => (
            <EventCard 
              key={event.content_id} 
              event={event} 
              onClick={() => navigate(`/events/${event.content_id}`)}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}

      <div className="mt-24 flex justify-center items-center gap-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`text-xl font-black transition-all ${page === i + 1 ? "text-blue-600 scale-125 border-b-4 border-blue-600" : "text-gray-300 hover:text-gray-500"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;