import React from 'react';

const ReviewList = ({ reviews, loading }) => {
    if (loading) return <div className="text-gray-400 py-10">리뷰를 불러오는 중...</div>;

    return (
        <div className="divide-y divide-gray-100">
            {reviews.length > 0 ? (
                reviews.map((r) => (
                    <div key={r.review_id} className="py-8 space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xs font-bold">
                                {r.nickname?.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-900">{r.nickname}</span>
                            <span className="text-xs text-gray-300 font-medium">{r.created_at?.split('T')[0]}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed pl-11">{r.content}</p>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 text-gray-400">아직 작성된 리뷰가 없습니다.</div>
            )}
        </div>
    );
};

export default ReviewList;