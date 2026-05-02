import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from './../../api';
import { useAuth } from '../../contexts/AuthContext';
import LoginRequiredModal from '../../components/LoginRequiredModal';


const EventDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { isLoggedIn, authLoading } = useAuth();

  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [reviewContent, setReviewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);


  const mapRef = useRef(null);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);

        const [eventRes, reviewRes] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get(`/api/events/${id}/reviews`),
        ]);

        setEvent(eventRes.data.event);
        setReviews(reviewRes.data.reviews || []);
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };


    fetchPublicData();
  }, [id]);

  useEffect(() => {
  if (authLoading) return;

  const fetchMyInteraction = async () => {
      if (!isLoggedIn) {
        setLiked(false);
        setBookmarked(false);
        return;
      }

      try {
        const [likeRes, bookmarkRes] = await Promise.all([
          api.get(`/api/events/${id}/likes/me`),
          api.get(`/api/events/${id}/bookmarks/me`),
        ]);

        setLiked(likeRes.data.liked);
        setBookmarked(bookmarkRes.data.bookmarked);
      } catch (err) {
        console.error(err);
        setLiked(false);
        setBookmarked(false);
      }
    };

    fetchMyInteraction();
  }, [id, isLoggedIn, authLoading]);


  useEffect(() => {
  if (!event?.mapx || !event?.mapy) return;
  if (!mapRef.current) return;

  const initMap = () => {
    if (!window.naver?.maps || !mapRef.current) return;

    const position = new window.naver.maps.LatLng(
      Number(event.mapy),
      Number(event.mapx)
    );

    const map = new window.naver.maps.Map(mapRef.current, {
      center: position,
      zoom: 15,
    });

    new window.naver.maps.Marker({
      position,
      map,
    });

    setTimeout(() => {
      window.naver.maps.Event.trigger(map, 'resize');
      map.setCenter(position);
    }, 100);
  };

  if (window.naver?.maps) {
    initMap();
    return;
  }

  const existingScript = document.querySelector(
    'script[src*="oapi.map.naver.com/openapi/v3/maps.js"]'
  );

  if (existingScript) {
    existingScript.addEventListener('load', initMap);
    return () => {
      existingScript.removeEventListener('load', initMap);
    };
  }

  const script = document.createElement('script');
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
  script.async = true;
  script.onload = initMap;
  document.head.appendChild(script);

  return () => {
    script.onload = null;
  };
}, [event]);


  // 좋아요
  const handleLike = async () => {
    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${id}/likes/toggle`);

      setLiked(res.data.liked);
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
    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${id}/bookmarks/toggle`);

      setBookmarked(res.data.bookmarked);
      setEvent((prev) => ({
        ...prev,
        bookmark_count: res.data.bookmark_count,
      }));
    } catch (err) {
      console.error(err);
    }
  };


  // 리뷰 작성
  const handleSubmitReview = async () => {
    if (!requireLogin()) return;

    if (!reviewContent.trim()) {
      alert("리뷰 내용을 입력하세요.");
      return;
    }

    try {
      const res = await api.post(`/api/events/${id}/reviews`, {
        content: reviewContent,
      });

      setReviews((prev) => [res.data.review, ...prev]);
      setReviewContent("");
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <div>로딩중...</div>;
  if (!event) return <div>데이터 없음</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex gap-8">
          <div className="w-[400px] h-[250px] bg-gray-300">
            <img
              src={event.first_image || "/no-image.png"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2 text-sm">
            <p>행사 이름 : {event.title}</p>
            <p>행사 장소 : {event.addr1}</p>
            <p>행사 홈페이지 : {event.homepage?.trim() ? event.homepage : "-- --"}</p>
            <p>행사 연락처 : {event.tel}</p>
            <p>행사 진행 시간 : {event.play_time}</p>
            <p>행사 프로그램 : {event.program}</p>
            <p>주최자 : {event.sponsor1}</p>
            <p>주최자 연락처 : {event.sponsor1_tel}</p>
          </div>
        </div>

        <div className="mt-8">
          <div
            ref={mapRef}
            className="w-full h-[300px] mx-auto rounded overflow-hidden"
          />

          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={handleLike}
              className={`group flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                liked
                  ? "border-red-100 bg-red-50 text-red-500"
                  : "border-gray-200 bg-white text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  liked ? "fill-current" : "fill-none"
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>

              <span>{event.like_count}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className={`group flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                bookmarked
                  ? "border-blue-100 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-500 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                  bookmarked ? "fill-current" : "fill-none"
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 3.75h12A1.25 1.25 0 0119.25 5v15.25l-7.25-4-7.25 4V5A1.25 1.25 0 016 3.75z"
                />
              </svg>

              <span>{event.bookmark_count}</span>
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">리뷰 작성</h2>

          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className="w-full border p-2"
            placeholder="리뷰를 입력하세요"
          />

          <button
            type="button"
            onClick={handleSubmitReview}
            className="mt-3 px-4 py-2 bg-blue-500 text-white"
          >
            등록
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">리뷰 목록</h2>

          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.review_id} className="border-b py-3">
                <p className="font-bold">{r.nickname}</p>
                <p>{r.content}</p>
              </div>
            ))
          ) : (
            <p>리뷰가 없습니다.</p>
          )}
        </div>
      </div>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={() => {
          setLoginModalOpen(false);
          navigate('/login');
        }}
      />
    </>
  );

};

export default EventDetail;