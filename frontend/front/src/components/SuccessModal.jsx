import React, { useEffect } from 'react';

const SuccessModal = ({ open, title, message, buttonText = '확인', onConfirm }) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onConfirm?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [open, onConfirm]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

      <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-8 text-center shadow-2xl animate-successPop">
        <div className="absolute -top-16 -left-16 h-36 w-36 rounded-full bg-blue-200/50 blur-2xl" />
        <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-emerald-200/60 blur-2xl" />

        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/30 animate-checkPulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-14 text-white animate-checkDraw"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="relative text-2xl font-black text-gray-900">
          {title}
        </h2>

        <p className="relative mt-3 text-sm leading-6 text-gray-600">
          {message}
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="relative mt-7 w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-600 active:scale-95"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
