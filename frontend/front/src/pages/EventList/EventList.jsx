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

  
  const regionId = searchParams.get("regionId");

  
  const regionMap = {
    0: "전체",
    1: "서울",
    2: "경기",
    3: "강원",
    4: "충남",
    5: "충북",
    6: "전남",
    7: "전북",
    8: "경북",
    9: "경남",
    10: "제주",
  };

  
  const regions = Object.values(regionMap);

  
  useEffect(() => {
    if (regionId) {
      setRegion(regionMap[regionId]);
    }
  }, [regionId]);

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events/filter", {
          params: {
            region: region === "전체" ? "" : region,
            keyword,
            sort,
            start_date: startDate,
            end_date: endDate,
          },
        });

        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, [region, keyword, sort, startDate, endDate]);

  return (
    <div className="p-6">

      
      <div className="flex items-center gap-3 mb-6 flex-wrap">

        
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
              X
            </button>
          )}
        </div>

        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-full px-3 py-1 text-sm"
        >
          <option value="latest">날짜순</option>
          <option value="likes">좋아요순</option>
          <option value="ongoing">진행중</option>
          <option value="ended">종료</option>
        </select>
      </div>

      
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

      
      
      <div className="mt-10 text-center text-gray-500">
        1 2 3 4 5
      </div>
    </div>
  );
};

export default EventList;