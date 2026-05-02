import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api"; 
import EventCard from "../../components/EventCard";
import BookmarkToast from "../../components/BookmarkToast";
import { useAuth } from "../../contexts/AuthContext";
import LoginRequiredModal from "../../components/LoginRequiredModal";

const EventList = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [bookmarkToastOpen, setBookmarkToastOpen] = useState(false);
  const [bookmarkToastState, setBookmarkToastState] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 🔴 헤더 및 리스트 검색어 통합 (URL 파라미터 우선)
  const urlKeyword = searchParams.get("keyword") || "";
  const urlRegion = searchParams.get("region") || "전체"; // URL에서 지역 파라미터 추출

  // 🔴 초기 상태를 URL 파라미터(urlRegion) 값으로 설정
  const [region, setRegion] = useState(urlRegion);
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };


  // 🔴 URL의 region 파라미터가 변경될 때 내부 region 상태를 동기화
  useEffect(() => {
    if (urlRegion) {
      setRegion(urlRegion);
    }
  }, [urlRegion]);

  // 이전 설정 유지: 필터 검색 시 사용되는 상태 맵
  const statusMap = {
    latest: "",
    likes: "",
    ongoing: "진행중",
    upcoming: "예정",
    ended: "종료",
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let res;
      
      // 🔍 Case 1: 검색어가 있을 때 (백엔드 명세 /api/search 사용)
      if (urlKeyword) {
        res = await api.get("/api/search", {
          params: { keyword: urlKeyword }
        });
      } 
      // 🔍 Case 2: 일반 필터링 (백엔드 명세 /api/events/filter 사용)
      else {
        res = await api.get("/api/events/filter", {
          params: {
            region: region === "전체" ? undefined : region,
            status: statusMap[sort] || undefined,
            start_date_param: startDate || undefined,
            end_date_param: endDate || undefined,
          },
        });
      }

      if (res.data) {
        let fetchedData = res.data.events || res.data || [];
        
        // 🔴 정렬 로직 보정: 오늘과 가장 가까운 순서 (오름차순)
        fetchedData.sort((a, b) => {
          if (sort === "likes") {
            if ((b.like_count || 0) !== (a.like_count || 0)) 
              return (b.like_count || 0) - (a.like_count || 0);
          }
          // 시작일 기준 오름차순 (오늘/가까운 날짜가 상단)
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          if (dateA - dateB !== 0) return dateA - dateB;
          return b.content_id - a.content_id;
        });

        setAllEvents(fetchedData);
        setPage(1);
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (e, contentId) => {
    e.stopPropagation();

    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${contentId}/likes/toggle`);
      if (res.data.success) {
        setAllEvents(prev => prev.map(ev =>
          ev.content_id === contentId
            ? {
                ...ev,
                like_count: res.data.like_count,
                is_liked: res.data.liked,
              }
            : ev
        ));
      }
    } catch (err) {
      console.error("좋아요 실패");
    }
  };


  const handleBookmark = async (e, contentId) => {
    e.stopPropagation();

    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${contentId}/bookmarks/toggle`);
      if (res.data.success) {
        setAllEvents(prev => prev.map(ev =>
          ev.content_id === contentId
            ? {
                ...ev,
                bookmark_count: res.data.bookmark_count,
                is_bookmarked: res.data.bookmarked,
              }
            : ev
        ));

        setBookmarkToastState(res.data.bookmarked);
        setBookmarkToastOpen(true);
      }
    } catch (err) {
      console.error("북마크 실패");
    }
  };


  useEffect(() => {
    const delay = setTimeout(fetchEvents, 300);
    return () => clearTimeout(delay);
  }, [urlKeyword, region, sort, startDate, endDate]);

  useEffect(() => {
    const startIndex = (page - 1) * pageSize;
    setDisplayEvents(allEvents.slice(startIndex, startIndex + pageSize));
  }, [allEvents, page]);

  const totalPages = Math.ceil(allEvents.length / pageSize);

  return (
    <>
      <div className="max-w-[1440px] mx-auto p-10 min-h-screen bg-white">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {urlKeyword ? `"${urlKeyword}" 검색 결과` : "전국 행사 목록"}
          </h1>
          <p className="text-gray-400 mt-2 font-medium italic">총 {allEvents.length}개의 행사가 검색되었습니다.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-gray-50 p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6">
            <select 
              value={region} 
              onChange={(e) => {
                const newRegion = e.target.value;
                setRegion(newRegion);
                // 🔴 주소창 URL 동기화 로직 추가
                const params = new URLSearchParams(searchParams);
                if (newRegion === "전체") {
                  params.delete("region");
                } else {
                  params.set("region", newRegion);
                }
                navigate(`/events?${params.toString()}`, { replace: true });
              }}
              className="text-2xl font-bold bg-transparent outline-none cursor-pointer"
            >
              {["전체", "서울", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            
            <div className="flex items-center bg-white rounded-full px-6 py-3 w-[400px] shadow-sm border border-transparent focus-within:border-blue-400 transition-all">
              <input
                type="text"
                placeholder="가고 싶은 행사를 검색해 보세요"
                defaultValue={urlKeyword}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/events?keyword=${encodeURIComponent(e.target.value)}`);
                  }
                }}
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

        {/* 페이지네이션 */}
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

export default EventList;