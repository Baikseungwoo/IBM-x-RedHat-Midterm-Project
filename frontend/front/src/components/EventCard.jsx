import React, { useState, useEffect } from "react";
import axios from "axios";

const EventCard = ({ event, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(event.like_count || 0);
  const [bookmarkCount, setBookmarkCount] = useState(event.bookmark_count || 0);
  const [loading, setLoading] = useState(false);

  // 이미지 fallback
  const handleImageError = (e) => {
    e.target.src = "/no-image.png";
  };

  // 🔥 좋아요 / 북마크 상태 가져오기
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [likeRes, bookmarkRes] = await Promise.all([
          axios.get(`/api/events/${event.content_id}/likes/me`),
          axios.get(`/api/events/${event.content_id}/bookmarks/me`),
        ]);

        setLiked(likeRes.data.liked);
        setBookmarked(bookmarkRes.data.bookmarked);
      } catch (err) {
        // 👉 로그인 안 했을 경우
        setLiked(false);
        setBookmarked(false);
      }
    };

    fetchStatus();
  }, [event.content_id]);

  // 🔥 좋아요 토글
  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `/api/events/${event.content_id}/likes/toggle`
      );

      setLiked(res.data.liked);
      setLikeCount(res.data.like_count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 북마크 토글
  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        `/api/events/${event.content_id}/bookmarks/toggle`
      );

      setBookmarked(res.data.bookmarked);
      setBookmarkCount(res.data.bookmark_count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className="w-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer bg-white"
    >
      {/* 🔥 이미지 */}
      <div className="relative">
        <img
          src={event.first_image || "/no-image.png"}
          alt={event.title}
          onError={handleImageError}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* 🔥 내용 */}
      <div className="p-3">
        <h3 className="font-semibold truncate">{event.title}</h3>

        {/* ⚠️ addr1 없으니까 region 사용 */}
        <p className="text-xs text-gray-500 truncate">
          📍 {event.addr1 || event.region}
        </p>

        {/* 🔥 좋아요 / 북마크 */}
        <div className="flex gap-3 mt-2 text-sm">
          <span
            onClick={handleLike}
            className={`cursor-pointer ${
              liked ? "text-red-500" : ""
            } ${loading ? "opacity-50" : ""}`}
          >
            ❤️ {likeCount}
          </span>

          <span
            onClick={handleBookmark}
            className={`cursor-pointer ${
              bookmarked ? "text-blue-500" : ""
            } ${loading ? "opacity-50" : ""}`}
          >
            🔖 {bookmarkCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;