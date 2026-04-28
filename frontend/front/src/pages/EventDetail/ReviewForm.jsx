import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ eventId, onReviewAdded }) => {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return alert("내용을 입력해주세요.");

        try {
            const res = await axios.post(`/api/events/${eventId}/reviews`, { content });
            if (res.data.success) {
                onReviewAdded(res.data.review); // 부모 리스트에 추가
                setContent(""); // 입력창 초기화
                alert("리뷰가 등록되었습니다!");
            }
        } catch (err) {
            alert("리뷰 등록에 실패했습니다. 로그인 상태를 확인해주세요.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-[24px]">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-400 font-medium text-gray-700 resize-none shadow-inner"
                placeholder="이 행사에 참여하셨나요? 후기를 들려주세요!"
            />
            <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all">
                    리뷰 등록하기
                </button>
            </div>
        </form>
    );
};

export default ReviewForm;