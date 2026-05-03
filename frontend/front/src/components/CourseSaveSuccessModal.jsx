import React, { useEffect } from 'react';

const CourseSaveSuccessModal = ({ open, onClose, onGoMyPage }) => {
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

      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl animate-modalPop">
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-emerald-100 blur-3xl" />

        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-50 text-emerald-500 shadow-sm">
          <svg
            className="h-11 w-11"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="relative text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-500">
            Course Saved
          </p>

          <h2 className="mt-3 text-2xl font-black text-gray-900">
            코스가 저장되었습니다
          </h2>

          <p className="mt-3 text-sm font-semibold leading-6 text-gray-500">
            저장한 AI 추천 코스는 마이페이지에서 다시 확인할 수 있습니다.
          </p>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 active:scale-95"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={onGoMyPage}
            className="flex-1 rounded-2xl bg-[#0369A1] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-300/40 transition hover:bg-gray-900 active:scale-95"
          >
            마이페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSaveSuccessModal;
