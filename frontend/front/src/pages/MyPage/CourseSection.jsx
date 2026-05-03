import React, { useState } from 'react';
import CourseDetailModal from './CourseDetailModal';
import api from '../../api';

const CourseSection = ({ courses, setCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDoneOpen, setDeleteDoneOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // courses가 undefined/null일 때 대비
  const safeCourses = Array.isArray(courses) ? courses : [];

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, course) => {
    e.stopPropagation();
    setDeleteTarget(course);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const res = await api.delete(`/api/users/me/courses/${deleteTarget.course_id}`);

      if (res.data.success) {
        setCourses((prev) =>
          prev.filter((course) => course.course_id !== deleteTarget.course_id)
        );

        setIsModalOpen(false);
        setSelectedCourse(null);

        setDeleteTarget(null);
        setDeleteDoneOpen(true);
      }
    } catch (error) {
      console.error('코스 삭제 실패:', error);
      alert('코스 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      

      <div className="flex flex-col gap-6">
        {safeCourses.length > 0 ? (
          safeCourses.map((course) => {
            // course.course가 undefined/null일 때 대비
            const spots = Array.isArray(course?.course) ? course.course : [];

            return (
              <div
                key={course.course_id}
                className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative cursor-pointer"
                onClick={() => handleCourseClick(course)}
              >
                <div className="flex justify-between items-center mb-6 gap-4">
                  <h3 className="text-lg font-black text-[#0369A1] truncate">
                    {course.course_title}
                  </h3>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, course)}
                    className="flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-black text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 7h12m-9 0V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m-7-10l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"
                      />
                    </svg>
                    삭제
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {spots.map((spot, idx) => (
                    <React.Fragment key={spot.content_id ?? idx}>
                      <div className="flex-1 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-50">
                        <div className="w-13 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          <img src={spot.first_image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-bold text-gray-700 truncate">{spot.title}</p>
                      </div>

                      {idx < spots.length - 1 && (
                        <div className="text-gray-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 text-center text-gray-400 font-bold">
            저장된 AI 추천 코스가 없습니다.
          </div>
        )}
      </div>

      <CourseDetailModal
        open={isModalOpen}
        courseData={selectedCourse}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCourse(null);
        }}
      />
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
            onClick={() => {
              if (!isDeleting) setDeleteTarget(null);
            }}
          />

          <div className="relative w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl animate-modalPop">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
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

            <h3 className="text-center text-2xl font-black text-gray-900">
              코스를 삭제할까요?
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-gray-500">
              삭제한 코스는 이후 다시 확인할 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </p>

            <div className="mt-7 rounded-2xl bg-gray-50 p-4">
              <p className="truncate text-center text-sm font-bold text-gray-700">
                {deleteTarget.course_title}
              </p>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '삭제하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDoneOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

          <div className="relative w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-2xl animate-successPop">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 animate-checkPulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 animate-checkDraw"
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

            <h3 className="text-2xl font-black text-gray-900">
              삭제 완료
            </h3>

            <p className="mt-3 text-sm text-gray-500">
              저장한 코스가 삭제되었습니다.
            </p>

            <button
              type="button"
              onClick={() => setDeleteDoneOpen(false)}
              className="mt-7 w-full rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 active:scale-95"
            >
              확인
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default CourseSection;
