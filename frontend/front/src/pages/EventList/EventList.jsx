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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 지역받기
  const regionParam = searchParams.get("region");

  useEffect(() => {
    if (regionParam) {
      setRegion(regionParam);
    }
  }, [regionParam]);

  useEffect(() => {
  const dummyEvents = [
    {
      content_id: 1,
      title: "서울 벚꽃 축제",
      addr1: "서울 여의도",
      first_image: "https://picsum.photos/300/200",
      like_count: 12,
      bookmark_count: 5,
    },
    {
      content_id: 2,
      title: "부산 불꽃 축제",
      addr1: "부산 광안리",
      first_image: "",
      like_count: 30,
      bookmark_count: 10,
    },
    {
      content_id: 3,
      title: "강릉 커피 페스티벌",
      addr1: "강릉 안목해변",
      first_image: "",
      like_count: 8,
      bookmark_count: 2,
    },
  ];

  setEvents(dummyEvents);
}, []);

  // 정렬
  const statusMap = {
    latest: "",
    likes: "likes",
    ongoing: "ongoing",
    ended: "ended",
  };

  // 이벤트 요청
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
    } catch (err) {
      console.error(err);
      setEvents([]);
    }
  };

  /*
  // 
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(delay);
  }, [region, keyword, sort, startDate, endDate]);*/

  // 지역 리스트
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

      {/* 상단 UI */}
      <div className="flex items-center justify-between mb-8">

        {/* 왼쪽 */}
        <div className="flex items-center gap-4">

          {/* 지역 */}
          <button className="text-2xl font-bold flex items-center gap-1">
            {region}
            <span>▼</span>
          </button>

          {/* 검색 */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-[350px]">
            <input
              type="text"
              placeholder="행사를 검색하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {keyword && (
              <button onClick={() => setKeyword("")}>✕</button>
            )}
            <button>🔍</button>
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-3">

          {/* 날짜 */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 text-sm">
            📅
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent outline-none"
            />
            ~
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent outline-none"
            />
          </div>

          {/* 정렬 (UI만) */}
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm cursor-pointer">
            정렬 ▼
          </div>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-3 gap-6">
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
      <div className="mt-10 text-center text-gray-500">
        1 2 3 4 5
      </div>
    </div>
  );
};

export default EventList;