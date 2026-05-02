import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import BookmarkToast from '../../components/BookmarkToast';

const BookmarkSection = ({ bookmarks, setBookmarks }) => {
  const navigate = useNavigate();

  const [unbookmarkedIds, setUnbookmarkedIds] = useState([]);

  const [bookmarkToastOpen, setBookmarkToastOpen] = useState(false);
  const [bookmarkToastState, setBookmarkToastState] = useState(false);

  const NO_IMAGE_URL =
    'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';

  const handleCardClick = (contentId) => {
    navigate(`/events/${contentId}`);
  };

    const handleToggleBookmark = async (e, contentId) => {
    e.stopPropagation();

    try {
        const res = await api.post(`/api/events/${contentId}/bookmarks/toggle`);

        if (!res.data.success) return;

        if (res.data.bookmarked) {
        setUnbookmarkedIds((prev) => prev.filter((id) => id !== contentId));
        } else {
        setUnbookmarkedIds((prev) =>
            prev.includes(contentId) ? prev : [...prev, contentId]
        );
        }

        setBookmarkToastState(res.data.bookmarked);
        setBookmarkToastOpen(true);
    } catch (error) {
        console.error('북마크 변경 실패:', error);
        alert('북마크 변경에 실패했습니다.');
    }
    };


  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-xl font-black text-gray-900">북마크 목록</h2>
        </div>

        {bookmarks.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {bookmarks.map((item) => {
              const isBookmarked = !unbookmarkedIds.includes(item.content_id);
              return(
                <div
                    key={item.content_id}
                    onClick={() => handleCardClick(item.content_id)}
                    className="w-[260px] flex-none bg-white rounded-3xl shadow-sm border border-gray-100 p-3 relative group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                    <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
                    <img
                        src={item.first_image || NO_IMAGE_URL}
                        alt={item.title}
                        onError={(e) => {
                        e.currentTarget.src = NO_IMAGE_URL;
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    </div>

                    <div className="px-1 pr-12">
                    <p className="font-bold text-sm truncate text-gray-900">
                        {item.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-400 truncate">
                        {item.region || '지역 정보 없음'}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                        {item.start_date} ~ {item.end_date}
                    </p>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(e, item.content_id)}
                        className={`absolute bottom-4 right-4 group/bookmark flex items-center justify-center rounded-full border p-2 transition-all active:scale-95 ${
                            isBookmarked
                            ? 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                        aria-label={isBookmarked ? '북마크 해제' : '북마크 저장'}
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform group-hover/bookmark:scale-110 ${
                            isBookmarked ? 'fill-current' : 'fill-none'
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
                    </button>

                </div>
            )})}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm font-bold text-gray-400">
            저장된 북마크가 없습니다.
          </div>
        )}
      </div>

      <BookmarkToast
        open={bookmarkToastOpen}
        bookmarked={bookmarkToastState}
        onClose={() => setBookmarkToastOpen(false)}
      />
    </>
  );
};

export default BookmarkSection;
