import React, { useState } from 'react';
import Modal from '../../components/modal'; // 어제 만든 그 모달!

const CourseSection = ({ courses, setCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 코스 클릭 시 상세 모달 열기
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
        {courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course.course_id} 
              className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-[#0369A1]">{course.course_title}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                    // 삭제 로직 호출 (부모에서 넘겨받은 함수 실행)
                  }}
                  className="text-gray-300 hover:text-red-500 text-xs font-bold transition-colors"
                >
                  삭제
                </button>
              </div>

              {/* 피그마의 그 화살표 타임라인 UI */}
              <div className="flex items-center gap-4">
                {course.course.map((spot, idx) => (
                  <React.Fragment key={spot.content_id}>
                    <div className="flex-1 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-50">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={spot.first_image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-gray-700 truncate">{spot.title}</p>
                    </div>
                    
                    {/* 장소 사이 화살표 */}
                    {idx < course.course.length - 1 && (
                      <div className="text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* 상세 보기 화살표 버튼 */}
                <div className="ml-4 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-[#0369A1] group-hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 text-center text-gray-400 font-bold">
            저장된 AI 추천 코스가 없습니다.
          </div>
        )}
      </div>

      {/* 상세 모달 연결 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseData={selectedCourse} 
      />
    </div>
  );
};

export default CourseSection;