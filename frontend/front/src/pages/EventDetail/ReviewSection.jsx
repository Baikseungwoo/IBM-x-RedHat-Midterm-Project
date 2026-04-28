import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const ReviewSection = ({ eventId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // 리뷰 목록 가져오기
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/events/${eventId}/reviews`);
            if (res.data.success) {
                setReviews(res.data.reviews);
            }
        } catch (err) {
            console.error("리뷰 로드 실패", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [eventId]);

    // 새로운 리뷰가 등록되었을 때 리스트를 새로고침하는 함수
    const handleReviewAdded = (newReview) => {
        setReviews(prev => [newReview, ...prev]);
    };

    return (
        <div className="mt-16 space-y-10">
            <h2 className="text-2xl font-bold text-gray-900">리뷰 {reviews.length}개</h2>
            
            {/* 1. 리뷰 작성 컴포넌트 */}
            <ReviewForm eventId={eventId} onReviewAdded={handleReviewAdded} />
            
            {/* 2. 리뷰 목록 컴포넌트 */}
            <ReviewList reviews={reviews} loading={loading} />
        </div>
    );
};

export default ReviewSection;