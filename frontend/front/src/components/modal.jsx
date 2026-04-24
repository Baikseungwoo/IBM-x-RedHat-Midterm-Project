import React, { useEffect, useRef } from 'react';

const Modal = ({ courseData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (courseData && mapRef.current) {

      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [courseData]);

  if (!courseData) {
    return (
      <div className="w-full p-20 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-200 text-center animate-pulse">
        <div className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
          Waiting for response
        </div>
        <p className="text-gray-400 font-bold text-xl">AI 맞춤 코스 분석기</p>
        <p className="text-gray-300 text-sm mt-1">
          지역, 날짜, 키워드를 기반으로 GPT가 장소 3곳을 선정하여 코스를 제안합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-10 bg-[#E5E7EB]/50 backdrop-blur-xl rounded-[60px] border border-white shadow-inner animate-fadeInUp">
      <div className="mb-10 text-center relative flex flex-col items-center">
        <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">
          {courseData.course_title}
        </h2>
        <div className="flex gap-2 text-xs font-bold text-blue-600 bg-blue-100 px-4 py-1 rounded-full uppercase">
          <span>🗓️ {courseData.date}</span>
          <span>📍 {courseData.region}</span>
          <span>💡 {courseData.keyword}</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-10 mb-12">
        {courseData.course.map((item, idx) => (
          <React.Fragment key={item.content_id}>
            <div className="relative flex-1 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 group cursor-pointer hover:shadow-xl transition-all">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 shadow-inner">
                <img src={item.first_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[#0369A1] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  {idx + 1}
                </div>
              </div>
              <div className="px-1">
                <h4 className="font-bold text-gray-900 text-sm truncate">{item.title}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.addr1}</p>
              </div>
            </div>
            
            {idx < courseData.course.length - 1 && (
              <div className="flex-shrink-0 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-[1.2] bg-white rounded-[32px] p-8 shadow-inner border border-gray-100">
          <p className="text-gray-400 font-bold mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            AI Course Description
          </p>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line border-l-4 border-blue-200 pl-4">
            {courseData.description}
          </p>
        </div>

        <div className="flex-1 rounded-[32px] overflow-hidden shadow-inner border-2 border-white relative min-h-[300px]">
          <div ref={mapRef} className="w-full h-full bg-[#E5E3DF]">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-200/50">
              <p className="font-bold">MAP API AREA</p>
              <p className="text-[10px] mt-1 opacity-60">
                좌표: {courseData.course.map(c => `(${c.mapx}, ${c.mapy})`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;