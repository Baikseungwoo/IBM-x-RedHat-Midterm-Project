import React from 'react';

const EventInfo = ({ event, liked, bookmarked, onLike, onBookmark }) => {
  return (
    <div className="flex flex-col md:flex-row gap-10 items-start">
      {/* 1. 이미지 섹션 */}
      <div className="w-full md:w-[400px] h-[300px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
        <img
          src={event.first_image || "/no-image.png"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. 정보 및 버튼 섹션 */}
      <div className="flex-1 flex flex-col h-full min-h-[300px] justify-between py-1">
        <div className="space-y-2 text-sm text-gray-700">
          <h1 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h1>
          
          <div className="space-y-1.5">
            <p><span className="font-semibold w-24 inline-block">행사 이름 :</span> {event.title}</p>
            <p><span className="font-semibold w-24 inline-block">행사 장소 :</span> {event.addr1}</p>
            <p>
              <span className="font-semibold w-24 inline-block">행사 홈페이지 :</span> 
              {event.event_homepage?.trim() ? (
                <a href={event.event_homepage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {event.event_homepage}
                </a>
              ) : "-- --"}
            </p>
            <p><span className="font-semibold w-24 inline-block">행사 연락처 :</span> {event.tel || "-- --"}</p>
            <p><span className="font-semibold w-24 inline-block">행사 진행 시간 :</span> {event.play_time || "-- --"}</p>
            <p><span className="font-semibold w-24 inline-block">행사 프로그램 :</span> {event.program || "-- --"}</p>
            <p><span className="font-semibold w-24 inline-block">주최자 :</span> {event.sponsor1 || "-- --"}</p>
            <p><span className="font-semibold w-24 inline-block">주최자 연락처 :</span> {event.sponsor1_tel || "-- --"}</p>
          </div>
        </div>

        {/* 3. 반응 버튼 섹션 (EventCard SVG 적용) */}
        <div className="flex gap-4 mt-6">
          {/* 좋아요 버튼 */}
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
              liked 
                ? "bg-red-50 border-red-100 text-red-500" 
                : "bg-white border-gray-100 text-gray-400 hover:border-red-100 hover:text-red-300"
            }`}
          >
            <svg 
              className={`w-5 h-5 transition-colors ${liked ? "fill-current" : "fill-none"}`} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-bold">{event.like_count}</span>
          </button>

          {/* 북마크 버튼 */}
          <button
            onClick={onBookmark}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all active:scale-95 ${
              bookmarked 
                ? "bg-blue-50 border-blue-100 text-blue-500" 
                : "bg-white border-gray-100 text-gray-400 hover:border-blue-100 hover:text-blue-300"
            }`}
          >
            <svg 
              className={`w-5 h-5 transition-colors ${bookmarked ? "fill-current" : "fill-none"}`} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="font-bold">{bookmarked ? "저장됨" : "저장하기"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;