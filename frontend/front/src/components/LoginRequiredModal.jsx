import React, { useEffect } from 'react';

const LoginRequiredModal = ({ open, onClose, onLogin }) => {
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

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-modalPop">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V8a5 5 0 00-10 0v3H6a2 2 0 00-2 2v6a2 2 0 002 2zm3-10V8a3 3 0 016 0v3"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          로그인이 필요합니다
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          이 기능을 사용하려면 먼저 로그인해주세요.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onLogin}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
