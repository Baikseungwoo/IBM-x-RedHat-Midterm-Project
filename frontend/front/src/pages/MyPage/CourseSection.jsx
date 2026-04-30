import React, { useState } from 'react';
import Modal from '../../components/modal';

const CourseSection = ({ courses, setCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // courses가 undefined/null일 때 대비
  const safeCourses = Array.isArray(courses) ? courses : [];

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">AI 추천 코스 목록</h2>
      </div>

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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-[#0369A1]">{course.course_title}</h3>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseData={selectedCourse}
      />
    </div>
  );
};

export default CourseSection;
