import React, { useState, useEffect } from 'react';
import api from '../../api';

const EventReviewSection = ({ eventId }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. 리뷰 목록 조회 (GET /api/events/{id}/reviews) ---
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/events/${eventId}/reviews`);
      // 백엔드 서비스 응답: {"success": True, "reviews": reviews}
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error("리뷰 로드 에러:", err);
    }
  };

  useEffect(() => {
    if (eventId) fetchReviews();
  }, [eventId]);

  // --- 2. 리뷰 등록 (POST /api/events/{id}/reviews) ---
  const handleSubmitReview = async () => {
    if (!reviewContent.trim()) return alert("리뷰 내용을 입력해주세요.");
    
    setIsSubmitting(true);
    try {
      // payload에서 rating을 제외하고 content만 전송
      const res = await api.post(`/api/events/${eventId}/reviews`, {
        content: reviewContent
      });

      if (res.data.success) {
        setReviewContent("");
        fetchReviews(); // 목록 새로고침
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        alert("리뷰 등록 실패: 서버 설정을 확인하세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. 리뷰 수정 (PATCH /api/reviews/{review_id}) ---
  const handleUpdateReview = async (reviewId) => {
    if (!editContent.trim()) return alert("수정할 내용을 입력하세요.");
    try {
      // 백엔드 서비스: payload.content만 처리
      const res = await api.patch(`/api/reviews/${reviewId}`, {
        content: editContent
      });
      if (res.data.success) {
        setEditingReviewId(null);
        fetchReviews();
      }
    } catch (err) {
      alert("수정 권한이 없거나 오류가 발생했습니다.");
    }
  };

  // --- 4. 리뷰 삭제 (DELETE /api/reviews/{review_id}) ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;
    try {
      const res = await api.delete(`/api/reviews/${reviewId}`);
      if (res.data.success) {
        // 백엔드 서비스: {"success": True, "review_id": review_id}
        setReviews(prev => prev.filter(r => r.review_id !== reviewId));
      }
    } catch (err) {
      alert("삭제 권한이 없거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mt-16 mb-20 font-noto">
      <div className="bg-gray-50 rounded-[32px] p-8 mb-12 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-6 px-1">💬 리뷰 {reviews.length}개</h2>
        <div className="relative">
          <textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className="w-full h-32 p-6 rounded-2xl border-none outline-none text-gray-700 font-medium shadow-inner bg-white resize-none"
            placeholder="행사에 대한 솔직한 후기를 남겨주세요."
          />
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="absolute bottom-4 right-4 px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all disabled:bg-gray-300 shadow-lg"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.review_id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black">
                  {r.nickname?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-black text-gray-900">{r.nickname || "익명"}</p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 text-xs font-bold text-gray-300">
                <button onClick={() => { setEditingReviewId(r.review_id); setEditContent(r.content); }} className="hover:text-blue-500">수정</button>
                <button onClick={() => handleDeleteReview(r.review_id)} className="hover:text-red-500">삭제</button>
              </div>
            </div>

            {editingReviewId === r.review_id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border-2 border-blue-100 rounded-xl outline-none focus:border-blue-400 bg-blue-50/20"
                />
                <div className="flex gap-2 mt-3 justify-end">
                  <button onClick={() => setEditingReviewId(null)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-400">취소</button>
                  <button onClick={() => handleUpdateReview(r.review_id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">저장</button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 font-medium leading-relaxed pl-1 whitespace-pre-wrap">{r.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventReviewSection;