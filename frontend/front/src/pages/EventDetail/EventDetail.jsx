import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams(); 

  const [event, setEvent] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // 초기 데이터
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, likeRes, bookmarkRes] = await Promise.all([
          axios.get(`/api/events/${id}`),
          axios.get(`/api/events/${id}/likes/me`),
          axios.get(`/api/events/${id}/bookmarks/me`),
        ]);

        setEvent(eventRes.data.event);
        setLiked(likeRes.data.liked);
        setBookmarked(bookmarkRes.data.bookmarked);

      } catch (err) {
        console.error(err);

        // 로그인 안했을 경우
        setLiked(false);
        setBookmarked(false);
      }
    };

    fetchData();
  }, [id]);

  // 좋아요
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `/api/events/${id}/likes/toggle`
      );

      setLiked(res.data.liked);

      // 👉 카운트 업데이트
      setEvent((prev) => ({
        ...prev,
        like_count: res.data.like_count,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  // 북마크
  const handleBookmark = async () => {
    try {
      const res = await axios.post(
        `/api/events/${id}/bookmarks/toggle`
      );

      setBookmarked(res.data.bookmarked);

      setEvent((prev) => ({
        ...prev,
        bookmark_count: res.data.bookmark_count,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  if (!event) return <div>로딩중...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* 상단 */}
      <div className="flex gap-8">

        <div className="w-[400px] h-[250px] bg-gray-300 flex items-center justify-center">
          <img
            src={event.first_image || "/no-image.png"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2 text-sm">
          <p>행사 장소 : {event.addr1}</p>
          <p>행사 홈페이지 : {event.event_homepage}</p>
          <p>행사 연락처 : {event.tel}</p>
          <p>행사 진행 시간 : {event.play_time}</p>
          <p>이용 시간 : {event.use_time}</p>
          <p>행사 프로그램 : {event.program}</p>
          <p>주최자 : {event.sponsor1}</p>
          <p>주최자 연락처 : {event.sponsor1_tel}</p>
        </div>
      </div>

      {/* 지도*/}
      <div className="mt-8">
        <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
          지도 들어갈 자리
        </div>

        <div className="flex justify-end gap-4 mt-3 text-lg">

          {/* 좋아요 */}
          <button
            onClick={handleLike}
            className={liked ? "text-red-500" : ""}
          >
            ❤️ {event.like_count}
          </button>

          {/* 북마크 */}
          <button
            onClick={handleBookmark}
            className={bookmarked ? "text-blue-500" : ""}
          >
            🔖 {event.bookmark_count}
          </button>

        </div>
      </div>

    </div>
  );
};

export default EventDetail;