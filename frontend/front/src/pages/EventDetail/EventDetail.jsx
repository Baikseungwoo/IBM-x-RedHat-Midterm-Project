import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from './../../api';
import EventInfo from "./EventInfo";
import EventMap from "./EventMap";
import EventReviewSection from "./EventReviewSection";

const EventDetail = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 데이터 초기 로드 ---
const fetchData = async () => {
  setLoading(true);
  try {
  // 1. 공통 정보(로그인 상관 없음)는 먼저 가져옴
    const eventRes = await api.get(`/api/events/${id}`);
    setEvent(eventRes.data.event);

  // 2. 인증이 필요한 정보는 별도로 처리 (실패해도 무방)
  try {
    const [likeRes, bookmarkRes] = await Promise.all([
      api.get(`/api/events/${id}/likes/me`),
      api.get(`/api/events/${id}/bookmarks/me`),
    ]);
    setLiked(likeRes.data.liked);
    setBookmarked(bookmarkRes.data.bookmarked);
  } catch (authErr) {
  // 로그인 안 된 경우 기본값 유지
    setLiked(false);
    setBookmarked(false);
    }
  } catch (err) {
    console.error("데이터 로드 에러:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- 좋아요 토글 핸들러 ---
  const handleLike = async () => {
    try {
      const res = await api.post(`/api/events/${id}/likes/toggle`);
      setLiked(res.data.liked);
      // 좋아요 수 실시간 업데이트
      setEvent((prev) => ({
        ...prev,
        like_count: res.data.like_count,
      }));
    } catch (err) {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  // --- 북마크 토글 핸들러 ---
  const handleBookmark = async () => {
    try {
      const res = await api.post(`/api/events/${id}/bookmarks/toggle`);
      setBookmarked(res.data.bookmarked);
      // 북마크 수 실시간 업데이트
      setEvent((prev) => ({
        ...prev,
        bookmark_count: res.data.bookmark_count,
      }));
    } catch (err) {
      alert("로그인이 필요한 서비스입니다.");
    }
  };

  if (loading) return <div className="py-20 text-center font-bold text-gray-400 animate-pulse">데이터를 불러오는 중입니다...</div>;
  if (!event) return <div className="py-20 text-center font-bold text-red-400">행사 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-5xl mx-auto p-10 min-h-screen bg-white">
      
      {/* 1. 상단 정보 섹션 (행사정보 + 좋아요/북마크) */}
      <EventInfo 
        event={event} 
        liked={liked} 
        bookmarked={bookmarked} 
        onLike={handleLike} 
        onBookmark={handleBookmark} 
      />

      <hr className="my-12 border-gray-100" />

      {/* 2. 지도 섹션 */}
      <EventMap event={event} />

      <hr className="my-12 border-gray-100" />

      {/* 3. 리뷰 섹션 (리뷰 작성 + 목록) */}
      <EventReviewSection eventId={id} />

    </div>
  );
};

export default EventDetail;