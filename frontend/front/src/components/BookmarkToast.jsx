import React, { useEffect } from 'react';

const BookmarkToast = ({ open, bookmarked, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 animate-toastUp">
      <div
        className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl border backdrop-blur-md ${
          bookmarked
            ? 'bg-blue-600 text-white border-blue-400'
            : 'bg-white text-gray-800 border-gray-200'
        }`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            bookmarked ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${bookmarked ? 'fill-current' : 'fill-none'}`}
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
        </div>

        <div>
          <p className="text-sm font-black">
            {bookmarked ? '북마크에 저장되었습니다' : '북마크에서 삭제되었습니다'}
          </p>
          <p className={`mt-0.5 text-xs ${bookmarked ? 'text-blue-100' : 'text-gray-400'}`}>
            마이페이지에서 북마크 목록을 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkToast;
