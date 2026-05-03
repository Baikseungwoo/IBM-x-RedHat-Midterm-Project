import React, { useEffect } from 'react';

const RecommendErrorModal = ({ open, message, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-8 shadow-2xl animate-modalPop">
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-rose-100 blur-3xl" />

        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h2 className="relative text-2xl font-black text-gray-900">
          추천을 만들 수 없어요
        </h2>

        <p className="relative mt-3 text-sm leading-6 text-gray-600">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="relative mt-7 w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-600 active:scale-95"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default RecommendErrorModal;
