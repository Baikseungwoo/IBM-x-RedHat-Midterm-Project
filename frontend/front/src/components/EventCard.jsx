import React, { useState, useEffect } from "react";
import axios from "axios";

const EventCard = ({ event, onClick }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(event.like_count || 0);
  const [bookmarkCount, setBookmarkCount] = useState(event.bookmark_count || 0);

  const handleImageError = (e) => {
    e.target.src = "/no-image.png";
  };

  // 👉 초기 상태 가져오기
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const likeRes = await axios.get(
          `/api/events/${event.content_id}/likes/me`
        );
        const bookmarkRes = await axios.get(
          `/api/events/${event.content_id}/bookmarks/me`
        );

        setLiked(likeRes.data.liked);
        setBookmarked(bookmarkRes.data.bookmarked);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();
  }, [event.content_id]);

  // ❤️ 좋아요 토글
  const handleLike = async (e) => {
    e.stopPropagation();

    try {
      await axios.post(`/api/events/${event.content_id}/likes/toggle`);

      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔖 북마크 토글
  const handleBookmark = async (e) => {
    e.stopPropagation();

    try {
      await axios.post(`/api/events/${event.content_id}/bookmarks/toggle`);

      setBookmarked(!bookmarked);
      setBookmarkCount((prev) => (bookmarked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={onClick}
      className="w-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer bg-white"
    >
      <div className="relative">
        <img
          src={event.first_image || "/no-image.png"}
          alt={event.title}
          onError={handleImageError}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold truncate">{event.title}</h3>
        <p className="text-xs text-gray-500 truncate">📍 {event.addr1}</p>

        <div className="flex gap-3 mt-2 text-sm">
          <span
            onClick={handleLike}
            className={`cursor-pointer ${liked ? "text-red-500" : ""}`}
          >
            ❤️ {likeCount}
          </span>

          <span
            onClick={handleBookmark}
            className={`cursor-pointer ${bookmarked ? "text-blue-500" : ""}`}
          >
            🔖 {bookmarkCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;