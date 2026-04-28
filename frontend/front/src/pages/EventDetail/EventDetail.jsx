import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReviewSection from "./ReviewSection"; // 리뷰 섹션 컴포넌트

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("상세페이지 데이터 로드 시도 중... ID:", id);

        // 1. [테스트용] 로딩 속도 체감을 위해 0.5초 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2. [테스트용] 백엔드 응답과 똑같은 구조의 더미 데이터 주입
        const mockEvent = {
          content_id: id,
          title: `[임시] ${id}번 행사 상세페이지 테스트`,
          first_image: `https://picsum.photos/seed/${id}/800/500`, // 랜덤 이미지
          addr1: "서울특별시 강남구 테헤란로 123 (역삼동)",
          tel: "02-1234-5678",
          event_homepage: "https://www.example.com",
          sponsor1: "GIUT 문화재단",
          start_date: "2026-05-01",
          end_date: "2026-05-31",
          mapx: 127.0276, // 지도 테스트용 좌표
          mapy: 37.4979,
          like_count: 520,
          bookmark_count: 88
        };

        // 3. 상태 업데이트
        setEvent(mockEvent);
        setLiked(false);
        setBookmarked(true); // 북마크 테스트용으로 하나 켜둠
        
        console.log("데이터 주입 완료!");

      } catch (err) {
        console.error("데이터 로드 실패:", err);
        // 에러가 나도 테스트를 위해 강제로 데이터를 넣고 싶다면 위 로직을 catch 밖으로 빼세요.
      } finally {
        setLoading(false); // 🔴 이게 실행되어야 "데이터 없음" 대신 화면이 뜹니다.
      }
    };

    fetchData();
  }, [id, navigate]);
  // 좋아요 토글
  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/events/${id}/likes/toggle`);
      setLiked(res.data.liked);
      setEvent((prev) => ({
        ...prev,
        like_count: res.data.like_count,
      }));
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
      }
    }
  };

  // 북마크 토글
  const handleBookmark = async () => {
    try {
      const res = await axios.post(`/api/events/${id}/bookmarks/toggle`);
      setBookmarked(res.data.bookmarked);
      setEvent((prev) => ({
        ...prev,
        bookmark_count: res.data.bookmark_count,
      }));
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-[#0369A1] font-bold">
      로딩 중입니다...
    </div>
  );
  
  if (!event) return (
    <div className="text-center py-20 text-gray-500">행사 정보가 존재하지 않습니다.</div>
  );

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white min-h-screen">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-400 hover:text-gray-900 flex items-center gap-2 text-sm transition-all">
        ← 목록으로 돌아가기
      </button>

      {/* 상단 섹션 */}
      <div className="flex flex-col md:flex-row gap-12 mb-12">
        {/* 이미지 영역 */}
        <div className="w-full md:w-[450px] aspect-[16/10] bg-gray-100 rounded-[32px] overflow-hidden shadow-lg">
          <img
            src={event.first_image || "/no-image.png"}
            alt={event.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>

        {/* 정보 영역 */}
        <div className="flex-1 space-y-4 py-2">
          <h1 className="text-3xl font-black text-gray-900 mb-6">{event.title}</h1>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 font-medium">
            <p className="flex gap-4 border-b border-gray-50 pb-2"><span className="w-24 text-blue-500 font-bold">📍 장소</span> {event.addr1 || "-"}</p>
            <p className="flex gap-4 border-b border-gray-50 pb-2"><span className="w-24 text-blue-500 font-bold">📞 연락처</span> {event.tel || "-"}</p>
            <p className="flex gap-4 border-b border-gray-50 pb-2"><span className="w-24 text-blue-500 font-bold">🌐 홈페이지</span> 
              <a href={event.event_homepage} target="_blank" rel="noreferrer" className="text-blue-400 truncate hover:underline">
                {event.event_homepage || "-"}
              </a>
            </p>
            <p className="flex gap-4 border-b border-gray-50 pb-2"><span className="w-24 text-blue-500 font-bold">🏢 주최</span> {event.sponsor1 || "-"}</p>
            <p className="flex gap-4 border-b border-gray-50 pb-2"><span className="w-24 text-blue-500 font-bold">📅 기간</span> {event.start_date} ~ {event.end_date}</p>
          </div>
        </div>
      </div>

      {/* 지도 및 액션 버튼 */}
      <div className="mb-16">
        <div className="w-full h-[300px] bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold mb-6">
          {/* 여기에 카카오/구글 지도 API 연동 (좌표: event.mapx, event.mapy) */}
          지도 API 연동 영역 (좌표: {event.mapx}, {event.mapy})
        </div>

        <div className="flex justify-end gap-6 items-center">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm border 
              ${liked ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"}`}
          >
            {liked ? "❤️" : "♡"} {event.like_count}
          </button>

          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm border 
              ${bookmarked ? "bg-blue-50 border-blue-100 text-blue-500" : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50"}`}
          >
            {bookmarked ? "🔖" : "🔖"} {event.bookmark_count}
          </button>
        </div>
      </div>

      <hr className="border-gray-200 mb-12" />

      {/* --- 리뷰 섹션 (컴포넌트로 분리) --- */}
      <ReviewSection eventId={id} />
    </div>
  );
};

export default EventDetail; 