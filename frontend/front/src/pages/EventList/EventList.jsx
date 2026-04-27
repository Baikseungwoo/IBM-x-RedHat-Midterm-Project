import React, { useEffect, useState } from "react";
import axios from "axios";
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

  // 페이지네이션
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 9;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const regionParam = searchParams.get("region");

  useEffect(() => {
    if (regionParam) {
      setRegion(regionParam);
    }
  }, [regionParam]);

  // 정렬 옵션
  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "인기순", value: "likes" },
    { label: "진행중", value: "ongoing" },
    { label: "종료됨", value: "ended" },
  ];

  const selectedSortLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "정렬";

  const statusMap = {
    latest: "",
    likes: "likes",
    ongoing: "ongoing",
    ended: "ended",
  };

  //  API 요청
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events/filter", {
        params: {
          ...(region !== "전체" && { region }),
          ...(keyword && { keyword }),
          ...(statusMap[sort] && { status: statusMap[sort] }),
          ...(startDate && { start_date: startDate }),
          ...(endDate && { end_date: endDate }),
        },
      });

      setEvents(res.data?.events || []);
      setTotalCount(res.data.events.length);
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  // 자동 fetch
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(delay);
  }, [region, keyword, sort, startDate, endDate, page]);

  // 총 페이지
  const totalPages = Math.ceil(totalCount / pageSize);

  // 지역 리스트
  const regionData = [
    { id: "서울", name: "서울" },
    { id: "경기도", name: "경기도" },
    { id: "강원도", name: "강원도" },
    { id: "충청남도", name: "충청남도" },
    { id: "충청북도", name: "충청북도" },
    { id: "전라남도", name: "전라남도" },
    { id: "전라북도", name: "전라북도" },
    { id: "경상북도", name: "경상북도" },
    { id: "경상남도", name: "경상남도" },
    { id: "제주도", name: "제주도" },
  ];

  return (
    <div className="p-6">
      {/* 상단 UI */}
      <div className="flex items-center justify-between mb-8">

        {/* 왼쪽 */}
        <div className="flex items-center gap-4">

          {/* 지역 */}
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1); // 필터 바뀌면 페이지 초기화
            }}
            className="p-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 outline-none font-bold bg-white"
          >
            {regionData.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* 검색 */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-[350px]">
            <input
              type="text"
              placeholder="행사를 검색하세요"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {keyword && (
              <button onClick={() => setKeyword("")}>✕</button>
            )}
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-3">

          {/* 날짜 */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="p-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 outline-none font-bold bg-white"
            />
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="p-3 rounded-2xl border-2 border-gray-200 focus:border-blue-400 outline-none font-bold bg-white"
            />
          </div>

          {/* 정렬 */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSortOpen((prev) => !prev);
              }}
              className="bg-gray-100 rounded-full px-4 py-2 text-sm flex items-center gap-2"
            >
              {selectedSortLabel} ▼
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg z-10">
                {sortOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setIsSortOpen(false);
                      setPage(1);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 
                      ${sort === opt.value ? "font-bold text-blue-500" : ""}`}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-4 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.content_id}
              event={event}
              onClick={() => navigate(`/events/${event.content_id}`)}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-3 text-center">
            결과가 없습니다.
          </p>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-10 text-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded 
                ${page === i + 1 ? "bg-black text-white" : "bg-gray-100"}`}
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