import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { useNavigate, useSearchParams } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);

  const [region, setRegion] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ URL에서 region 받기
  const regionParam = searchParams.get("region");

  useEffect(() => {
    if (regionParam) {
      setRegion(regionParam);
    }
  }, [regionParam]);

  // ✅ 정렬 → status 변환
  const statusMap = {
    latest: "",
    likes: "likes",
    ongoing: "ongoing",
    ended: "ended",
  };

  // ✅ 이벤트 요청 함수
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

      setEvents(res.data.events);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ debounce 적용
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(delay);
  }, [region, keyword, sort, startDate, endDate]);

  // ✅ 지역 리스트
  const regions = [
    "전체",
    "서울",
    "경기",
    "강원",
    "충남",
    "충북",
    "전남",
    "전북",
    "경북",
    "경남",
    "제주",
  ];

  return (
    <div className="p-6">

      {/* 🔥 상단 필터 */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">

        {/* 📍 지역 */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="text-xl font-bold border-none outline-none"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* 🔍 검색 */}
        <div className="flex items-center border rounded-full px-3 py-1 w-80 bg-gray-100">
          <input
            type="text"
            placeholder="행사를 검색하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {keyword && (
            <button onClick={() => setKeyword("")}>❌</button>
          )}
          <button>🔍</button>
        </div>

        {/* 📅 날짜 */}
        <div className="flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
          📅
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="outline-none bg-transparent"
          />
          ~
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="outline-none bg-transparent"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              ❌
            </button>
          )}
        </div>

        {/* 🔽 정렬 */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-full px-3 py-1 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="likes">좋아요순</option>
          <option value="ongoing">진행중</option>
          <option value="ended">종료</option>
        </select>
      </div>

      {/* 🔥 이벤트 카드 */}
      <div className="grid grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.content_id}
              event={event}
              onClick={() => navigate(`/detail/${event.content_id}`)}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-3 text-center">
            결과가 없습니다.
          </p>
        )}
      </div>

      {/* 🔥 페이지네이션 (추후 연결) */}
      <div className="mt-10 text-center text-gray-500">
        1 2 3 4 5
      </div>
    </div>
  );
};

export default EventList;