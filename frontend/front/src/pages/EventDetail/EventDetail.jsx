import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./../../api";
import { useAuth } from "../../contexts/AuthContext";
import LoginRequiredModal from "../../components/LoginRequiredModal";
import BookmarkToast from "../../components/BookmarkToast";

const EventDetail = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { user, isLoggedIn, authLoading } = useAuth();

  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [reviewContent, setReviewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [deleteReviewTarget, setDeleteReviewTarget] = useState(null);

  const [bookmarkToastOpen, setBookmarkToastOpen] = useState(false);
  const [bookmarkToastState, setBookmarkToastState] = useState(false);

  const mapRef = useRef(null);

  const requireLogin = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return false;
    }

    return true;
  };

  const getProfileImageSrc = (imageData) => {
    if (!imageData) return null;
    return imageData.startsWith("data:")
      ? imageData
      : `data:image/png;base64,${imageData}`;
  };

  const getDisplayName = (reviewUser) =>
    reviewUser?.nickname || `사용자 ${reviewUser?.user_id || ""}`.trim();

  const formatReviewDate = (dateText) => {
    if (!dateText) return "";

    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatEventDate = (dateText) => {
    if (!dateText) return "--";

    const date = new Date(dateText);
    if (Number.isNaN(date.getTime())) return dateText;

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getHomepage = () => {
    const homepage = event?.homepage || event?.event_homepage || "";
    return homepage?.trim() || "";
  };

  const getHomepageHref = () => {
    const homepage = getHomepage();
    if (!homepage) return "";
    return homepage.startsWith("http") ? homepage : `https://${homepage}`;
  };

  const DetailInfo = ({ label, value, color = "sky" }) => {
    const colorMap = {
      sky: "bg-sky-50 text-sky-600",
      pink: "bg-pink-50 text-pink-500",
      emerald: "bg-emerald-50 text-emerald-500",
      yellow: "bg-yellow-50 text-yellow-600",
    };

    return (
      <div className="rounded-[22px] border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
        <p className={`mb-2 inline-flex rounded-full px-3 py-1 text-[11px] font-black ${colorMap[color]}`}>
          {label}
        </p>
        <p className="line-clamp-3 break-words text-sm font-bold leading-6 text-gray-700">
          {value || "--"}
        </p>
      </div>
    );
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
        window.naver.maps.Event.trigger(map, "resize");
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
      existingScript.addEventListener("load", initMap);
      return () => {
        existingScript.removeEventListener("load", initMap);
      };
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [event]);

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

  const handleBookmark = async () => {
    if (!requireLogin()) return;

    try {
      const res = await api.post(`/api/events/${id}/bookmarks/toggle`);

      setBookmarked(res.data.bookmarked);

      setEvent((prev) => ({
        ...prev,
        bookmark_count: res.data.bookmark_count,
      }));

      setBookmarkToastState(res.data.bookmarked);
      setBookmarkToastOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleDeleteReview = async () => {
    if (!requireLogin()) return;
    if (!deleteReviewTarget) return;

    try {
      await api.delete(`/api/reviews/${deleteReviewTarget.review_id}`);
      setReviews((prev) =>
        prev.filter((review) => review.review_id !== deleteReviewTarget.review_id)
      );
      setDeleteReviewTarget(null);
    } catch (err) {
      console.error(err);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="h-[360px] animate-pulse rounded-[36px] bg-white/50 shadow-2xl shadow-sky-200/40" />
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-[30px] bg-white/50" />
            <div className="h-72 animate-pulse rounded-[30px] bg-white/50" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/70 bg-white/70 px-8 py-14 text-center shadow-2xl shadow-sky-200/40 backdrop-blur-2xl">
          <p className="text-2xl font-black text-gray-800">행사 정보를 찾을 수 없습니다</p>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="mt-7 rounded-2xl bg-[#0369A1] px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-300/40 transition hover:bg-sky-500 active:scale-95"
          >
            행사 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#FFF8D7_0%,#E0F7FF_42%,#C9EEFF_72%,#B8E3FF_100%)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[7%] top-16 h-56 w-56 rounded-full bg-yellow-200/45 blur-3xl" />
          <div className="absolute right-[8%] top-40 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
          <div className="absolute bottom-28 left-[35%] h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-5 py-8 md:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 rounded-full border border-white/70 bg-white/65 px-5 py-2.5 text-sm font-black text-sky-700 shadow-sm backdrop-blur transition hover:bg-white active:scale-95"
          >
            목록으로 돌아가기
          </button>

          <section className="overflow-hidden rounded-[34px] border border-white/70 bg-white/65 shadow-2xl shadow-sky-200/40 backdrop-blur-2xl">
            <div className="grid gap-0 lg:grid-cols-[420px_minmax(0,1fr)]">
              <div className="relative h-[300px] overflow-hidden sm:h-[340px] lg:h-[380px]">
                <img
                  src={event.first_image || "/no-image.png"}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="mb-3 inline-flex rounded-full bg-white/85 px-4 py-2 text-xs font-black text-sky-700 shadow-sm backdrop-blur">
                    {event.region || "지역 정보 없음"}
                  </div>
                  <h1 className="line-clamp-2 text-3xl font-black leading-tight text-white drop-shadow-lg md:text-4xl">
                    {event.title}
                  </h1>
                </div>
              </div>

              <div className="relative p-6 md:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-200/45 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl" />

                <div className="relative">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
                    Festival Detail
                  </p>

                  <h2 className="mt-2 text-2xl font-black leading-tight text-gray-900 md:text-3xl">
                    여행 일정에 담고 싶은 행사 정보
                  </h2>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <DetailInfo
                      label="행사 기간"
                      value={`${formatEventDate(event.start_date)} ~ ${formatEventDate(event.end_date)}`}
                      color="sky"
                    />
                    <DetailInfo
                      label="행사 장소"
                      value={event.addr1}
                      color="pink"
                    />
                    <DetailInfo
                      label="연락처"
                      value={event.tel}
                      color="emerald"
                    />
                    <DetailInfo
                      label="운영 시간"
                      value={event.play_time}
                      color="yellow"
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleLike}
                      className={`group flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-black shadow-sm transition-all active:scale-95 ${
                        liked
                          ? "border-red-100 bg-red-50 text-red-500"
                          : "border-white/80 bg-white/75 text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-500"
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
                      좋아요 {event.like_count || 0}
                    </button>

                    <button
                      type="button"
                      onClick={handleBookmark}
                      className={`group flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-black shadow-sm transition-all active:scale-95 ${
                        bookmarked
                          ? "border-blue-100 bg-blue-50 text-blue-600"
                          : "border-white/80 bg-white/75 text-gray-500 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
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
                      북마크 {event.bookmark_count || 0}
                    </button>

                    {getHomepage() && (
                      <a
                        href={getHomepageHref()}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/80 bg-white/75 px-5 py-3 text-sm font-black text-sky-700 shadow-sm transition hover:bg-sky-50 active:scale-95"
                      >
                        홈페이지
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-[30px] border border-white/70 bg-white/65 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
                Program
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-900">행사 프로그램</h2>
              <p className="mt-4 max-h-[360px] overflow-y-auto pr-2 whitespace-pre-wrap text-sm font-semibold leading-8 text-gray-600">
                {event.program || "등록된 프로그램 정보가 없습니다."}
              </p>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/65 p-5 shadow-xl shadow-sky-100/50 backdrop-blur-2xl">
              <div className="pb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
                  Map
                </p>
                <h2 className="mt-2 text-2xl font-black text-gray-900">행사 위치</h2>
                <p className="mt-2 line-clamp-1 text-sm font-semibold text-gray-500">
                  {event.addr1 || "주소 정보가 없습니다."}
                </p>
              </div>

              <div
                ref={mapRef}
                className="h-[300px] w-full overflow-hidden rounded-[24px] bg-sky-50"
              />
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-[30px] border border-white/70 bg-white/65 p-6 shadow-xl shadow-sky-100/50 backdrop-blur-2xl">
              <div className="mb-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-500">
                  Review
                </p>
                <h2 className="mt-1 text-2xl font-black text-gray-900">리뷰 작성</h2>
              </div>

              <div className="rounded-[24px] bg-white/80 p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-sm font-black text-blue-600">
                    {getProfileImageSrc(user?.image_data) ? (
                      <img
                        src={getProfileImageSrc(user.image_data)}
                        alt={user?.nickname || "프로필"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{(user?.nickname || "U").slice(0, 1)}</span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-900">
                      {isLoggedIn ? user?.nickname || "사용자" : "로그인이 필요합니다"}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      행사에 대한 경험을 남겨주세요.
                    </p>
                  </div>
                </div>

                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="min-h-[120px] w-full resize-none rounded-2xl border border-sky-100 bg-sky-50/50 p-4 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  placeholder="리뷰를 입력하세요"
                />

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    className="rounded-full bg-gray-900 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-blue-600 active:scale-95"
                  >
                    리뷰 등록
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-500">
                    Comments
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-gray-900">리뷰 목록</h2>
                </div>
                <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-gray-500 shadow-sm">
                  총 {reviews.length}개
                </span>
              </div>

              {reviews.length > 0 ? (
                <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
                  {reviews.map((r) => (
                    <div
                      key={r.review_id}
                      className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-black text-gray-500">
                          {getProfileImageSrc(r.image_data) ? (
                            <img
                              src={getProfileImageSrc(r.image_data)}
                              alt={getDisplayName(r)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>{getDisplayName(r).slice(0, 1)}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <p className="font-black text-gray-900">
                                {getDisplayName(r)}
                              </p>
                              <span className="text-xs font-medium text-gray-400">
                                {formatReviewDate(r.created_at)}
                              </span>
                            </div>

                            {user?.user_id === r.user_id && (
                              <button
                                type="button"
                                onClick={() => setDeleteReviewTarget(r)}
                                className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white active:scale-95"
                              >
                                삭제
                              </button>
                            )}
                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                            {r.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/80 bg-white/55 px-6 py-12 text-center shadow-sm backdrop-blur">
                  <p className="text-sm font-bold text-gray-400">
                    아직 등록된 리뷰가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={() => {
          setLoginModalOpen(false);
          navigate("/login");
        }}
      />

      <BookmarkToast
        open={bookmarkToastOpen}
        bookmarked={bookmarkToastState}
        onClose={() => setBookmarkToastOpen(false)}
      />

      {deleteReviewTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => setDeleteReviewTarget(null)}
          />

          <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-7 shadow-2xl animate-modalPop">
            <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-red-100 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7h12m-9 0V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m-7-10l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"
                />
              </svg>
            </div>

            <h2 className="relative text-xl font-black text-gray-900">
              리뷰를 삭제할까요?
            </h2>

            <p className="relative mt-3 text-sm leading-6 text-gray-600">
              삭제한 리뷰는 다시 복구할 수 없습니다.
            </p>

            <div className="relative mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteReviewTarget(null)}
                className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 active:scale-95"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleDeleteReview}
                className="rounded-2xl bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 active:scale-95"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetail;
