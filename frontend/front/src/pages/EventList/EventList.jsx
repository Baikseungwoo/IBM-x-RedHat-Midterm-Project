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

  const urlKeyword = searchParams.get("keyword") || "";
  const urlRegion = searchParams.get("region") || "전체";

  const [searchInput, setSearchInput] = useState(urlKeyword);
  const [region, setRegion] = useState(urlRegion);
  const [sort, setSort] = useState("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const regions = [
    "전체",
    "서울",
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
    "제주도",
  ];

  const statusMap = {
    latest: "",
    likes: "",
    ongoing: "진행중",
    upcoming: "예정",
    ended: "종료",
  };

  useEffect(() => {
    setSearchInput(urlKeyword);
  }, [urlKeyword]);

  useEffect(() => {
    if (urlRegion) {
      setRegion(urlRegion);
    }
  }, [urlRegion]);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };

  const updateKeywordParam = () => {
    const params = new URLSearchParams(searchParams);
    const keyword = searchInput.trim();

    if (keyword) {
      params.set("keyword", keyword);
    } else {
      params.delete("keyword");
    }

    navigate(`/events?${params.toString()}`);
  };

  const fetchEvents = async () => {
    setLoading(true);

    try {
      const res = await api.get("/api/events/filter", {
        params: {
          keyword: urlKeyword || undefined,
          region: region === "전체" ? undefined : region,
          status: statusMap[sort] || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
      });

      if (res.data) {
        const fetchedData = res.data.events || res.data || [];

        fetchedData.sort((a, b) => {
          if (sort === "likes") {
            if ((b.like_count || 0) !== (a.like_count || 0)) {
              return (b.like_count || 0) - (a.like_count || 0);
            }
          }

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
        setAllEvents((prev) =>
          prev.map((ev) =>
            ev.content_id === contentId
              ? {
                  ...ev,
                  like_count: res.data.like_count,
                  is_liked: res.data.liked,
                }
              : ev
          )
        );
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
        setAllEvents((prev) =>
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
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-16 h-56 w-56 rounded-full bg-yellow-200/45 blur-3xl" />
          <div className="absolute right-[10%] top-36 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
          <div className="absolute bottom-20 left-[35%] h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-10 md:px-10">
          <div className="mb-10 overflow-hidden rounded-[36px] border border-white/70 bg-white/60 p-8 shadow-2xl shadow-sky-200/40 backdrop-blur-2xl md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-black text-sky-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Festival Explorer
                </div>

                <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                  {urlKeyword ? `"${urlKeyword}" 검색 결과` : "전국 축제 둘러보기"}
                </h1>

                <p className="mt-4 text-lg font-semibold leading-8 text-gray-500">
                  지역과 날짜를 골라 지금 가기 좋은 행사를 찾아보세요.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <div className="rounded-3xl bg-white/80 px-5 py-4 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
                    Region
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#0369A1]">
                    {region}
                  </p>
                </div>

                <div className="rounded-3xl bg-white/80 px-5 py-4 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-400">
                    Events
                  </p>
                  <p className="mt-1 text-2xl font-black text-gray-900">
                    {allEvents.length}개
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12 rounded-[32px] border border-white/70 bg-white/70 p-5 shadow-xl shadow-sky-100/50 backdrop-blur-2xl">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <select
                  value={region}
                  onChange={(e) => {
                    const newRegion = e.target.value;
                    setRegion(newRegion);

                    const params = new URLSearchParams(searchParams);
                    if (newRegion === "전체") {
                      params.delete("region");
                    } else {
                      params.set("region", newRegion);
                    }

                    navigate(`/events?${params.toString()}`, { replace: true });
                  }}
                  className="h-12 rounded-2xl border border-sky-100 bg-white/80 px-5 text-lg font-black text-[#0369A1] shadow-sm outline-none cursor-pointer"
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <div className="flex h-12 w-full items-center rounded-2xl border border-sky-100 bg-white/85 px-5 shadow-sm transition-all focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100 sm:w-[420px]">
                  <input
                    type="text"
                    placeholder="가고 싶은 행사를 검색해 보세요"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateKeywordParam();
                      }
                    }}
                    className="min-w-0 flex-1 bg-transparent text-sm font-bold text-gray-700 outline-none placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={updateKeywordParam}
                    className="ml-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#0369A1] text-white transition hover:bg-sky-500 active:scale-95"
                    aria-label="검색"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.7}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white/85 p-3 shadow-sm sm:flex-row sm:items-center">
                  <label className="flex h-11 items-center gap-3 rounded-xl bg-sky-50 px-4">
                    <svg
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.4}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                      />
                    </svg>

                    <div>
                      <p className="text-[10px] font-black text-sky-500">시작일</p>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent text-sm font-bold text-gray-700 outline-none"
                      />
                    </div>
                  </label>

                  <span className="hidden text-gray-300 sm:block">~</span>

                  <label className="flex h-11 items-center gap-3 rounded-xl bg-pink-50 px-4">
                    <svg
                      className="h-5 w-5 text-pink-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.4}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                      />
                    </svg>

                    <div>
                      <p className="text-[10px] font-black text-pink-500">종료일</p>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent text-sm font-bold text-gray-700 outline-none"
                      />
                    </div>
                  </label>
                </div>


                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-12 rounded-2xl border border-sky-100 bg-white/85 px-5 text-sm font-black text-[#0369A1] shadow-sm outline-none cursor-pointer"
                >
                  <option value="latest">기본순</option>
                  <option value="likes">인기순</option>
                  <option value="upcoming">진행 예정</option>
                  <option value="ongoing">진행중</option>
                  <option value="ended">종료됨</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] rounded-[28px] bg-white/50 shadow-lg shadow-sky-100/40 animate-pulse"
                />
              ))}
            </div>
          ) : displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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
          ) : (
            <div className="rounded-[32px] border border-dashed border-white/80 bg-white/60 px-6 py-20 text-center shadow-xl shadow-sky-100/40 backdrop-blur">
              <p className="text-2xl font-black text-gray-700">
                조건에 맞는 행사가 없습니다
              </p>
              <p className="mt-3 text-sm font-semibold text-gray-400">
                지역, 날짜, 검색어를 조금 넓혀서 다시 찾아보세요.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-20 flex flex-wrap justify-center items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`h-11 min-w-11 rounded-2xl px-4 text-sm font-black transition-all ${
                    page === i + 1
                      ? "bg-[#0369A1] text-white shadow-lg shadow-sky-300/40"
                      : "bg-white/70 text-gray-400 hover:bg-white hover:text-[#0369A1]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
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
          navigate("/login");
        }}
      />
    </>
  );
};

export default EventList;
