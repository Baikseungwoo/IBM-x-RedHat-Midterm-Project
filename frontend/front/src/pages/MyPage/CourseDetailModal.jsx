import React from 'react';
import Modal from '../../components/modal';

const CourseDetailModal = ({ open, courseData, onClose }) => {
  if (!open || !courseData) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[82vh] overflow-y-auto rounded-[32px] bg-white p-3 shadow-2xl animate-modalPop">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-lg transition hover:bg-gray-900 hover:text-white active:scale-95"
          aria-label="닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <Modal courseData={courseData} variant="popup" />
      </div>
    </div>
  );
};

export default CourseDetailModal;
